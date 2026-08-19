// Curation rules used to filter/rank YouTube results into a "course" for a
// given skill. Kept as plain data so non-engineers can tweak it without
// touching the fetching/filtering logic.

// Matched case-insensitively against `snippet.channelTitle`. A video from
// one of these channels gets a large ranking boost so it surfaces first
// whenever it's relevant to the skill.
export const PREFERRED_CHANNELS = [
  'freeCodeCamp.org',
  'Traversy Media',
  'Programming with Mosh',
  'The Net Ninja',
  'Web Dev Simplified',
  'Academind',
  'Fireship',
  'CodeWithHarry',
  'Kevin Powell',
  'SuperSimpleDev',
  'Bro Code'
];

// Title/description substrings that disqualify a video outright — Shorts,
// clips, trailers, and promotional/marketing content, none of which are
// full tutorials.
export const EXCLUDE_KEYWORDS = [
  '#shorts', 'shorts', ' short ', 'trailer', 'teaser', 'promo', 'advert',
  'sponsored', 'clip |', '| clip', 'reaction', 'react to', 'unboxing',
  'giveaway', 'live stream replay', 'meme', 'compilation of memes'
];

// Duration bounds in seconds. Minimum keeps out Shorts/clips; the generous
// maximum deliberately allows full multi-hour "complete course" uploads,
// which are usually the best single resource for a skill.
export const MIN_DURATION_SECONDS = 30 * 60;      // 30 minutes
export const MAX_DURATION_SECONDS = 12 * 60 * 60; // 12 hours

// Minimum views before a video is considered "has good engagement" — filters
// out obscure/low-quality uploads without being so strict it starves niche
// skills of any results.
export const MIN_VIEW_COUNT = 3000;

// Query templates run per skill and merged/deduped. Having a few variants
// surfaces both full-course uploads and more traditional tutorial series.
export function buildQueries(skillTitle) {
  return [
    `${skillTitle} full course`,
    `${skillTitle} complete tutorial`,
    `${skillTitle} for beginners`,
    `${skillTitle} crash course`
  ];
}

// Simple script-based heuristic used only when a video doesn't expose
// defaultAudioLanguage/defaultLanguage — flags titles that are clearly in a
// non-Latin script so we don't accidentally include them under "English".
const NON_LATIN_SCRIPT = /[\u0600-\u06FF\u0900-\u097F\u4E00-\u9FFF\u3040-\u30FF\uAC00-\uD7AF\u0400-\u04FF]/;
export function looksNonEnglish(text) {
  return NON_LATIN_SCRIPT.test(text || '');
}
