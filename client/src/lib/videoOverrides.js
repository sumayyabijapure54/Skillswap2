// Lets a mentor or admin swap in their own video for any lesson —
// a YouTube link or a direct/uploaded video file URL — without touching
// the app's default sample content. Overrides are stored centrally (not
// per-visitor) so every learner sees the same mentor-provided video, same
// as any other piece of course content would work.
//
// Shape in localStorage: { [skillId]: { [lessonId]: Override } }
// Override = { type: 'youtube', youtubeId, url } | { type: 'direct', url }

const STORAGE_KEY = 'skillswap_video_overrides_v1';

function loadAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveAll(all) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {
    // localStorage full/unavailable — non-fatal, edit just won't persist
  }
}

// Returns { [lessonId]: Override } for one skill (empty object if none set).
export function getOverridesForSkill(skillId) {
  const all = loadAll();
  return all[skillId] || {};
}

export function setVideoOverride(skillId, lessonId, override) {
  const all = loadAll();
  const forSkill = { ...(all[skillId] || {}), [lessonId]: override };
  all[skillId] = forSkill;
  saveAll(all);
  return forSkill;
}

export function clearVideoOverride(skillId, lessonId) {
  const all = loadAll();
  const forSkill = { ...(all[skillId] || {}) };
  delete forSkill[lessonId];
  all[skillId] = forSkill;
  saveAll(all);
  return forSkill;
}

// Matches youtube.com/watch?v=, youtu.be/, youtube.com/embed/, and
// youtube.com/shorts/ links and pulls out the 11-ish char video id.
const YT_REGEX = /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{6,15})/i;

// Parses whatever a mentor/admin pastes into either a YouTube override or a
// direct-video-URL override. Returns null if it isn't a usable URL at all,
// so the caller can show a validation error instead of silently saving junk.
export function parseVideoInput(raw) {
  const value = (raw || '').trim();
  if (!value) return null;

  const ytMatch = value.match(YT_REGEX);
  if (ytMatch) {
    return { type: 'youtube', youtubeId: ytMatch[1], url: value };
  }
  if (/^https?:\/\/.+/i.test(value)) {
    return { type: 'direct', url: value };
  }
  return null;
}
