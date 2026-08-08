# Jitsi Live Session — Root Cause Report

## 1. Why students weren't appearing to the mentor

`JitsiEmbed.jsx` was a **bare `<iframe>`** pointed at `https://meet.jit.si/<room>`,
not the `JitsiMeetExternalAPI` library. A plain iframe to the public Jitsi
server *can* put two people in the same video call, but SkillSwap had **zero
visibility** into what was actually happening inside it — no
`participantJoined`, no `videoConferenceJoined`, nothing. So there was no way
for the app to confirm, log, or react to a real participant ever actually
being in the room. Any apparent "only sees myself" symptom couldn't be
diagnosed or fixed from application code at all, because the app was flying
blind on the one thing (actual Jitsi conference state) that matters.

## 2. Were mentor and students using different Jitsi room names?

**No — this part was already correct.** `jitsiRoomName(sessionId)` in
`liveSessionsController.js` generates a deterministic
`skillswap-<LiveSessionId>` room name from the LiveSession's own Mongo `_id`,
and both the mentor's and student's `session.jitsiRoom` come from the same
`withJoinUrl()` helper applied to the same session document. There was no
per-user or per-render room generation anywhere in the codebase.

## 3. Was Jitsi being initialized multiple times?

Not applicable before — there was no `JitsiMeetExternalAPI` instance at all
to double-initialize (just an iframe `src` string). This *would* have become
a real risk once we introduced the External API, so the new `JitsiEmbed.jsx`
guards against it explicitly: an `apiRef` ref ensures only one
`JitsiMeetExternalAPI` instance is ever created per mount, the effect only
re-runs when `room` itself changes (not on every re-render), and
`api.dispose()` runs in the effect's cleanup on unmount.

## 4. How participantJoined/participantLeft are handled now

`JitsiEmbed.jsx` now loads `https://meet.jit.si/external_api.js` once,
constructs a real `JitsiMeetExternalAPI` instance, and wires:
- `videoConferenceJoined` → `onConferenceJoined` prop (fires once the user
  is actually past the prejoin screen and inside the call)
- `videoConferenceLeft` / `readyToClose` → `onConferenceLeft` prop
- `participantJoined` / `participantLeft` → passthrough props (available for
  future use, e.g. a richer live roster driven straight from Jitsi rather
  than round-tripping through the backend)

`LiveSessionDetail.jsx` uses these to drive attendance — see below.

## 5. How attendance is now calculated

Attendance records now track **two separate timestamps** instead of one:
- `joinedAt` — set when the student clicks "JOIN NOW" and passes the
  enrollment/capacity check. This is "join **initiated**".
- `confirmedAt` — set only when Jitsi's own `videoConferenceJoined` event
  fires for that student, via a new `POST /:id/confirm-join` endpoint. This
  is "actually **inside** the conference".

Duration (`totalSeconds`) is computed from `confirmedAt → leftAt`, never
from `joinedAt → leftAt`. The mentor's Attendance panel now shows
"Connecting…" for a student who has clicked Join but hasn't been confirmed
in the conference yet, and a live-ticking duration (computed
`confirmedAt → now`) for anyone still present, instead of a frozen "0m".

This fixes the literal complaint in the screenshot: "Present · 0m" was
always going to read 0m under the old logic, because duration was only ever
written on leave and the join timestamp was stamped at button-click time,
before the student was verifiably in the meeting.

## 6. How the mentor is identified

Unchanged — `session.mentor` on the `LiveSession` document, compared against
the logged-in user's id (`findSessionAsMentor()` server-side,
`isMentor = session.mentor === profile.id` client-side). No attendance
record is ever created for the mentor; they're not a "student."

## 7. How students are authorized

Unchanged and untouched: `assertEnrolled()` checks for a non-cancelled
`Booking` on the session's `skillId` before allowing `/join`, `/confirm-join`,
or (implicitly) before the session is even returned by `getLiveSession`.

## 8. How the same room is guaranteed

`jitsiRoomName(sessionId) = \`skillswap-${sessionId}\`` — computed once from
the LiveSession's own id and never stored, never regenerated per-user. Both
`getLiveSession` (initial page load) and `joinLiveSession` (click Join) run
this through the same `withJoinUrl()` helper, so mentor and every student
always resolve to the identical room string for a given session.

## 9. Which files were changed

- `server/src/models/LiveSession.js` — added `confirmedAt` to the attendance
  subdocument schema.
- `server/src/controllers/liveSessionsController.js` — added
  `confirmLiveSessionJoin`, added `broadcastAttendance()` (socket push on
  real join/leave), changed duration math to use `confirmedAt`, added dev
  console logging of `role`/`sessionId`/`roomName` on start + join.
- `server/src/routes/liveSessionsRoutes.js` — added
  `POST /:id/confirm-join` route.
- `server/src/realtime/liveSessionScheduler.js` — the auto-end-overrun-
  sessions job had its own duplicate duration-finalization logic; updated it
  to use `confirmedAt` too, for consistency.
- `client/src/components/JitsiEmbed.jsx` — full rewrite: real
  `JitsiMeetExternalAPI` instead of a bare iframe, proper event wiring,
  double-init guard, `dispose()` cleanup, dev logging.
- `client/src/pages/LiveSessionDetail.jsx` — Join no longer marks attendance
  directly; attendance confirms only on the real Jitsi event; added a live
  "Live participants" panel for the mentor (fed by a new
  `live-session:attendance` socket event) and a live participant count on
  the student side; leave is called on conference-left, on the Leave
  button, and as an unmount safety net.
- `client/src/lib/liveSessionsApi.js` — added `confirmLiveSessionJoin(id)`.

**Nothing else was touched.** Authentication, courses, enrollment, bookings,
notifications, quizzes, certificates, progress tracking, and the rest of the
mentor dashboard are untouched — the diff is scoped entirely to the live
session / attendance path.

## 10. How to test this with two devices

1. Log in as the mentor on Device 1, as an enrolled student on Device 2.
2. Mentor: create a live session for a course the student is enrolled in,
   then **Start Session**.
3. Student: open the session, click **JOIN NOW**, get past the Jitsi
   prejoin screen (allow camera/mic or "Join without").
4. Mentor: click **Open meeting room**. You should now see the student's
   video in the same Jitsi room, and their name should appear in the new
   **Live participants** panel within a second or two (pushed over
   Socket.IO, not polled).
5. Mentor: open dev tools console — with `NODE_ENV !== 'production'` on the
   server, you'll see matching `[Jitsi] role=mentor sessionId=... roomName=...`
   and `[Jitsi] role=student sessionId=... roomName=...` log lines; confirm
   the `roomName` values are identical.
6. Student: leave the call (Leave button, or close the tab). Mentor's Live
   participants panel should drop them within a second or two, and the
   **Attendance** panel (Load attendance) should show a non-zero duration
   for them once you reload it.
7. Repeat with a second enrolled student to confirm multiple students land
   in the same room and both show up in the mentor's participant list
   simultaneously.

## One caveat worth flagging

This still runs against the **public `meet.jit.si` server** with no
self-hosted Jitsi + JWT auth, so SkillSwap has no way to force
"mentor = moderator" at the Jitsi layer — Jitsi's own default is that the
first person to join a room becomes its moderator. In practice this is
almost always the mentor, since students can't join a session that hasn't
been started yet — but if you want moderator status to be guaranteed rather
than incidental, that requires standing up a self-hosted Jitsi instance (or
Jitsi's JaaS) with JWT-based moderator claims, which is a meaningfully
bigger infrastructure change than anything in this pass. Flagging it now
rather than silently leaving it as an assumption.
