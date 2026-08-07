import Skill from '../models/Skill.js';
import Quiz from '../models/Quiz.js';
import Progress from '../models/Progress.js';
import Certificate from '../models/Certificate.js';
import {
  getOrGenerateQuiz, generateQuiz, sanitizeForAttempt,
  gradeAndRecordAttempt, listMyAttempts
} from '../services/aiQuizService.js';
import { issueIfEarned } from './certificatesController.js';

function isMentorOwner(skill, user) {
  return Boolean(skill.mentorUser) && skill.mentorUser.toString() === user._id.toString();
}

async function loadSkillOr404(skillId, res) {
  const skill = await Skill.findOne({ id: skillId });
  if (!skill) {
    res.status(404).json({ message: 'Course not found' });
    return null;
  }
  if (!skill.youtubeVideo && !skill.lessons?.length) {
    res.status(400).json({ message: 'This course has no content yet to generate a quiz from.' });
    return null;
  }
  return skill;
}

// GET /api/quiz/:skillId  (protected)
// Starts/resumes a quiz attempt: generates the quiz once (cached — see
// aiQuizService.getOrGenerateQuiz) and returns it with correct answers and
// explanations stripped out, question + option order randomized. Students
// must have finished every lesson in the course first; the skill's mentor
// (or an admin) can always preview it to sanity-check the AI's output.
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

    const quiz = await getOrGenerateQuiz(skill);
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
    if (err.status) return res.status(err.status).json({ message: err.message });
    next(err);
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

    const quiz = await Quiz.findOne({ skillId });
    if (!quiz) {
      return res.status(400).json({ message: 'No quiz has been generated for this course yet — open the quiz first.' });
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
    if (err.status) return res.status(err.status).json({ message: err.message });
    next(err);
  }
}

// POST /api/quiz/:skillId/regenerate  (protected — the course's mentor or an admin only)
// Forces a fresh AI generation even if the cached quiz's content
// fingerprint still matches — e.g. the mentor just isn't happy with the
// question quality and wants another pass.
export async function regenerateQuiz(req, res, next) {
  try {
    const { skillId } = req.params;
    const skill = await loadSkillOr404(skillId, res);
    if (!skill) return;

    if (!isMentorOwner(skill, req.user) && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Only this course\'s mentor can regenerate its quiz.' });
    }

    const quiz = await generateQuiz(skill);
    res.status(201).json({ quiz: sanitizeForAttempt(quiz) });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ message: err.message });
    next(err);
  }
}
