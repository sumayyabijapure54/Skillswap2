import Skill from '../models/Skill.js';
import Quiz from '../models/Quiz.js';
import Progress from '../models/Progress.js';
import Certificate from '../models/Certificate.js';
import {
  toStoredQuestions, sanitizeForAttempt, forManage,
  gradeAndRecordAttempt, listMyAttempts
} from '../services/quizService.js';
import { issueIfEarned } from './certificatesController.js';

function sendQuizError(res, err, next) {
  if (err?.code === 'QUIZ_INVALID_INPUT') {
    return res.status(err.status || 400).json({ message: err.message });
  }
  if (err.status) return res.status(err.status).json({ message: err.message });
  next(err);
}

function isMentorOwner(skill, user) {
  return Boolean(skill.mentorUser) && skill.mentorUser.toString() === user._id.toString();
}

async function loadSkillOr404(skillId, res) {
  const skill = await Skill.findOne({ id: skillId });
  if (!skill) {
    res.status(404).json({ message: 'Course not found' });
    return null;
  }
  return skill;
}

// Only the owning mentor may create/edit/delete/publish a course's quiz —
// enforced identically across every /manage-style route below. No admin
// override, by design (see PROGRESS_NOTES: "Only the mentor who owns the
// course can create/edit/delete/publish its quiz").
async function loadOwnedSkillOr403(skillId, req, res) {
  const skill = await loadSkillOr404(skillId, res);
  if (!skill) return null;
  if (!isMentorOwner(skill, req.user)) {
    res.status(403).json({ message: "Only this course's mentor can manage its quiz." });
    return null;
  }
  return skill;
}

// ---------------------------------------------------------------------------
// MENTOR MANAGEMENT — create/edit/publish. Correct answers ARE included in
// these responses; never reachable by anyone but the owning mentor.
// ---------------------------------------------------------------------------

// GET /api/quiz/:skillId/manage  (protected — owning mentor only)
// Returns the full quiz (with answers) for editing/previewing, or
// `{ quiz: null }` if this course doesn't have one yet.
export async function getQuizForManage(req, res, next) {
  try {
    const { skillId } = req.params;
    const skill = await loadOwnedSkillOr403(skillId, req, res);
    if (!skill) return;

    const quiz = await Quiz.findOne({ skillId });
    res.json({ quiz: quiz ? forManage(quiz) : null });
  } catch (err) {
    sendQuizError(res, err, next);
  }
}

// PUT /api/quiz/:skillId  { questions, passingScore }  (protected — owning mentor only)
// Creates or fully replaces this course's quiz questions — the mentor's UI
// manages the whole question list client-side (add/edit/delete/reorder)
// and saves it in one shot, rather than one endpoint per micro-edit.
// Deliberately does NOT touch `published` — saving edits to an already
// -published quiz doesn't silently unpublish it; that's an explicit,
// separate action (see setPublished below).
export async function saveQuiz(req, res, next) {
  try {
    const { skillId } = req.params;
    const skill = await loadOwnedSkillOr403(skillId, req, res);
    if (!skill) return;

    const { questions: rawQuestions, passingScore } = req.body;
    const questions = toStoredQuestions(Array.isArray(rawQuestions) ? rawQuestions : []);

    const quiz = await Quiz.findOneAndUpdate(
      { skillId },
      {
        skillId,
        createdBy: req.user._id,
        questions,
        ...(passingScore != null ? { passingScore } : {})
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.json({ quiz: forManage(quiz) });
  } catch (err) {
    sendQuizError(res, err, next);
  }
}

// PATCH /api/quiz/:skillId/publish  { published: boolean }  (protected — owning mentor only)
export async function setPublished(req, res, next) {
  try {
    const { skillId } = req.params;
    const skill = await loadOwnedSkillOr403(skillId, req, res);
    if (!skill) return;

    const { published } = req.body;

    const quiz = await Quiz.findOne({ skillId });
    if (!quiz) {
      return res.status(400).json({ message: 'Create at least one question before publishing this quiz.' });
    }
    if (published && quiz.questions.length === 0) {
      return res.status(400).json({ message: 'Add at least one question before publishing this quiz.' });
    }

    quiz.published = Boolean(published);
    await quiz.save();

    res.json({ quiz: forManage(quiz) });
  } catch (err) {
    sendQuizError(res, err, next);
  }
}

// ---------------------------------------------------------------------------
// LEARNER-FACING — never expose correct answers before submission.
// ---------------------------------------------------------------------------

// GET /api/quiz/:skillId/status  (protected)
// Cheap existence check — lets the frontend decide whether to show a
// "Take Quiz" call-to-action once a learner finishes a course, without
// needing the full (lesson-completion-gated) quiz payload just to know
// whether one exists at all.
export async function getQuizStatus(req, res, next) {
  try {
    const { skillId } = req.params;
    const quiz = await Quiz.findOne({ skillId, published: true }, 'questionCount passingScore').lean();
    res.json({ published: Boolean(quiz), questionCount: quiz?.questionCount || 0, passingScore: quiz?.passingScore ?? 70 });
  } catch (err) {
    next(err);
  }
}

// GET /api/quiz/:skillId  (protected)
// Students must have finished every lesson in the course first; the
// skill's own mentor can always preview it (their draft/published quiz,
// via the /manage route, is the real editing surface — this route is kept
// consistent with the learner view for their own sanity-checking).
export async function getQuiz(req, res, next) {
  try {
    const { skillId } = req.params;
    const skill = await loadSkillOr404(skillId, res);
    if (!skill) return;

    const owner = isMentorOwner(skill, req.user) || req.user.isAdmin;

    if (!owner) {
      const progress = await Progress.findOne({ user: req.user._id, skillId });
      const lessonCount = skill.lessons?.length || 0;
      const complete = progress && lessonCount > 0 && progress.completedLessons.length >= lessonCount;
      if (!complete) {
        return res.status(403).json({ message: 'Finish every lesson in this course before taking the quiz.' });
      }
    }

    const quiz = await Quiz.findOne({ skillId, published: true });
    if (!quiz) {
      return res.status(404).json({ message: "This course's mentor hasn't published a quiz yet." });
    }

    const attempts = await listMyAttempts(req.user._id, skillId);
    const alreadyPassed = attempts.some((a) => a.passed);
    const certificate = alreadyPassed
      ? await Certificate.findOne({ user: req.user._id, skillId }).lean()
      : null;

    res.json({
      quiz: sanitizeForAttempt(quiz),
      attemptsTaken: attempts.length,
      bestScore: attempts.reduce((max, a) => Math.max(max, a.score), 0),
      alreadyPassed,
      certificateAlreadyIssued: Boolean(certificate)
    });
  } catch (err) {
    sendQuizError(res, err, next);
  }
}

// POST /api/quiz/:skillId/submit  { answers: [{ questionId, selectedOptionId }] }  (protected)
// Grades against the server-stored quiz only — the client never has the
// correct answers, so there's nothing here for a student to tamper with
// beyond which option they picked. Auto-issues a certificate on a pass,
// reusing the existing certificate system exactly as on lesson completion.
export async function submitQuiz(req, res, next) {
  try {
    const { skillId } = req.params;
    const { answers } = req.body;
    const skill = await loadSkillOr404(skillId, res);
    if (!skill) return;

    const quiz = await Quiz.findOne({ skillId, published: true });
    if (!quiz) {
      return res.status(400).json({ message: 'No published quiz for this course yet.' });
    }

    const validIds = new Set(quiz.questions.map((q) => q.id));
    const cleanAnswers = (Array.isArray(answers) ? answers : []).filter((a) => validIds.has(a?.questionId));

    const { results, score, total, correctCount, passed, passingScore } =
      await gradeAndRecordAttempt({ user: req.user, skill, quiz, answers: cleanAnswers });

    let certificate = null;
    if (passed) {
      const issued = await issueIfEarned(req.user, skillId);
      certificate = issued.certificate;
    }

    res.json({
      score, total, correctCount, passed, passingScore,
      results: results.map(({ questionId, correct, correctOptionId, explanation }) => ({
        questionId, correct, correctOptionId, explanation
      })),
      certificate
    });
  } catch (err) {
    sendQuizError(res, err, next);
  }
}
