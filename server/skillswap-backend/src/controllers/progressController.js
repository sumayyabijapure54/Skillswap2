import Progress from '../models/Progress.js';
import { issueIfEarned } from './certificatesController.js';

// Mirrors Progress's toJSON transform for .lean() results.
function leanProgress(p) {
  const { _id, __v, user, ...rest } = p;
  return rest;
}

// GET /api/progress  (protected) — everything the current user is enrolled in
export async function listProgress(req, res, next) {
  try {
    const entries = await Progress.find({ user: req.user._id }).lean();
    res.json({ enrolled: entries.map(leanProgress) });
  } catch (err) {
    next(err);
  }
}

// POST /api/progress/:skillId/enroll  (protected)
export async function enroll(req, res, next) {
  try {
    const { skillId } = req.params;

    const entry = await Progress.findOneAndUpdate(
      { user: req.user._id, skillId },
      { $setOnInsert: { user: req.user._id, skillId, completedLessons: [], enrolledAt: new Date() } },
      { new: true, upsert: true }
    );

    res.json({ entry });
  } catch (err) {
    next(err);
  }
}

// POST /api/progress/:skillId/lessons/:lessonId/complete  (protected)
// Auto-enrolls if the user hadn't already, matching the frontend's
// markLessonComplete behavior. If this was the skill's last lesson, also
// issues a certificate (see certificatesController.issueIfEarned).
export async function completeLesson(req, res, next) {
  try {
    const { skillId } = req.params;
    const lessonId = Number(req.params.lessonId);

    let entry = await Progress.findOne({ user: req.user._id, skillId });

    if (!entry) {
      entry = await Progress.create({
        user: req.user._id,
        skillId,
        completedLessons: [lessonId]
      });
    } else if (!entry.completedLessons.includes(lessonId)) {
      entry.completedLessons.push(lessonId);
      await entry.save();
    }

    const { certificate, justIssued } = await issueIfEarned(req.user, skillId);

    res.json({ entry, certificate: justIssued ? certificate : null });
  } catch (err) {
    next(err);
  }
}

// POST /api/progress/:skillId/lessons/:lessonId/quiz  { score, total }  (protected)
// Auto-enrolls if needed, same reasoning as completeLesson — a quiz score
// shouldn't get silently dropped just because enroll() was never called.
export async function recordQuizScore(req, res, next) {
  try {
    const { skillId, lessonId } = req.params;
    const { score, total } = req.body;

    const entry = await Progress.findOneAndUpdate(
      { user: req.user._id, skillId },
      {
        $setOnInsert: { user: req.user._id, skillId, completedLessons: [], enrolledAt: new Date() },
        $set: { [`quizScores.${lessonId}`]: { score, total } }
      },
      { new: true, upsert: true }
    );

    res.json({ entry });
  } catch (err) {
    next(err);
  }
}
