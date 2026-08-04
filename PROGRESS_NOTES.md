# What changed in this pass

This project already had a real Express + MongoDB backend (JWT auth, email
OTP, Razorpay payments, YouTube chapter-splitting course player, PDF
certificates + verification page, AI chatbot, socket.io, admin dashboard)
before this pass touched anything. This pass added the pieces that were
previously placeholders or explicitly flagged as not-yet-built:

## 1. Google + Facebook login (previously non-functional buttons)
- `server/src/lib/socialAuth.js` — verifies a Google ID token (`google-auth-library`)
  and a Facebook access token (Graph API `debug_token` + `/me`) server-side.
- `server/src/models/User.js` — `googleId`/`facebookId`/`authProviders`, password
  now optional for social-only accounts.
- `server/src/controllers/authController.js`, `routes/authRoutes.js` — new
  `POST /api/auth/google` and `POST /api/auth/facebook`, with find-or-create +
  account linking by email.
- `client/src/components/SocialLoginButtons.jsx` — real Google Identity
  Services button + Facebook Login SDK button, wired into Login and SignUp.
- **You must supply your own credentials** for this to work: a Google OAuth
  Client ID and a Facebook App ID/Secret (see `.env` files for where they go).
  Without them, the buttons simply don't render — no broken UI.

## 2. Real-time notifications (previously a documented 40s-poll stand-in)
- `client/src/lib/socket.js` — socket.io-client connection using the same JWT.
- `UserContext.jsx` — listens for the `notification:new` event the backend
  already emitted; polling kept only as a fallback if the socket can't connect.

## 3. Live video calls — real peer-to-peer (previously local-camera-only)
- `server/src/realtime/callSignaling.js` — signaling relay (SDP offer/answer +
  ICE candidates) scoped to a booking's two participants, checked against the
  Booking document.
- `client/src/lib/useCallPeer.js`, `components/VideoCall.jsx` — a real
  RTCPeerConnection now negotiates over that signaling channel; the UI shows
  the actual remote peer once connected, with a live/offline indicator.
- Uses public STUN only. For reliable calls from behind strict corporate
  networks/mobile carriers, add a TURN server (see the comment in
  `useCallPeer.js`) — this is infrastructure only you can provision.

## Known remaining gap (not addressed this pass)
`bookings`, in-app `messages`, and `wallet` are still frontend-only mock data
in `UserContext.jsx`, even though real backend APIs already exist for bookings
and messages. This means: (a) the video call above only works once a booking
has a real MongoDB `_id` from the real bookings API, and (b) session
scheduling, messaging, and wallet top-ups don't currently persist server-side.
Wiring those three to their existing controllers is the next concrete step
toward "production ready."

## Also flagged
Your uploaded `server/.env` contains live secrets (MongoDB password, JWT
secret, Razorpay test keys, YouTube/Anthropic API keys) in plain text.
Rotate these before deploying, since they've now passed through this chat.

---

# What changed in the follow-up pass

The gap above is now closed, plus one standing bug fixed:

## 1. Chatbot route bug (fixed)
`server/src/app.js` imported `chatbotRoutes` but never `app.use()`'d it —
`/ai-mentor` was 404ing on every request. One-line fix.

## 2. Mentors are no longer a separate fake directory
The backend already modeled mentors as a claimed/created attribute of a
`Skill` (`skill.mentor` + optional `skill.mentorUser`, see
`server/src/models/Skill.js`), with a real claim flow
(`PATCH /api/skills/:id/claim`, `POST /api/skills`, `GET /api/skills/mentor/mine`).
`client/src/data/mentors.js` — a parallel, hardcoded 10-person fake mentor
directory — has been deleted. Every page that used it now works off the
skill a mentor teaches instead: `MentorProfile.jsx`, `BookSession.jsx`,
`SessionBooking.jsx`, `Checkout.jsx`, `Sessions.jsx`, `SessionDetail.jsx`,
`Home.jsx`, `Search.jsx`, `SkillDetail.jsx`, `LessonPlayer.jsx`. Routes
`/mentor/:id` and `/book/:id` now take a **skillId**, not a mentor slug.
Booking/messaging/reviewing all key off `skillId` (→ that skill's
`mentor`/`mentorUser`), matching how `checkoutBooking` already worked
server-side.

New small backend additions to support this: `GET /api/skills?mentorUser=`
filter, `useSkillFull(id)` client hook wrapping `GET /api/skills/:id/full`.

## 3. Real bookings, with real payment
- `POST /api/bookings/checkout` (wallet method) is now actually called from
  `Checkout.jsx` — no more fake `setTimeout` card form.
- Added a genuine Razorpay flow for card-paid sessions, mirroring the
  wallet top-up pattern: `POST /api/bookings/checkout/razorpay/create-order`
  + `/verify` (new, in `bookingsController.js`) — signature-verified,
  amount pulled from Razorpay itself, idempotent via
  `Transaction.providerPaymentId`. Session pricing is now a flat
  platform rate by session length (Quick Chat $15 / Deep Dive $35), since
  `Skill` has no per-mentor rate field — the old per-mentor "rate" and fake
  weekly availability grid were both invented client-side data that never
  existed on the backend.
- Added `GET /api/bookings/:id` (single booking, learner or mentor) and
  `PATCH /api/bookings/:id/notes` (learner's private notes) — needed by
  `SessionDetail.jsx`, didn't exist before.
- Note: only the *mentor* can mark a booking `completed`
  (`PATCH /api/bookings/:id/complete`, unchanged, mentor-only by design) —
  so `SessionDetail.jsx` no longer has a learner-facing "mark complete"
  button; it explains that the mentor marks it done.

## 4. Real messages
`Messages.jsx` now calls `GET /api/messages/conversations`,
`GET /api/messages/:userId`, `POST /api/messages/:userId`, plus a
`message:new` socket.io listener for live delivery. `?mentor=<slug>` query
param → `?user=<realUserId>`, everywhere it's linked from
(`MentorProfile.jsx`, `LessonPlayer.jsx`). Messaging only offers a "Message"
button when a skill actually has a real `mentorUser` account — there's no
one to message on skills nobody has claimed yet.

## 5. Real reviews
`Reviews.jsx` and `SessionDetail.jsx` now use `GET /api/reviews/mine` and
`POST /api/reviews`, which already recompute a skill's aggregate rating
server-side. `MentorProfile.jsx`'s testimonials are real reviews pulled from
`GET /api/skills/:id/full`, not fabricated quotes.

## 6. Real wallet history
`PaymentHistory.jsx` and `Achievements.jsx` now read
`GET /api/wallet/transactions` instead of a mock array. `UserContext.jsx`
keeps only the wallet *balance* (shown in a few places at once) and exposes
`refreshWallet()`, called after any real payment.

## 7. Real community
`CommunityContext.jsx` (localStorage-only) is deleted. `Community.jsx` and
`PostSkill.jsx` call `GET/POST /api/community`, `POST /api/community/:id/like`
directly — likes now genuinely persist and are visible to everyone. Added
`authorId` to the post response so "Connect" can open a real conversation
with the poster.

## Still outstanding
- `RAZORPAY_WEBHOOK_SECRET` is empty in the uploaded `.env` — set it once
  the webhook is registered in the Razorpay dashboard, or
  `/api/payments/razorpay/webhook` will keep rejecting everything.
- No TURN server for video calls (STUN-only, flagged in the earlier pass) —
  still infrastructure only you can provision.
- `server`'s `vitest` suite couldn't be run in this environment (missing a
  native `rolldown` binding, unrelated to any of these changes — a
  `npm i` after deleting `node_modules`/`package-lock.json` on a machine
  with network access should resolve it). The frontend's production build
  (`vite build`) was run and passes clean.
- Secrets in the uploaded `.env` are still unrotated — see the flag above,
  still applies.
