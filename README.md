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
- `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` — from your Razorpay dashboard (already wired, unchanged from what you sent)
- `YOUTUBE_API_KEY` — **new**, from Google Cloud Console → enable "YouTube Data API v3" → Credentials → Create API key

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

## What changed for the YouTube integration

**Backend** (`server/`) — new files, everything else untouched:
- `src/services/youtubeService.js` — fetches, filters (30 min–12h, English, no Shorts/trailers/promos), ranks, and dedupes YouTube results
- `src/controllers/youtubeController.js`, `src/routes/youtubeRoutes.js` — `GET /api/youtube/course?skill=...`, mounted in `server.js` alongside your other routes
- `src/utils/ytCache.js`, `src/utils/ytDuration.js`, `src/config/youtubeCuration.js` — caching (in-memory + Mongo) and the preferred-channel/filter rules (edit `youtubeCuration.js` to tune)
- `.env.example` — added `YOUTUBE_API_KEY` and `YOUTUBE_CACHE_TTL_HOURS`

**Frontend** (`client/`):
- `src/pages/LessonPlayer.jsx` rebuilt — real embedded YouTube videos merged with your existing quiz checkpoints, autoplay-next, save-for-later, download notes, ask-mentor, continue-watching rail, completion %, glass panels, GSAP animations, skeleton loading. Design/CSS otherwise unchanged.
- `src/components/YouTubePlayer.jsx`, `src/components/CourseSkeleton.jsx` — new
- `src/lib/youtubeApi.js` — new, calls the backend above
- `src/context/UserContext.jsx` — added save-for-later / continue-watching state (backward-compatible with existing localStorage)
- `.env.example` / `src/lib/api.js` — fixed to point at `:5002` (your real backend's port) instead of the placeholder `:4000`

## Note on the skills catalog

`client/src/data/skills.js` (a static local list) and `server/src/models/Skill.js`
(a real MongoDB collection, seeded via `npm run seed`) currently hold the
*same shape* of data but aren't wired together yet — the frontend still
reads its local copy rather than calling `GET /api/skills`. I left that
as-is since it's outside what was asked here, but it's worth knowing:
whichever skill data source the frontend ends up using, the YouTube
integration works the same either way since it only needs `skill.title`.
