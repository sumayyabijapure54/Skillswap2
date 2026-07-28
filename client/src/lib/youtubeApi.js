// Client for the backend's /api/youtube/course endpoint (see server/).
// The YouTube API key never touches the browser — this only talks to our
// own server, which does the fetching/filtering/ranking.
//
// A second cache layer lives here in localStorage. The backend already
// caches per-skill results so it doesn't re-hit YouTube's quota-limited
// API on every request, but this layer means repeat visits to the same
// lesson page render instantly with zero network round-trip too.

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const LOCAL_CACHE_PREFIX = 'skillswap_yt_cache_v1:';
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
 * Fetches a curated list of real YouTube tutorial videos for a skill.
 * Returns { videos, source, quotaExceeded, error }. Never throws — callers
 * can rely on `error` being set instead, so the UI can fall back gracefully
 * to the app's own sample lesson content.
 */
export async function fetchCourseVideos(skillTitle, limit = 8) {
  const cacheKey = `${skillTitle.toLowerCase().trim()}:${limit}`;
  const cached = readLocalCache(cacheKey);
  if (cached) return { videos: cached, source: 'local-cache', quotaExceeded: false, error: null };

  try {
    const url = `${API_BASE}/api/youtube/course?skill=${encodeURIComponent(skillTitle)}&limit=${limit}`;
    const res = await fetch(url);
    const data = await res.json().catch(() => null);

    if (!res.ok || !data) {
      return { videos: [], source: 'none', quotaExceeded: false, error: data?.error || `Request failed (${res.status})` };
    }
    if (data.videos?.length) writeLocalCache(cacheKey, data.videos);
    return { videos: data.videos || [], source: data.source, quotaExceeded: !!data.quotaExceeded, error: null };
  } catch (err) {
    return { videos: [], source: 'none', quotaExceeded: false, error: err.message || 'Network error' };
  }
}
