import { getCourseForSkill, getVideoByUrl } from '../services/youtubeService.js';

// GET /api/youtube/course?skill=React%20Fundamentals&limit=8
// Public endpoint (no auth) — mirrors GET /api/skills being public.
export async function getYoutubeCourse(req, res, next) {
  try {
    const { skill, limit } = req.query;
    if (!skill || !skill.trim()) {
      return res.status(400).json({ message: 'Query param "skill" is required.' });
    }

    const result = await getCourseForSkill({
      skillTitle: skill.trim(),
      limit: Math.min(Number(limit) || 8, 10)
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

// GET /api/youtube/video?url=https://youtube.com/watch?v=...  (protected)
// Used by the mentor "Upload YouTube course" flow: the mentor pastes a
// link, we resolve it to a real video's title/thumbnail/duration so they
// can preview it before saving it onto a course.
export async function getYoutubeVideoById(req, res, next) {
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
