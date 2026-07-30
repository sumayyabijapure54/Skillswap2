// Client for the backend's /api/youtube/course endpoint (see server/).
// The YouTube API key never touches the browser — this only talks to our
// own server, which does the fetching/filtering/ranking.
//
// A second cache layer lives here in localStorage. The backend already
// caches per-skill results so it doesn't re-hit YouTube's quota-limited
// API on every request, but this layer means repeat visits to the same
// lesson page render instantly with zero network round-trip too.

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5002';
const LOCAL_CACHE_PREFIX = 'skillswap_yt_cache_v2:';
const LOCAL_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

function readLocalCache(key) {
  try {
    const raw = localStorage.getItem(LOCAL_CACHE_PREFIX + key);
    if (!raw) return null;
    const { value, expiresAt } = JSON.parse(raw);
    if (Date.now() > expiresAt) return null;
    return value;
  } catch {
    return null;
  }
}

function writeLocalCache(key, value) {
  try {
    localStorage.setItem(LOCAL_CACHE_PREFIX + key, JSON.stringify({
      value, expiresAt: Date.now() + LOCAL_TTL_MS
    }));
  } catch {
    // localStorage full/unavailable — non-fatal, just skip caching
  }
}

/**
 * Fetches ONE real YouTube course video for a skill, plus its chapter list
 * (either the video's own author-provided chapters, or evenly-split
 * fallback segments). Every curriculum "topic" the UI shows comes from this
 * single video's chapters — never a mix of different videos.
 * Returns { video, chapters, source, quotaExceeded, error }. Never throws —
 * callers can rely on `error` being set instead, so the UI can fall back
 * gracefully to the app's own sample lesson content.
 */
export async function fetchCourseVideo(skillTitle) {
  const cacheKey = skillTitle.toLowerCase().trim();
  const cached = readLocalCache(cacheKey);
  if (cached) return { video: cached.video, chapters: cached.chapters, source: 'local-cache', quotaExceeded: false, error: null };

  try {
    const url = `${API_BASE}/api/youtube/course?skill=${encodeURIComponent(skillTitle)}`;
    const res = await fetch(url);
    const data = await res.json().catch(() => null);

    if (!res.ok || !data) {
      return { video: null, chapters: [], source: 'none', quotaExceeded: false, error: data?.error || `Request failed (${res.status})` };
    }
    if (data.video) writeLocalCache(cacheKey, { video: data.video, chapters: data.chapters || [] });
    return { video: data.video || null, chapters: data.chapters || [], source: data.source, quotaExceeded: !!data.quotaExceeded, error: null };
  } catch (err) {
    return { video: null, chapters: [], source: 'none', quotaExceeded: false, error: err.message || 'Network error' };
  }
}
