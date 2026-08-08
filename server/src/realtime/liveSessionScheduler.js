import LiveSession from '../models/LiveSession.js';
import Booking from '../models/Booking.js';
import { notifyUser } from '../utils/notify.js';
import { getIO } from './io.js';

const SCAN_INTERVAL_MS = 60 * 1000;
const REMINDER_WINDOW_MS = 10 * 60 * 1000;

async function sendReminders() {
  const now = new Date();
  const windowEnd = new Date(now.getTime() + REMINDER_WINDOW_MS);

  // Sessions starting within the next 10 minutes that haven't had a
  // reminder sent yet. reminderSentAt is cleared on reschedule (see
  // updateLiveSession) so an edited session gets a fresh reminder.
  const due = await LiveSession.find({
    status: 'scheduled',
    startTime: { $gte: now, $lte: windowEnd },
    reminderSentAt: null
  });

  for (const session of due) {
    const studentIds = await Booking.distinct('user', { skillId: session.skillId, status: { $ne: 'cancelled' } });
    const io = getIO();

    for (const id of studentIds) {
      io?.to(id.toString()).emit('live-session:update', {
        session: session.toJSON(),
        event: 'reminder'
      });
    }

    await Promise.all(
      studentIds.map((id) =>
        notifyUser({
          user: id,
          type: 'system',
          text: `"${session.title}" for ${session.skillTitle} starts in 10 minutes.`,
          link: `/live-sessions/${session.id}`
        }).catch(() => {})
      )
    );

    session.reminderSentAt = now;
    await session.save();
  }
}

// Sessions that went live but were never explicitly ended and have run
// well past their scheduled end time are auto-closed so they don't sit
// "live" forever in student dashboards.
async function autoEndOverrunSessions() {
  const cutoff = new Date(Date.now() - 30 * 60 * 1000); // 30 min grace past endTime
  const overrun = await LiveSession.find({ status: 'live', endTime: { $lte: cutoff } });

  for (const session of overrun) {
    const now = new Date();
    session.status = 'ended';
    session.endedAt = now;
    for (const entry of session.attendance) {
      if (entry.joinedAt && !entry.leftAt) {
        entry.leftAt = now;
        // Duration counts from confirmedAt (actually inside the Jitsi
        // conference), not joinedAt (just clicked Join) — see the same
        // logic in liveSessionsController.js's endLiveSession/leaveLiveSession.
        if (entry.confirmedAt) {
          entry.totalSeconds += Math.max(0, Math.round((now - entry.confirmedAt) / 1000));
        }
      }
    }
    await session.save();

    const studentIds = await Booking.distinct('user', { skillId: session.skillId, status: { $ne: 'cancelled' } });
    const io = getIO();
    for (const id of studentIds) {
      io?.to(id.toString()).emit('live-session:update', { session: session.toJSON(), event: 'ended' });
    }
  }
}

let timer = null;

export function startLiveSessionScheduler() {
  if (timer) return;
  timer = setInterval(() => {
    sendReminders().catch((err) => console.error('liveSessionScheduler reminder scan failed:', err));
    autoEndOverrunSessions().catch((err) => console.error('liveSessionScheduler auto-end scan failed:', err));
  }, SCAN_INTERVAL_MS);
  timer.unref?.(); // don't keep the process alive just for this timer
}

export function stopLiveSessionScheduler() {
  if (timer) clearInterval(timer);
  timer = null;
}
