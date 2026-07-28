import { getCourseForSkill } from '../services/youtubeService.js';

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
