import { cacheGet, cacheSet } from '../utils/ytCache.js';
import { parseIsoDuration, formatSecondsAsDuration } from '../utils/ytDuration.js';
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
 * Fetches, filters, dedupes, and ranks a "course" of tutorial videos for a
 * given skill. Cached per skill (utils/ytCache.js — memory + Mongo) so
 * repeat page loads and multiple users don't each burn fresh API quota.
 */
export async function getCourseForSkill({ skillTitle, limit = 8 }) {
  const cacheKey = `yt:course:${skillTitle.toLowerCase().trim()}:${limit}`;
  const cached = await cacheGet(cacheKey);
  if (cached && !cached.stale) {
    return { videos: cached.value, source: 'cache', quotaExceeded: false };
  }

  try {
    const queries = buildQueries(skillTitle);
    const idSets = await Promise.all(queries.map(searchVideoIds));
    const uniqueIds = [...new Set(idSets.flat())];

    const chunks = [];
    for (let i = 0; i < uniqueIds.length; i += 50) chunks.push(uniqueIds.slice(i, i + 50));
    const detailBatches = await Promise.all(chunks.map(fetchVideoDetails));
    const details = detailBatches.flat();

    const videos = details
      .map(toVideoSummary)
      .filter(passesFilters)
      .sort((a, b) => scoreVideo(b) - scoreVideo(a))
      .slice(0, limit);

    await cacheSet(cacheKey, videos);
    return { videos, source: 'live', quotaExceeded: false };
  } catch (err) {
    if (err instanceof QuotaExceededError && cached) {
      return { videos: cached.value, source: 'stale-cache', quotaExceeded: true };
    }
    if (err instanceof QuotaExceededError) {
      return { videos: [], source: 'none', quotaExceeded: true };
    }
    throw err;
  }
}
