import LiveSession from '../models/LiveSession.js';
import Skill from '../models/Skill.js';
import Booking from '../models/Booking.js';
import { parsePagination, paginationMeta } from '../utils/pagination.js';
import { notifyUser } from '../utils/notify.js';
import { getIO } from '../realtime/io.js';

// Mirrors LiveSession's toJSON transform for .lean() results.
function leanSession(s) {
  const { _id, __v, ...rest } = s;
  return { id: _id, ...rest };
}

// There is no separate Enrollment collection — a student is "enrolled" in
// a skill if they have a non-cancelled Booking on it (same source of truth
// bookingsController's mentor-side aggregates already use). Distinct user
// ids, regardless of how many sessions each has booked with this mentor.
async function getEnrolledStudentIds(skillId) {
  const ids = await Booking.distinct('user', { skillId, status: { $ne: 'cancelled' } });
  return ids.map((id) => id.toString());
}

async function findSkillMentoredBy(skillId, mentorUserId) {
  const skill = await Skill.findOne({ id: skillId });
  if (!skill) return { error: 404, message: `No skill found with id "${skillId}"` };
  if (!skill.mentorUser || skill.mentorUser.toString() !== mentorUserId.toString()) {
    return { error: 403, message: "You're not the mentor for this course" };
  }
  return { skill };
}

async function findSessionAsMentor(sessionId, mentorUserId) {
  const session = await LiveSession.findById(sessionId);
  if (!session) return { error: 404, message: 'Live session not found' };
  if (session.mentor.toString() !== mentorUserId.toString()) {
    return { error: 403, message: "You're not the mentor for this session" };
  }
  return { session };
}

// A student may only touch a session if they're actually enrolled in its
// course (i.e. have a non-cancelled booking for that skillId).
async function assertEnrolled(session, userId) {
  const booked = await Booking.exists({ skillId: session.skillId, user: userId, status: { $ne: 'cancelled' } });
  return Boolean(booked);
}

// Deterministic Jitsi room name per session — nothing to store or look up,
// and it can't collide with another session's room.
function jitsiRoomName(sessionId) {
  return `skillswap-${sessionId}`;
}

function withJoinUrl(sessionJson) {
  if (sessionJson.meetingProvider === 'jitsi' && !sessionJson.meetingUrl) {
    sessionJson.jitsiRoom = jitsiRoomName(sessionJson.id);
  }
  return sessionJson;
}

// Pushes a real-time update to every enrolled student's own socket room
// (same room they already join on connect — see server.js) plus a
// persisted+pushed notification via the existing notifyUser() helper.
// event is a small payload merged onto { type: 'live-session', session }.
async function broadcastToStudents(session, { text, link, event }) {
  const studentIds = await getEnrolledStudentIds(session.skillId);
  const io = getIO();
  const payload = { session: withJoinUrl(session.toJSON()), event };

  for (const id of studentIds) {
    io?.to(id).emit('live-session:update', payload);
  }

  // Fire-and-forget notifications — don't block the API response on N
  // notification writes; a single failure here shouldn't fail the request.
  Promise.all(
    studentIds.map((id) => notifyUser({ user: id, type: 'system', text, link }).catch(() => {}))
  ).catch(() => {});
}

// POST /api/live-sessions  (protected — mentor who owns the course)
export async function createLiveSession(req, res, next) {
  try {
    const { skillId, title, description, startTime, durationMinutes, timezone, meetingProvider, meetingUrl, maxParticipants } = req.body;

    const { skill, error, message } = await findSkillMentoredBy(skillId, req.user._id);
    if (error) return res.status(error).json({ message });

    const endTime = new Date(startTime.getTime() + durationMinutes * 60000);

    const session = await LiveSession.create({
      mentor: req.user._id,
      skillId: skill.id,
      skillTitle: skill.title,
      title,
      description: description || '',
      startTime,
      durationMinutes,
      endTime,
      timezone: timezone || 'UTC',
      meetingProvider: meetingProvider || 'jitsi',
      meetingUrl: meetingUrl || null,
      maxParticipants: maxParticipants || null
    });

    await broadcastToStudents(session, {
      text: `${req.user.name} scheduled a new live session for ${skill.title}: "${title}".`,
      link: `/live-sessions/${session.id}`,
      event: 'created'
    });

    res.status(201).json({ liveSession: withJoinUrl(session.toJSON()) });
  } catch (err) {
    next(err);
  }
}

// PUT /api/live-sessions/:id  (protected — mentor)
export async function updateLiveSession(req, res, next) {
  try {
    const { session, error, message } = await findSessionAsMentor(req.params.id, req.user._id);
    if (error) return res.status(error).json({ message });

    if (session.status !== 'scheduled') {
      return res.status(400).json({ message: 'Only scheduled sessions can be edited' });
    }

    const fields = ['title', 'description', 'startTime', 'durationMinutes', 'timezone', 'meetingProvider', 'meetingUrl', 'maxParticipants'];
    for (const field of fields) {
      if (req.body[field] !== undefined) session[field] = req.body[field] || null;
    }
    if (req.body.startTime || req.body.durationMinutes) {
      session.endTime = new Date(session.startTime.getTime() + session.durationMinutes * 60000);
      session.reminderSentAt = null; // schedule changed — allow a fresh reminder
    }

    await session.save();

    await broadcastToStudents(session, {
      text: `The live session "${session.title}" for ${session.skillTitle} was updated.`,
      link: `/live-sessions/${session.id}`,
      event: 'updated'
    });

    res.json({ liveSession: withJoinUrl(session.toJSON()) });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/live-sessions/:id  (protected — mentor)
export async function deleteLiveSession(req, res, next) {
  try {
    const { session, error, message } = await findSessionAsMentor(req.params.id, req.user._id);
    if (error) return res.status(error).json({ message });

    await session.deleteOne();

    await broadcastToStudents(session, {
      text: `The live session "${session.title}" for ${session.skillTitle} was removed.`,
      link: null,
      event: 'deleted'
    });

    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/live-sessions/:id/cancel  (protected — mentor)
export async function cancelLiveSession(req, res, next) {
  try {
    const { session, error, message } = await findSessionAsMentor(req.params.id, req.user._id);
    if (error) return res.status(error).json({ message });

    if (!['scheduled', 'live'].includes(session.status)) {
      return res.status(400).json({ message: 'Only scheduled or live sessions can be cancelled' });
    }

    session.status = 'cancelled';
    await session.save();

    await broadcastToStudents(session, {
      text: `The live session "${session.title}" for ${session.skillTitle} was cancelled.`,
      link: null,
      event: 'cancelled'
    });

    res.json({ liveSession: leanSession(session.toObject()) });
  } catch (err) {
    next(err);
  }
}

// POST /api/live-sessions/:id/start  (protected — mentor)
export async function startLiveSession(req, res, next) {
  try {
    const { session, error, message } = await findSessionAsMentor(req.params.id, req.user._id);
    if (error) return res.status(error).json({ message });

    if (session.status !== 'scheduled') {
      return res.status(400).json({ message: 'Only a scheduled session can be started' });
    }

    session.status = 'live';
    session.startedAt = new Date();
    await session.save();

    await broadcastToStudents(session, {
      text: `${req.user.name} just started a live session for ${session.skillTitle} — join now!`,
      link: `/live-sessions/${session.id}`,
      event: 'started'
    });

    res.json({ liveSession: withJoinUrl(session.toJSON()) });
  } catch (err) {
    next(err);
  }
}

// POST /api/live-sessions/:id/end  { recordingUrl? }  (protected — mentor)
export async function endLiveSession(req, res, next) {
  try {
    const { session, error, message } = await findSessionAsMentor(req.params.id, req.user._id);
    if (error) return res.status(error).json({ message });

    if (session.status !== 'live') {
      return res.status(400).json({ message: 'Only a live session can be ended' });
    }

    const now = new Date();
    session.status = 'ended';
    session.endedAt = now;
    if (req.body.recordingUrl) session.recordingUrl = req.body.recordingUrl;

    // Anyone still marked joined-but-not-left gets their attendance closed
    // out at end time, so total attendance duration is never left open.
    for (const entry of session.attendance) {
      if (entry.joinedAt && !entry.leftAt) {
        entry.leftAt = now;
        entry.totalSeconds += Math.max(0, Math.round((now - entry.joinedAt) / 1000));
      }
    }

    await session.save();

    await broadcastToStudents(session, {
      text: `The live session "${session.title}" for ${session.skillTitle} has ended.${req.body.recordingUrl ? ' A recording is available.' : ''}`,
      link: `/live-sessions/${session.id}`,
      event: 'ended'
    });

    res.json({ liveSession: leanSession(session.toObject()) });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/live-sessions/:id/recording  { recordingUrl }  (protected — mentor)
export async function attachRecording(req, res, next) {
  try {
    const { session, error, message } = await findSessionAsMentor(req.params.id, req.user._id);
    if (error) return res.status(error).json({ message });

    if (session.status !== 'ended') {
      return res.status(400).json({ message: 'Recording can only be attached to an ended session' });
    }

    session.recordingUrl = req.body.recordingUrl;
    await session.save();

    await broadcastToStudents(session, {
      text: `A recording is now available for "${session.title}" (${session.skillTitle}).`,
      link: `/live-sessions/${session.id}`,
      event: 'recording-added'
    });

    res.json({ liveSession: leanSession(session.toObject()) });
  } catch (err) {
    next(err);
  }
}

// POST /api/live-sessions/:id/join  (protected — enrolled student)
export async function joinLiveSession(req, res, next) {
  try {
    const session = await LiveSession.findById(req.params.id);
    if (!session) return res.status(404).json({ message: 'Live session not found' });

    if (session.status === 'cancelled') return res.status(400).json({ message: 'This session was cancelled' });
    if (session.status === 'ended') return res.status(400).json({ message: 'This session has already ended' });

    if (!(await assertEnrolled(session, req.user._id))) {
      return res.status(403).json({ message: 'You must be enrolled in this course to join' });
    }

    if (session.maxParticipants) {
      const currentlyIn = session.attendance.filter((a) => a.joinedAt && !a.leftAt).length;
      const alreadyCounted = session.attendance.some(
        (a) => a.user.toString() === req.user._id.toString() && a.joinedAt && !a.leftAt
      );
      if (!alreadyCounted && currentlyIn >= session.maxParticipants) {
        return res.status(409).json({ message: 'This session is full' });
      }
    }

    const now = new Date();
    let entry = session.attendance.find((a) => a.user.toString() === req.user._id.toString());
    const lateThresholdMs = 5 * 60 * 1000; // more than 5 min after start = late
    const status = session.startedAt && now - session.startedAt > lateThresholdMs ? 'late' : 'present';

    if (entry) {
      entry.joinedAt = now;
      entry.leftAt = null;
      entry.status = status;
    } else {
      session.attendance.push({ user: req.user._id, joinedAt: now, status });
    }

    await session.save();

    const json = withJoinUrl(session.toJSON());
    res.json({
      liveSession: json,
      meetingUrl: session.meetingUrl || null,
      jitsiRoom: json.jitsiRoom || null
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/live-sessions/:id/leave  (protected — enrolled student)
export async function leaveLiveSession(req, res, next) {
  try {
    const session = await LiveSession.findById(req.params.id);
    if (!session) return res.status(404).json({ message: 'Live session not found' });

    const entry = session.attendance.find((a) => a.user.toString() === req.user._id.toString());
    if (entry && entry.joinedAt && !entry.leftAt) {
      const now = new Date();
      entry.leftAt = now;
      entry.totalSeconds += Math.max(0, Math.round((now - entry.joinedAt) / 1000));
      await session.save();
    }

    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

// GET /api/live-sessions/:id  (protected — mentor of the course, or an enrolled student)
export async function getLiveSession(req, res, next) {
  try {
    const session = await LiveSession.findById(req.params.id);
    if (!session) return res.status(404).json({ message: 'Live session not found' });

    const isMentor = session.mentor.toString() === req.user._id.toString();
    if (!isMentor && !(await assertEnrolled(session, req.user._id))) {
      return res.status(403).json({ message: 'Not authorized to view this session' });
    }

    const json = isMentor ? session.toJSON() : (() => { const j = session.toJSON(); delete j.attendance; return j; })();
    res.json({ liveSession: withJoinUrl(json) });
  } catch (err) {
    next(err);
  }
}

// GET /api/live-sessions?skillId=&status=&page=&limit=  (protected)
// General-purpose listing, scoped to sessions for courses the caller
// mentors OR is enrolled in — used by course detail pages.
export async function listLiveSessions(req, res, next) {
  try {
    const { skillId, status } = req.query;
    const filter = {};
    if (skillId) filter.skillId = skillId;
    if (status) filter.status = status;

    if (skillId) {
      const isMentor = await Skill.exists({ id: skillId, mentorUser: req.user._id });
      const isEnrolled = await Booking.exists({ skillId, user: req.user._id, status: { $ne: 'cancelled' } });
      if (!isMentor && !isEnrolled) return res.status(403).json({ message: 'Not authorized' });
    }

    const { limit, page, skip } = parsePagination(req.query, { defaultLimit: 20 });
    const [sessions, total] = await Promise.all([
      LiveSession.find(filter).sort({ startTime: 1 }).skip(skip).limit(limit).lean(),
      LiveSession.countDocuments(filter)
    ]);

    res.json({ liveSessions: sessions.map((s) => withJoinUrl(leanSession(s))), ...paginationMeta({ page, limit, total }) });
  } catch (err) {
    next(err);
  }
}

// GET /api/live-sessions/my/upcoming  (protected — student)
export async function myUpcomingLiveSessions(req, res, next) {
  try {
    const skillIds = await Booking.distinct('skillId', { user: req.user._id, status: { $ne: 'cancelled' } });
    const sessions = await LiveSession.find({
      skillId: { $in: skillIds },
      status: { $in: ['scheduled', 'live'] }
    }).sort({ startTime: 1 }).lean();
    res.json({ liveSessions: sessions.map((s) => withJoinUrl(leanSession(s))) });
  } catch (err) {
    next(err);
  }
}

// GET /api/live-sessions/my/live  (protected — student)
export async function myLiveLiveSessions(req, res, next) {
  try {
    const skillIds = await Booking.distinct('skillId', { user: req.user._id, status: { $ne: 'cancelled' } });
    const sessions = await LiveSession.find({ skillId: { $in: skillIds }, status: 'live' }).sort({ startTime: 1 }).lean();
    res.json({ liveSessions: sessions.map((s) => withJoinUrl(leanSession(s))) });
  } catch (err) {
    next(err);
  }
}

// GET /api/live-sessions/my/history  (protected — student)
export async function myLiveSessionHistory(req, res, next) {
  try {
    const skillIds = await Booking.distinct('skillId', { user: req.user._id, status: { $ne: 'cancelled' } });
    const { limit, page, skip } = parsePagination(req.query, { defaultLimit: 20 });
    const filter = { skillId: { $in: skillIds }, status: { $in: ['ended', 'cancelled'] } };

    const [sessions, total] = await Promise.all([
      LiveSession.find(filter).sort({ startTime: -1 }).skip(skip).limit(limit).lean(),
      LiveSession.countDocuments(filter)
    ]);
    res.json({ liveSessions: sessions.map(leanSession), ...paginationMeta({ page, limit, total }) });
  } catch (err) {
    next(err);
  }
}

// GET /api/live-sessions/mentor/upcoming  (protected — mentor)
export async function mentorUpcomingLiveSessions(req, res, next) {
  try {
    const sessions = await LiveSession.find({
      mentor: req.user._id,
      status: { $in: ['scheduled', 'live'] }
    }).sort({ startTime: 1 }).lean();
    res.json({ liveSessions: sessions.map((s) => withJoinUrl(leanSession(s))) });
  } catch (err) {
    next(err);
  }
}

// GET /api/live-sessions/mentor/today  (protected — mentor)
export async function mentorTodayLiveSessions(req, res, next) {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const sessions = await LiveSession.find({
      mentor: req.user._id,
      startTime: { $gte: start, $lte: end },
      status: { $ne: 'cancelled' }
    }).sort({ startTime: 1 }).lean();
    res.json({ liveSessions: sessions.map((s) => withJoinUrl(leanSession(s))) });
  } catch (err) {
    next(err);
  }
}

// GET /api/live-sessions/:id/attendance  (protected — mentor)
export async function getAttendance(req, res, next) {
  try {
    const { session, error, message } = await findSessionAsMentor(req.params.id, req.user._id);
    if (error) return res.status(error).json({ message });

    await session.populate('attendance.user', 'name email avatarUrl');
    const attendance = session.attendance.map((a) => ({
      user: a.user && a.user._id ? { id: a.user._id, name: a.user.name, email: a.user.email, avatarUrl: a.user.avatarUrl } : a.user,
      joinedAt: a.joinedAt,
      leftAt: a.leftAt,
      totalSeconds: a.totalSeconds,
      status: a.status
    }));

    res.json({ attendance });
  } catch (err) {
    next(err);
  }
}
