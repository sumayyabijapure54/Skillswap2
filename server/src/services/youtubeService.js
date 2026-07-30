import { cacheGet, cacheSet } from '../utils/ytCache.js';
import { parseIsoDuration, formatSecondsAsDuration } from '../utils/ytDuration.js';
import { parseChaptersFromDescription, syntheticChapters } from '../utils/ytChapters.js';
import {
  PREFERRED_CHANNELS, EXCLUDE_KEYWORDS, MIN_DURATION_SECONDS,
  MAX_DURATION_SECONDS, MIN_VIEW_COUNT, buildQueries, looksNonEnglish
} from '../config/youtubeCuration.js';

const YT_BASE = 'https://www.googleapis.com/youtube/v3';

class QuotaExceededError extends Error {}

async function ytFetch(path, params) {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) throw new Error('YOUTUBE_API_KEY is not configured on the server.');

  const url = new URL(`${YT_BASE}/${path}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  url.searchParams.set('key', key);

  const res = await fetch(url.toString());
  const data = await res.json();

  if (!res.ok) {
    const reason = data?.error?.errors?.[0]?.reason;
    if (reason === 'quotaExceeded' || reason === 'dailyLimitExceeded') {
      throw new QuotaExceededError('YouTube API quota exceeded');
    }
    throw new Error(data?.error?.message || `YouTube API error (${res.status})`);
  }
  return data;
}

function isExcluded(title, description) {
  const haystack = `${title} ${description}`.toLowerCase();
  return EXCLUDE_KEYWORDS.some((kw) => haystack.includes(kw.toLowerCase()));
}

function isPreferredChannel(channelTitle) {
  const lower = (channelTitle || '').toLowerCase();
  return PREFERRED_CHANNELS.some((c) => lower.includes(c.toLowerCase()));
}

// Combines relevance, engagement, and channel trust into a single sort
// score. Preferred-channel boost dominates so freeCodeCamp/Traversy/etc.
// content floats to the top whenever it's on-topic, but a great video from
// an unlisted channel can still win if a skill has no preferred coverage.
function scoreVideo(video) {
  const viewScore = Math.log10(Math.max(video.viewCount, 1));
  const likeRatio = video.viewCount > 0 ? video.likeCount / video.viewCount : 0;
  const engagementScore = likeRatio * 50;
  const channelBoost = isPreferredChannel(video.channelTitle) ? 25 : 0;
  const fullCourseBoost = /full course|complete (course|tutorial)|from scratch|crash course/i.test(video.title) ? 4 : 0;
  return viewScore + engagementScore + channelBoost + fullCourseBoost;
}

async function searchVideoIds(query) {
  const data = await ytFetch('search', {
    part: 'snippet',
    q: query,
    type: 'video',
    maxResults: 25,
    relevanceLanguage: 'en',
    safeSearch: 'strict',
    videoDuration: 'long', // YouTube enum: >20min — precise filtering happens after
    videoEmbeddable: 'true'
  });
  return (data.items || [])
    .filter((item) => item.id?.videoId)
    .map((item) => item.id.videoId);
}

async function fetchVideoDetails(ids) {
  if (ids.length === 0) return [];
  const data = await ytFetch('videos', {
    part: 'snippet,contentDetails,statistics',
    id: ids.join(',')
  });
  return data.items || [];
}

function toVideoSummary(item) {
  const durationSeconds = parseIsoDuration(item.contentDetails?.duration);
  return {
    id: item.id,
    title: item.snippet.title,
    description: item.snippet.description,
    channelTitle: item.snippet.channelTitle,
    channelId: item.snippet.channelId,
    thumbnail: item.snippet.thumbnails?.maxres?.url
      || item.snippet.thumbnails?.high?.url
      || item.snippet.thumbnails?.medium?.url,
    publishedAt: item.snippet.publishedAt,
    defaultAudioLanguage: item.snippet.defaultAudioLanguage || item.snippet.defaultLanguage || null,
    liveBroadcastContent: item.snippet.liveBroadcastContent,
    durationSeconds,
    duration: formatSecondsAsDuration(durationSeconds),
    viewCount: Number(item.statistics?.viewCount || 0),
    likeCount: Number(item.statistics?.likeCount || 0),
    url: `https://www.youtube.com/watch?v=${item.id}`,
    embedUrl: `https://www.youtube-nocookie.com/embed/${item.id}`
  };
}

function passesFilters(video) {
  if (video.liveBroadcastContent && video.liveBroadcastContent !== 'none') return false;
  if (video.durationSeconds < MIN_DURATION_SECONDS || video.durationSeconds > MAX_DURATION_SECONDS) return false;
  if (video.viewCount < MIN_VIEW_COUNT) return false;
  if (isExcluded(video.title, video.description)) return false;

  if (video.defaultAudioLanguage) {
    if (!video.defaultAudioLanguage.toLowerCase().startsWith('en')) return false;
  } else if (looksNonEnglish(video.title)) {
    return false;
  }
  return true;
}

/**
 * Picks ONE best-matching full course video for a skill and breaks it into
 * chapters, so the curriculum sidebar represents topics *within that one
 * video* (seeking the same player) instead of a grab-bag of unrelated
 * standalone videos. We prefer the top-ranked candidate that ships real
 * author-provided chapters in its description; if none of the candidates
 * have those, we fall back to the single top-ranked video with evenly
 * split synthetic segments so there's still more than one curriculum step.
 */
function chooseVideoAndChapters(candidates) {
  for (const video of candidates) {
    const chapters = parseChaptersFromDescription(video.description, video.durationSeconds);
    if (chapters.length >= 3) return { video, chapters, chaptersAreReal: true };
  }
  const video = candidates[0];
  return { video, chapters: syntheticChapters(video.durationSeconds), chaptersAreReal: false };
}

// Pulls the 11-char video id out of any common YouTube URL shape
// (watch?v=, youtu.be/, /embed/, /shorts/) or accepts a bare id.
function extractVideoId(input) {
  const trimmed = (input || '').trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;

  try {
    const url = new URL(trimmed);
    if (url.hostname.includes('youtu.be')) {
      return url.pathname.slice(1).split('/')[0] || null;
    }
    if (url.hostname.includes('youtube.com')) {
      if (url.searchParams.get('v')) return url.searchParams.get('v');
      const match = /\/(embed|shorts)\/([a-zA-Z0-9_-]{11})/.exec(url.pathname);
      if (match) return match[2];
    }
  } catch {
    // not a valid URL at all
  }
  return null;
}

/**
 * Fetches a single video's details for a mentor pasting a YouTube URL when
 * uploading a course. Unlike getCourseForSkill this doesn't search or rank
 * — it looks up exactly the video the mentor linked and reports back
 * enough to preview + store it (title/thumbnail/duration/chapters).
 * Returns { video, chapters } with video: null if the URL/id didn't
 * resolve to a real, public video.
 */
export async function getVideoByUrl(rawUrl) {
  const videoId = extractVideoId(rawUrl);
  if (!videoId) {
    const err = new Error('That doesn\'t look like a valid YouTube video URL.');
    err.status = 400;
    throw err;
  }

  const details = await fetchVideoDetails([videoId]);
  if (details.length === 0) {
    const err = new Error('Could not find a public YouTube video at that URL.');
    err.status = 404;
    throw err;
  }

  const video = toVideoSummary(details[0]);
  const chapters = parseChaptersFromDescription(video.description, video.durationSeconds);
  const finalChapters = chapters.length >= 3 ? chapters : syntheticChapters(video.durationSeconds);

  return {
    video,
    chapters: finalChapters.map((c, i) => ({
      id: `${video.id}-ch${i}`,
      title: c.title,
      startSeconds: c.startSeconds,
      endSeconds: c.endSeconds,
      duration: formatSecondsAsDuration(Math.max(0, c.endSeconds - c.startSeconds))
    }))
  };
}

/**
 * Fetches, filters, dedupes, and ranks candidate videos for a skill, then
 * settles on a single course video + its chapter list. Cached per skill
 * (utils/ytCache.js — memory + Mongo) so repeat page loads and multiple
 * users don't each burn fresh API quota.
 */
export async function getCourseForSkill({ skillTitle, limit = 8 }) {
  const cacheKey = `yt:course:v2:${skillTitle.toLowerCase().trim()}`;
  const cached = await cacheGet(cacheKey);
  if (cached && !cached.stale) {
    return { ...cached.value, source: 'cache', quotaExceeded: false };
  }

  try {
    const queries = buildQueries(skillTitle);
    const idSets = await Promise.all(queries.map(searchVideoIds));
    const uniqueIds = [...new Set(idSets.flat())];

    const chunks = [];
    for (let i = 0; i < uniqueIds.length; i += 50) chunks.push(uniqueIds.slice(i, i + 50));
    const detailBatches = await Promise.all(chunks.map(fetchVideoDetails));
    const details = detailBatches.flat();

    const candidates = details
      .map(toVideoSummary)
      .filter(passesFilters)
      .sort((a, b) => scoreVideo(b) - scoreVideo(a))
      .slice(0, Math.max(limit, 5));

    let result;
    if (candidates.length === 0) {
      result = { video: null, chapters: [] };
    } else {
      const { video, chapters } = chooseVideoAndChapters(candidates);
      result = {
        video,
        chapters: chapters.map((c, i) => ({
          id: `${video.id}-ch${i}`,
          title: c.title,
          startSeconds: c.startSeconds,
          endSeconds: c.endSeconds,
          duration: formatSecondsAsDuration(Math.max(0, c.endSeconds - c.startSeconds))
        }))
      };
    }

    await cacheSet(cacheKey, result);
    return { ...result, source: 'live', quotaExceeded: false };
  } catch (err) {
    if (err instanceof QuotaExceededError && cached) {
      return { ...cached.value, source: 'stale-cache', quotaExceeded: true };
    }
    if (err instanceof QuotaExceededError) {
      return { video: null, chapters: [], source: 'none', quotaExceeded: true };
    }
    throw err;
  }
}
