// Best-effort transcript fetch for a YouTube video, used only as extra
// grounding text for AI quiz generation (services/aiQuizService.js). This
// deliberately does NOT use the official captions.download API — that
// requires OAuth on behalf of the video's own channel, which we don't have
// for arbitrary mentor-linked videos. Instead it reads the same public
// timedtext endpoint the YouTube player itself uses to render captions.
//
// This is unauthenticated and unofficial: it can fail (private/disabled
// captions, region locks, YouTube changing the endpoint) and every caller
// MUST treat a null return as "no transcript available" and fall back to
// the video's title/description/chapters instead of failing the request.

const TIMEDTEXT_BASE = 'https://www.youtube.com/api/timedtext';
// Keeps the AI prompt bounded — a transcript this long already covers a
// long-form course video in enough depth to write a solid quiz from.
const MAX_TRANSCRIPT_CHARS = 14000;

const ENTITY_MAP = {
  amp: '&', lt: '<', gt: '>', quot: '"', '#39': "'", apos: "'", nbsp: ' '
};

function decodeEntities(str) {
  return str.replace(/&(#\d+|#x[0-9a-f]+|[a-z0-9]+);/gi, (match, code) => {
    if (code[0] === '#') {
      const num = code[1]?.toLowerCase() === 'x' ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
      return Number.isNaN(num) ? match : String.fromCodePoint(num);
    }
    return ENTITY_MAP[code.toLowerCase()] ?? match;
  });
}

function stripTags(xml) {
  return xml.replace(/<[^>]+>/g, ' ');
}

// Extracts the plain text out of a timedtext XML/SRV1 document
// (`<transcript><text start="..." dur="...">line</text>...</transcript>`).
function parseTimedTextXml(xml) {
  const matches = [...xml.matchAll(/<text[^>]*>([\s\S]*?)<\/text>/g)];
  if (matches.length === 0) return '';
  return matches
    .map((m) => decodeEntities(stripTags(m[1])).replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .join(' ');
}

async function fetchTrackList(videoId) {
  const res = await fetch(`${TIMEDTEXT_BASE}?type=list&v=${encodeURIComponent(videoId)}`);
  if (!res.ok) return [];
  const xml = await res.text();
  const tracks = [...xml.matchAll(/<track\b[^>]*lang_code="([^"]+)"[^>]*(?:kind="([^"]*)")?[^>]*\/>/g)]
    .map((m) => ({ lang: m[1], kind: m[2] || '' }));
  return tracks;
}

async function fetchTrackText(videoId, lang, { translateToEn = false } = {}) {
  const params = new URLSearchParams({ v: videoId, lang });
  if (translateToEn) params.set('tlang', 'en');
  const res = await fetch(`${TIMEDTEXT_BASE}?${params.toString()}`);
  if (!res.ok) return null;
  const xml = await res.text();
  const text = parseTimedTextXml(xml);
  return text || null;
}

/**
 * Best-effort transcript fetch. Tries (in order): an English track, an
 * auto-generated English track, then the first available track translated
 * to English. Returns a plain-text string capped at MAX_TRANSCRIPT_CHARS,
 * or null if no captions could be found/parsed for any reason.
 */
export async function fetchTranscript(videoId) {
  if (!videoId) return null;

  try {
    const tracks = await fetchTrackList(videoId);

    const english = tracks.find((t) => t.lang?.toLowerCase().startsWith('en'));
    if (english) {
      const text = await fetchTrackText(videoId, english.lang);
      if (text) return text.slice(0, MAX_TRANSCRIPT_CHARS);
    }

    // No listed track at all doesn't always mean no captions — many videos
    // still serve an auto-generated English track directly.
    const directEnglish = await fetchTrackText(videoId, 'en');
    if (directEnglish) return directEnglish.slice(0, MAX_TRANSCRIPT_CHARS);

    if (tracks.length > 0) {
      const translated = await fetchTrackText(videoId, tracks[0].lang, { translateToEn: true });
      if (translated) return translated.slice(0, MAX_TRANSCRIPT_CHARS);
    }

    return null;
  } catch (err) {
    console.warn('[ytTranscript] failed to fetch transcript for', videoId, err.message);
    return null;
  }
}
