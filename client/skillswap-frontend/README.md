# SkillSwap — Phase 1 + 2 + 3 + 4 Frontend

React + Vite frontend for the SkillSwap MVP, covering:

**Phase 1 — Foundation & Trust**
- `/` — Home
- `/explore` — Explore / Browse Skills (working filters, search, sort)
- `/skill/:id` — Skill Detail (curriculum, prerequisites, mentor sidebar)
- `/learn/:id` — Course/Lesson Player (sidebar progress, next/prev, quiz checkpoint)
- `/legal` — Terms, Privacy, Cookie & Refund policies (tabbed single page)
- `/help` — Help Center / FAQ (search + accordion)

**Phase 2 — Identity**
- `/signup` — Sign Up, with live password-strength meter and validation
- `/login` — Log In
- `/forgot-password` — Forgot Password (email → confirmation screen)
- `/reset-password` — Reset Password (new password + confirmation screen)
- `/verify-email` — Verify Email/OTP (6-digit code input, resend countdown)
- `/onboarding` — 3-step Onboarding (role → interests → time commitment)

**Phase 3 — Personalized Learning** (behind `RequireAuth`)
- `/dashboard` — Learner Dashboard (continue learning, recommendations, upcoming sessions)
- `/my-learning` — In-progress skills with live progress bars
- `/learning-history` — Completed skills
- `/wishlist` — Saved skills (☆ toggle also lives on Skill Detail)
- `/profile` — Edit name/bio/skills offered & wanted, view onboarding interests
- `/notifications` — Filterable notification log with read/unread state

**Phase 4 — Marketplace Core**
- `/mentor/:id` — Mentor Public Profile (public — bio, tags, availability, testimonials)
- `/post-skill` — Post a Skill, offer or request (behind `RequireAuth`)
- `/community` — Community Feed, filterable by type/category/search (behind `RequireAuth`)
- `/messages` — Chat/Messages, two-pane thread view (behind `RequireAuth`)
- `/book-session` → `/book/:mentorId` — Session Booking Flow: mentor picker →
  session type + availability grid → confirm (behind `RequireAuth`)
- `/sessions` — Upcoming Sessions list, cancel bookings (behind `RequireAuth`)
- `/session/:id` — Session Detail/Room: notes, mark-complete, leave a review (behind `RequireAuth`)
- `/reviews` — Reviews you've written (behind `RequireAuth`)

Any other route (Pricing, About, Certificates, Account Settings, etc. — later phases)
falls back to a "coming in a later phase" placeholder instead of a dead link.

## Stack

- **React 18** + **React Router 6** for routing
- **Vite** for dev/build tooling
- **Three.js** for the two 3D layers:
  - `BackgroundFX` — a full-page fixed particle/constellation field behind every route
  - `OrbitalOrb` — the hero's torus-knot + orbiting skill-node animation (Home only)
- Plain CSS with a design-token system (`src/index.css`) — no CSS framework, so it's
  easy to hand off into any MERN setup without extra build config.
- All content is mock data in `src/data/skills.js` and `src/data/mentors.js` — swap
  these for real API calls to your Express/MongoDB backend when it's ready (see
  "Wiring up the backend" below).
- **All app state lives in two contexts**, both persisted to `localStorage`:
  - `UserContext` — auth, profile, enrolled/progress, wishlist, notifications,
    conversations, bookings, reviews
  - `CommunityContext` — skill-exchange posts (offers/requests)
  - Guests can still play lessons (per the IA: content is viewable without login), but
    progress only sticks once logged in; `LessonPlayer` handles both cases.

## Getting started

```bash
npm install
npm run dev       # http://localhost:5173
npm run build      # production build to /dist
npm run preview    # preview the production build
```

## Project structure

```
src/
  components/
    Navbar.jsx        shared top navigation (logged-out AND logged-in states)
    Footer.jsx         shared footer
    AuthLayout.jsx      shared two-column layout for Sign Up/Log In/Forgot/Reset/Verify
    DashboardLayout.jsx  sidebar shell for all /dashboard, /my-learning, /community, etc. pages
    RequireAuth.jsx      route guard — redirects to /login (or /onboarding) as needed
    OtpInput.jsx         6-digit code input with paste + auto-advance
    BackgroundFX.jsx    full-page 3D background (Three.js)
    OrbitalOrb.jsx      hero 3D animation (Three.js)
    Counter.jsx         animated stat counters
    TiltCard.jsx        hover-tilt wrapper for cards
  context/
    UserContext.jsx      auth, profile, enrolled/progress, wishlist, notifications,
                          conversations, bookings, reviews — persisted to localStorage
    CommunityContext.jsx  skill-exchange posts (offers/requests) — persisted to localStorage
  data/
    skills.js            mock skills dataset (each skill's `mentor.id` links to mentors.js)
    mentors.js            full mentor profiles: bio, availability, testimonials
  pages/
    Home.jsx, Explore.jsx, SkillDetail.jsx, LessonPlayer.jsx, Legal.jsx, Help.jsx
    SignUp.jsx, Login.jsx, ForgotPassword.jsx, ResetPassword.jsx, VerifyEmail.jsx, Onboarding.jsx
    Dashboard.jsx, MyLearning.jsx, LearningHistory.jsx, Wishlist.jsx, Profile.jsx, Notifications.jsx
    MentorProfile.jsx, PostSkill.jsx, Community.jsx, Messages.jsx,
    BookSession.jsx, SessionBooking.jsx, Sessions.jsx, SessionDetail.jsx, Reviews.jsx
    ComingSoon.jsx       fallback for unbuilt routes
  App.jsx                routes + shared shell
  main.jsx               entry point (wraps App in UserProvider + CommunityProvider)
  index.css               design tokens + all page styles
```

## Wiring up the backend (MERN)

**Content (Phase 1):**
1. Replace the static `skills` array with data fetched from an endpoint like
   `GET /api/skills` (Explore page) and `GET /api/skills/:id` (Skill Detail,
   Lesson Player) — a small `useEffect` + `fetch`/`axios` swap in each page is
   enough since the components already read from a single `skill` object shape.

**Auth (Phase 2):**
2. `SignUp.jsx` → `POST /api/auth/signup`, then redirect to `/verify-email` as
   it already does — pass the real user id/email through `location.state`.
3. `Login.jsx` → `POST /api/auth/login`, store the returned session token
   (httpOnly cookie recommended over localStorage).
4. `ForgotPassword.jsx` / `ResetPassword.jsx` → `POST /api/auth/forgot-password`
   and `POST /api/auth/reset-password`.
5. `VerifyEmail.jsx` → `POST /api/auth/verify-otp`; currently any complete
   6-digit code succeeds (mock only).
6. `Onboarding.jsx` → `POST /api/users/onboarding` with `{ role, interests, goal }`.

**Personalized learning (Phase 3):**
7. `UserContext.jsx` is the one place to change — every action (`enroll`,
   `markLessonComplete`, `toggleWishlist`, `updateProfile`, `markNotifRead`, etc.)
   currently mutates local state and writes to `localStorage`. Swap each one's
   body for a `fetch`/`axios` call to the matching endpoint and hydrate `state`
   from `GET /api/me` on load instead of `localStorage`. Every page that calls
   `useUser()` will keep working unchanged since they only consume the returned
   shape, not how it's produced.

**Marketplace core (Phase 4):**
8. `mentors.js` → `GET /api/mentors` and `GET /api/mentors/:id`.
9. `CommunityContext.jsx`'s `addPost` → `POST /api/community-posts`, and seed
   `posts` from `GET /api/community-posts` instead of the hardcoded array.
10. `UserContext.jsx`'s `getOrCreateConversation`/`sendMessage` → real-time
    messaging needs a websocket layer (Socket.IO pairs naturally with
    Express) rather than a plain REST call — `sendMessage` is the one place
    that would emit a socket event instead of just updating local state.
11. `bookSession`/`cancelBooking`/`updateBookingNotes`/`markBookingCompleted`
    → `POST /api/bookings`, `PATCH /api/bookings/:id` (status, notes). A real
    backend would also validate the picked slot against the mentor's live
    availability instead of trusting the client.
12. `addReview` → `POST /api/reviews`; this is also where you'd recompute and
    cache the mentor's aggregate `rating`/`reviews` count server-side rather
    than trusting the static seed data in `mentors.js`.

## Notes

- Reduced-motion is respected: both Three.js layers check
  `prefers-reduced-motion` and skip animation.
- The 3D scenes are perf-conscious (capped particle counts, single shared
  background canvas across all routes) but do add real GPU/JS cost — if you
  need a lighter build for lower-end devices, the `BackgroundFX` particle
  `COUNT` in `src/components/BackgroundFX.jsx` is the easiest dial to turn down.
- Auth/onboarding/dashboard screens intentionally hide the marketing footer for
  a focused, full-height layout — see `NO_FOOTER_EXACT` / `NO_FOOTER_PREFIXES`
  in `App.jsx`.
- `RequireAuth` sends unauthenticated visitors to `/login` (remembering where
  they were headed via router state) and sends authenticated-but-not-onboarded
  users to `/onboarding` first, matching the IA's "Stage 3 → Stage 4" flow.
- The booking flow is intentionally demo-friendly: since there's no real clock
  tied to session times, `SessionDetail` has a "Mark as completed" button so
  you can reach the review flow without waiting for a real session time to pass.

