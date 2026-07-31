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
