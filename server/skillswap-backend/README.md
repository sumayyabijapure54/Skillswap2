# SkillSwap — Backend

Express + MongoDB (Atlas) API for the `skillswap-frontend` app. Covers:

- **Skills API** — list/filter/search/sort + detail (Explore, Skill Detail)
- **Auth** — signup/login (JWT), email verification via OTP, forgot/reset password
- **Profile & onboarding** — editable profile, one-time onboarding flow
- **Progress** — per-skill lesson completion (My Learning, Learning History)
- **Wishlist** — saved skills
- **Notifications** — in-app notification feed
- **Bookings** — mentor session scheduling (auto-confirmed — see note below)
- **Mentor accounts** — link a real user to a skill's mentor slot, and let
  that user manage the sessions booked with them

This now matches the full data layer `UserContext.jsx` needs — nothing in
the frontend has to fall back to `localStorage` anymore.

## Stack

- **Express 4** for routing/middleware
- **Mongoose 8** for MongoDB Atlas
- Plain ESM (`"type": "module"` in package.json) — no TypeScript, no build step

## Setup

1. **Create the Atlas cluster / database** (skip if you already have one):
   - In MongoDB Atlas, create a free cluster, then create a database user and
     allow your IP (or `0.0.0.0/0` for local dev) under Network Access.
   - Click **Connect → Drivers** and copy the connection string.

2. **Install dependencies:**
   ```bash
   cd skillswap-backend
   npm install
   ```

3. **Configure environment:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and paste your Atlas connection string into `MONGODB_URI`,
   e.g.:
   ```
   MONGODB_URI=mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/skillswap?retryWrites=true&w=majority
   ```
   Also set `JWT_SECRET` to a long random string (used to sign login tokens):
   ```bash
   openssl rand -hex 32   # paste the output as JWT_SECRET
   ```

4. **Seed the database** with the same 8 skills the frontend currently ships
   as mock data:
   ```bash
   npm run seed
   ```
   Re-run this any time you want to reset the collection back to the seed
   data. `npm run seed:destroy` empties the collection without reloading it.

5. **Run the server:**
   ```bash
   npm run dev     # nodemon, auto-restarts on file changes
   # or
   npm start
   ```
   The API listens on `http://localhost:5000` by default (`PORT` in `.env`).

## API

All responses are JSON. Base path: `/api/skills`.

| Method | Route                        | Description |
|--------|-------------------------------|---|
| GET    | `/api/health`                 | Liveness check → `{ status: "ok" }` |
| GET    | `/api/skills`                 | List skills, with filtering/search/sort (see below) |
| GET    | `/api/skills/:id`              | One skill by slug, e.g. `/api/skills/react-fundamentals` |
| GET    | `/api/skills/meta/categories`  | Category list with live per-category counts |
| GET    | `/api/skills/meta/levels`      | `["Beginner", "Intermediate", "Advanced"]` |

### `GET /api/skills` query params

Mirrors the filter/search/sort state in `Explore.jsx`:

- `q` — free-text search across title, tags, and description
- `cat` — one or more categories, e.g. `?cat=programming&cat=design` or `?cat=programming,design`
- `level` — one or more levels, e.g. `?level=Beginner&level=Intermediate`
- `sort` — one of `popular` (default, by students desc), `rating`, `students`, `az`

Example:
```
GET /api/skills?q=react&cat=programming&level=Beginner&sort=rating
```
Response:
```json
{ "count": 1, "results": [ { "id": "react-fundamentals", "title": "React Fundamentals", ... } ] }
```

### `GET /api/skills/:id`

Returns a single skill document (same shape as items in `results` above), or
`404` with `{ "message": "..." }` if the slug doesn't exist.

## Auth API

Base path: `/api/auth`. Passwords are hashed with bcrypt; sessions are
stateless JWTs sent back to the client and passed as a bearer token on
subsequent requests.

| Method | Route             | Auth required | Description |
|--------|-------------------|:---:|---|
| POST   | `/api/auth/signup` | No | Create an account → `{ token, user }` |
| POST   | `/api/auth/login`  | No | Log in → `{ token, user }` |
| GET    | `/api/auth/me`     | Yes | Returns the logged-in user → `{ user }` |

**Signup**
```
POST /api/auth/signup
Content-Type: application/json

{ "name": "Alex Johnson", "email": "alex@example.com", "password": "at least 8 chars" }
```
→ `201 { "token": "<jwt>", "user": { ..., "verified": false, "onboarded": false } }`
Also sends a 6-digit OTP to the user's email (or logs it to the console in
dev mode — see "Email" below). Returns `409` if the email is already
registered, `400` if a field is missing or the password is under 8
characters.

**Login**
```
POST /api/auth/login
Content-Type: application/json

{ "email": "alex@example.com", "password": "at least 8 chars" }
```
→ `200 { "token": "<jwt>", "user": { ... } }`, or `401` on bad credentials.
Login succeeds even if `verified` is still `false` — it's the frontend's job
to route an unverified user back to `/verify-email`.

**Me (protected)**
```
GET /api/auth/me
Authorization: Bearer <jwt>
```
→ `200 { "user": { ... } }`, or `401` if the token is missing, invalid, or
expired.

**Verify email (protected)**
```
POST /api/auth/verify-email
Authorization: Bearer <jwt>
Content-Type: application/json

{ "otp": "107692" }
```
→ `200 { "user": { ..., "verified": true } }`. `400` if the code is wrong or
expired (codes last 10 minutes).

**Resend OTP (protected)**
```
POST /api/auth/resend-otp
Authorization: Bearer <jwt>
```
→ `200 { "message": "Verification code resent" }`. `400` if already verified.

**Forgot password**
```
POST /api/auth/forgot-password
Content-Type: application/json

{ "email": "alex@example.com" }
```
→ always `200 { "message": "If that email is registered, we've sent a reset link." }`
(same response whether or not the email exists, so this can't be used to
enumerate accounts). Emails a link to `FRONTEND_URL/reset-password?token=...`,
valid for 30 minutes.

**Reset password**
```
POST /api/auth/reset-password
Content-Type: application/json

{ "token": "<raw token from the emailed link>", "password": "new password, 8+ chars" }
```
→ `200 { "message": "Password updated — you can now log in" }`, or `400` if
the token is invalid/expired.

Access tokens expire after `JWT_EXPIRES_IN` (default `7d`). There's no
refresh-token flow — once expired, the user logs in again.

## Profile & onboarding API

Base path: `/api/users`. All protected.

| Method | Route | Body | Description |
|---|---|---|---|
| PATCH | `/api/users/me` | `{ name?, email?, bio?, avatar?, skillsOffered?, skillsWanted? }` | Partial update, returns `{ user }` |
| PATCH | `/api/users/me/onboarding` | `{ role, interests, goal }` | Sets `onboarded: true`, returns `{ user }` |

`role` must be one of `"learn" | "teach" | "both"`; `goal` one of
`"casual" | "regular" | "intense"`; `interests` is an array of category keys
(e.g. `["programming", "design"]`).

## Progress API (lesson completion)

Base path: `/api/progress`. All protected.

| Method | Route | Description |
|---|---|---|
| GET | `/api/progress` | `{ enrolled: [{ skillId, completedLessons: [1,2,...], enrolledAt }] }` for the current user |
| POST | `/api/progress/:skillId/enroll` | Enrolls (idempotent) → `{ entry }` |
| POST | `/api/progress/:skillId/lessons/:lessonId/complete` | Marks a lesson done, auto-enrolling if needed → `{ entry }` |

## Wishlist API

Base path: `/api/wishlist`. Protected. The saved-skill-id list itself lives
on the user document (`user.wishlist`, already included in `/api/auth/me`),
so there's no separate GET — just the toggle:

| Method | Route | Description |
|---|---|---|
| POST | `/api/wishlist/:skillId/toggle` | Adds/removes the id → `{ wishlist: [...] }` |

## Notifications API

Base path: `/api/notifications`. All protected. A "Welcome to SkillSwap"
notification is created automatically on signup.

| Method | Route | Description |
|---|---|---|
| GET | `/api/notifications` | `{ notifications: [...] }`, newest first |
| PATCH | `/api/notifications/:id/read` | Marks one as read → `{ notification }` |
| PATCH | `/api/notifications/read-all` | Marks all as read → `{ notifications: [...] }` |

## Mentor accounts

Skills ship from the seed data with no real account behind their mentor —
`Skill.mentor` is just denormalized display info (name, initials, title,
rating). This adds a way to link a skill's mentor slot to a real,
logged-in `User` via `Skill.mentorUser`, so that user can see and manage
bookings for it. There's currently no "create your own skill listing" flow —
claiming is scoped to the 8 seeded skills for now; skill authoring would be
a separate feature.

Base path: `/api/skills`. All protected.

| Method | Route | Description |
|---|---|---|
| GET | `/api/skills/mentor/available` | Skills with no `mentorUser` yet → `{ results }` |
| GET | `/api/skills/mentor/mine` | Skills the current user mentors → `{ results }` |
| PATCH | `/api/skills/:id/claim` | Links the current user as this skill's mentor, refreshing `mentor.name`/`mentor.initials` from their profile → `{ skill }`. `409` if someone else already claimed it. |
| PATCH | `/api/skills/:id/unclaim` | Releases it → `{ skill }`. `403` if you're not the current mentor. |

There's no role gate on claiming (any logged-in user can claim an unclaimed
skill) — add a check against `user.role === 'teach' || 'both'` in
`claimSkillMentor` if you want to restrict it to users who chose "Teach" or
"Both" during onboarding.

## Bookings API

Base path: `/api/bookings`. All protected. A booking is confirmed the
moment it's created — there's no approval step. `status` is
`confirmed | cancelled | completed`.

**Learner side:**

| Method | Route | Body | Description |
|---|---|---|---|
| POST | `/api/bookings` | `{ skillId, scheduledAt, durationMinutes?, notes? }` | Books a session → `{ booking }`. `scheduledAt` must be an ISO date in the future. |
| GET | `/api/bookings?when=upcoming\|past` | — | Lists the current user's non-cancelled bookings → `{ bookings }`. Omit `when` for everything. |
| PATCH | `/api/bookings/:id/cancel` | — | Cancels a booking you made → `{ booking }` |

**Mentor side** (only works for skills you've claimed via `/claim` above):

| Method | Route | Description |
|---|---|---|
| GET | `/api/bookings/mentor?when=upcoming\|past` | Sessions booked with skills you mentor → `{ bookings }`, each with a populated `learner: { id, name, email }` |
| PATCH | `/api/bookings/:id/mentor-cancel` | Cancel a session as the mentor → `{ booking }`. `403` if you're not that skill's mentor. |
| PATCH | `/api/bookings/:id/complete` | Mark a session completed → `{ booking }` |

Mentor name/initials/skill title are copied onto the booking at creation
time, so a session still displays correctly even if the skill's mentor info
changes later.

**Paid checkout (Checkout page):**

Plain `POST /api/bookings` above creates a free/unpaid booking. For the
Checkout flow (mentor picker → session type/availability → pay), use this
instead — it books the session **and** records the payment atomically,
inside a Mongo session transaction, so a booking can never exist unpaid
(mirrors the frontend mock's `payAndBookSession`):

| Method | Route | Body | Description |
|---|---|---|---|
| POST | `/api/bookings/checkout` | `{ skillId, scheduledAt, durationMinutes?, notes?, sessionType, price, method }` | Books + pays in one step → `{ booking, wallet: { balance } }`. `method` is `"card"` or `"wallet"`. `400` if `method: "wallet"` and the balance is short. |

Cancelling a **paid** booking that hasn't happened yet (`PATCH
/api/bookings/:id/cancel`) now also refunds the price to the learner's
wallet — regardless of the original payment method — and logs a `refund`
transaction. The response becomes `{ booking, wallet: { balance } }` when a
refund happened, or just `{ booking }` otherwise.

**Mentor earnings (Mentor Dashboard):**

| Method | Route | Description |
|---|---|---|
| GET | `/api/bookings/mentor/earnings` | Real numbers computed from your paid/completed bookings + reviews → `{ earnings, studentsCount, upcomingCount, avgRating, reviewsCount }` |

## Wallet API

Base path: `/api/wallet`. All protected. Every new account starts with a
$50 welcome credit (`user.wallet.balance`), matching the frontend mock's
seed state. Every balance change (top-up, paid checkout, refund) is logged
as a `Transaction` — the ledger `PaymentHistory.jsx` and the Wallet page's
"recent activity" list can filter/display directly.

| Method | Route | Body | Description |
|---|---|---|---|
| GET | `/api/wallet` | — | Current balance → `{ wallet: { balance } }` |
| GET | `/api/wallet/transactions?page=&limit=` | — | Full ledger, newest first → `{ transactions: [...], page, limit, total, totalPages }`. Each transaction has `type` (`topup`\|`session_payment`\|`refund`), a signed `amount`, `method`, `description`, and `booking` (id or null). |
| POST | `/api/wallet/topup` | `{ amount, method? }` | Card top-up (method defaults to `"card"`) → `201 { wallet: { balance }, transaction }` |

## Email

Set `SMTP_HOST` (and `SMTP_USER`/`SMTP_PASS` if required) in `.env` to send
real emails via any SMTP provider. **[Mailtrap](https://mailtrap.io)** is a
good free option for testing — it catches emails in a sandbox inbox instead
of sending to real addresses, so you can see OTPs/reset links safely during
development. If `SMTP_HOST` is left blank, emails are logged to the server
console instead — signup/verify/reset all still work end-to-end, you just
read the OTP/link from the terminal instead of an inbox.

## Wiring up the frontend

In `Explore.jsx`, replace the static import and client-side `filter`/`sort`
with a fetch that passes the same state as query params:

```js
// instead of: import { categories, levels, skills } from '../data/skills.js';
const [results, setResults] = React.useState([]);

React.useEffect(() => {
  const params = new URLSearchParams();
  if (query) params.set('q', query);
  activeCats.forEach(c => params.append('cat', c));
  activeLevels.forEach(l => params.append('level', l));
  params.set('sort', sort);

  fetch(`http://localhost:5000/api/skills?${params}`)
    .then(res => res.json())
    .then(data => setResults(data.results));
}, [query, activeCats, activeLevels, sort]);
```

In `SkillDetail.jsx` and `LessonPlayer.jsx`, replace `getSkillById(id)` with:

```js
const [skill, setSkill] = React.useState(null);
React.useEffect(() => {
  fetch(`http://localhost:5000/api/skills/${id}`)
    .then(res => (res.ok ? res.json() : null))
    .then(setSkill);
}, [id]);
```

For the category checkboxes/counts in `Explore.jsx`'s filter panel, fetch
`/api/skills/meta/categories` once on mount instead of importing `categories`
from the mock data file — each entry now includes a live `count` field.

### Auth, profile, progress, wishlist, notifications

All of this is already wired up in the `skillswap-frontend` project you have
— `UserContext.jsx` calls every endpoint documented below via a small
`src/lib/api.js` fetch helper, and the token is kept in `localStorage`. See
that project's README for what changed on the frontend side.

Once you're ready for real API calls in development, consider moving the
base URL (`http://localhost:5000`) into a Vite env var (`VITE_API_URL`) so it
can point at a deployed backend in production without code changes.

## Project structure

```
skillswap-backend/
  server.js                    Express app entrypoint
  src/
    config/db.js                Mongoose connection to Atlas
    models/
      Skill.js                   Skill schema (mentor, lessons, prerequisites, tags)
      User.js                    User schema (auth, verification, onboarding, profile, wishlist)
      Progress.js                 Per-user, per-skill lesson completion
      Notification.js             Per-user notification feed
      Booking.js                   Per-user mentor session bookings (+ price/paid/paymentMethod)
      Transaction.js                Wallet ledger entries (topup/session_payment/refund)
      Review.js                     Per-booking mentor reviews
      Certificate.js                 Auto-issued on 100% skill completion
      CommunityPost.js                Skill-exchange offers/requests
      Message.js                      Direct messages (realtime via Socket.io)
    controllers/
      skillsController.js        list/detail/meta route handlers
      authController.js          signup/login/me/verify/resend/forgot/reset
      usersController.js         profile update + onboarding
      progressController.js       list/enroll/complete-lesson
      wishlistController.js       toggle
      notificationsController.js  list/mark-read/mark-all-read
      bookingsController.js       create/checkout/list/cancel(+refund)/mentor earnings
      walletController.js          balance/transactions/top-up
    routes/                       one router per resource above
    middleware/
      errorHandler.js             404 + central error handler (incl. duplicate-key/validation messages)
      auth.js                      requireAuth — verifies JWT, attaches req.user
    utils/
      email.js                    nodemailer wrapper (console-log fallback in dev)
      tokens.js                    OTP + hashed reset-token generation
    data/
      skillsSeedData.js          the 8 skills + categories/levels, mirrored from the frontend
      seed.js                    seeds/resets the `skills` collection
  .env.example
```

## Notes

- The `id` field on each skill is a human-readable slug (`react-fundamentals`),
  matching what the frontend already uses in its routes (`/skill/:id`,
  `/learn/:id`) — Mongo's own `_id` is stripped from API responses via a
  `toJSON` transform so the frontend doesn't need to change how it reads
  records.
- CORS is restricted to `CLIENT_ORIGIN` in `.env` (defaults to the Vite dev
  server at `http://localhost:5173`). Add your deployed frontend's origin
  there (comma-separated for multiple origins) before deploying.
- Lesson-completion state in `LessonPlayer.jsx` stays as local `useState` for
  now — persisting it needs a `Progress` model tied to a logged-in user,
  which depends on the Phase 2 auth system per the frontend README.
