import { parseIsoDuration, formatSecondsAsDuration } from '../utils/ytDuration.js';
import { parseChaptersFromDescription, syntheticChapters } from '../utils/ytChapters.js';

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
 * Fetches a single video's details for a mentor pasting a YouTube URL while
 * building a lesson. This is the ONLY way a video ever gets attached to a
 * course — it looks up exactly the video the mentor linked (no searching,
 * no ranking, no substitution) and reports back enough to preview + store
 * it (title/thumbnail/duration/chapters) on that lesson.
 * Returns { video, chapters } or throws a { status, message } error if the
 * URL/id didn't resolve to a real, public video.
 */
export async function getVideoByUrl(rawUrl) {
  const videoId = extractVideoId(rawUrl);
  if (!videoId) {
    const err = new Error('That doesn\'t look like a valid YouTube video URL.');
    err.status = 400;
    throw err;
  }

  let details;
  try {
    details = await fetchVideoDetails([videoId]);
  } catch (err) {
    if (err instanceof QuotaExceededError) {
      const quotaErr = new Error('YouTube API quota exceeded — try again later.');
      quotaErr.status = 503;
      throw quotaErr;
    }
    throw err;
  }
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
