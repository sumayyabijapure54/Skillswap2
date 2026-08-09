# SkillSwap — merged project

This is your `client/` (frontend) and `server/` (backend, with Razorpay +
the new YouTube-powered lesson player) wired to run together.

## 1. Backend

```bash
cd server
npm install
cp .env.example .env
```

Fill in `.env`:
- `MONGODB_URI` — your Atlas connection string
- `JWT_SECRET` — any long random string
- `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` — from your Razorpay dashboard
- `YOUTUBE_API_KEY` — from Google Cloud Console → enable "YouTube Data API v3" → Credentials → Create API key

```bash
npm run seed   # first time only, populates the skills catalog
npm run dev    # listens on http://localhost:5002
```

## 2. Frontend

```bash
cd client
npm install
cp .env.example .env
npm run dev    # http://localhost:5173, already pointed at :5002
```

## How the YouTube integration actually works

This is a single-lookup design, not a search/curation pipeline:
- `GET /api/youtube/video?url=...` (`src/services/youtubeService.js`,
  `controllers/youtubeController.js`, `routes/youtubeRoutes.js`) resolves
  one YouTube URL a mentor pastes while building a lesson
  (`MentorCourseForm.jsx`) to that exact video's title/thumbnail/duration/
  chapters. There's no search, ranking, or auto-selection, and nothing
  fetches YouTube data on a learner's page load — so there's no caching
  layer to configure and no meaningful quota risk from normal use.
- `src/utils/ytDuration.js` — parses/formats ISO 8601 durations.
  `src/utils/ytChapters.js` — parses chapter timestamps out of a video's
  description (or synthesizes evenly-spaced ones if none exist).
- On the frontend, `components/YouTubePlayer.jsx` just embeds a
  `videoId` that was already resolved and stored on the lesson at
  authoring time; `components/CourseSkeleton.jsx` provides its loading
  skeleton. `pages/LessonPlayer.jsx` wires these into quiz checkpoints,
  save-for-later, continue-watching, and completion tracking.

## Skills catalog

`server/src/models/Skill.js` (MongoDB, seeded via `npm run seed`) is the
single source of truth — the frontend calls `GET /api/skills` and friends
through `src/lib/skillsApi.js`. There's no separate static/local skills
file to keep in sync.
