import { getVideoByUrl } from '../services/youtubeService.js';

// GET /api/youtube/video?url=https://youtube.com/watch?v=...  (protected)
// Used by the mentor course form: the mentor pastes a link for a lesson,
// we resolve it to that exact video's title/thumbnail/duration/chapters so
// they can preview it before saving it onto the lesson. This is the only
// YouTube lookup the app performs — there is no search or auto-selection.
export async function getYoutubeVideo(req, res, next) {
  try {
    const { url } = req.query;
    if (!url || !url.trim()) {
      return res.status(400).json({ message: 'Query param "url" is required.' });
    }

    const result = await getVideoByUrl(url.trim());
    res.json(result);
  } catch (err) {
    if (err.status) return res.status(err.status).json({ message: err.message });
    next(err);
  }
}
