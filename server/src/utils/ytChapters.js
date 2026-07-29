// Extracts "chapters" (topic + start time) out of a single YouTube video so
// a whole course video can be presented as a curriculum of separate topics
// that all play *within the same video* (seeking, not switching videos).
//
// YouTube itself only turns a description's timestamp list into real
// chapters when it meets a few rules, so we mirror those rules here rather
// than inventing our own — that keeps our chapter list matching what the
// creator actually intended as the video's table of contents:
//   - at least 3 timestamps
//   - the first one at (or basically at) 0:00
//   - each timestamp strictly after the previous, at least ~10s apart

const TIMESTAMP_LINE = /^\s*(?:[-•*]\s*)?(?:\(|\[)?(?:(\d{1,2}):)?(\d{1,2}):(\d{2})(?:\)|\])?\s*[-–—:]?\s*(.+?)\s*$/;

function toSeconds(h, m, s) {
  return (Number(h) || 0) * 3600 + Number(m) * 60 + Number(s);
}

/**
 * Parses chapter markers out of a video description.
 * Returns [] if the description doesn't contain a real chapter list.
 */
export function parseChaptersFromDescription(description, totalDurationSeconds) {
  if (!description) return [];

  const raw = [];
  for (const line of description.split('\n')) {
    const match = TIMESTAMP_LINE.exec(line.trim());
    if (!match) continue;
    const [, h, m, s, titleRaw] = match;
    const title = titleRaw.replace(/^[-–—:]\s*/, '').trim();
    if (!title) continue;
    raw.push({ start: toSeconds(h, m, s), title });
  }

  if (raw.length < 3) return [];
  if (raw[0].start > 3) return []; // real chapter lists always start at ~0:00
  for (let i = 1; i < raw.length; i++) {
    if (raw[i].start <= raw[i - 1].start + 9) return []; // not strictly/sanely ascending
  }

  return raw.map((chapter, i) => ({
    title: chapter.title,
    startSeconds: chapter.start,
    endSeconds: i < raw.length - 1 ? raw[i + 1].start : totalDurationSeconds
  }));
}

/**
 * Fallback used when a video has no author-provided chapters. Splits the
 * runtime into evenly-sized numbered segments (~8 min each, capped at 8
 * segments) so the curriculum still has more than one step without
 * inventing topic names the video doesn't actually back up.
 */
export function syntheticChapters(totalDurationSeconds, targetSegmentSeconds = 8 * 60, maxSegments = 8) {
  const count = Math.max(1, Math.min(maxSegments, Math.round(totalDurationSeconds / targetSegmentSeconds) || 1));
  const size = totalDurationSeconds / count;
  return Array.from({ length: count }, (_, i) => ({
    title: `Part ${i + 1}`,
    startSeconds: Math.round(i * size),
    endSeconds: i === count - 1 ? totalDurationSeconds : Math.round((i + 1) * size)
  }));
}
