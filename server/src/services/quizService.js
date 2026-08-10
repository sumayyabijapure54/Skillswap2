import Quiz from '../models/Quiz.js';
import QuizAttempt from '../models/QuizAttempt.js';

// Mirrors the shape check the old AI pipeline enforced (parseQuizJson in
// the removed aiQuizService.js) — kept here so a mentor-submitted question
// gets exactly the same validation an AI-generated one used to, just
// checked against human input instead of model output.
export function validateQuestionInput(q, index) {
  const where = `Question ${index + 1}`;
  if (typeof q?.question !== 'string' || !q.question.trim()) {
    throw badInput(`${where}: question text is required.`);
  }
  const options = Array.isArray(q.options) ? q.options : [];
  if (options.length !== 4) {
    throw badInput(`${where}: exactly 4 options are required.`);
  }
  const trimmed = options.map((o) => String(o ?? '').trim());
  if (trimmed.some((o) => !o)) {
    throw badInput(`${where}: all 4 options must have text.`);
  }
  const dedupe = new Set(trimmed.map((o) => o.toLowerCase()));
  if (dedupe.size !== trimmed.length) {
    throw badInput(`${where}: options must not duplicate each other.`);
  }
  const correctIndex = Number(q.correctOptionIndex);
  if (!Number.isInteger(correctIndex) || correctIndex < 0 || correctIndex > 3) {
    throw badInput(`${where}: pick which option (0-3) is correct.`);
  }
  return {
    question: q.question.trim(),
    options: trimmed,
    correctOptionIndex: correctIndex,
    explanation: typeof q.explanation === 'string' ? q.explanation.trim() : ''
  };
}

function badInput(message) {
  const err = new Error(message);
  err.code = 'QUIZ_INVALID_INPUT';
  err.status = 400;
  return err;
}

// Converts validated mentor input ({ question, options[4], correctOptionIndex,
// explanation }) into the stored shape (stable per-option ids, so grading
// and shuffling work the same way the old AI-authored quizzes did).
export function toStoredQuestions(rawQuestions) {
  return rawQuestions.map((raw, i) => {
    const clean = validateQuestionInput(raw, i);
    const qId = `q${i + 1}`;
    return {
      id: qId,
      question: clean.question,
      options: clean.options.map((text, oi) => ({ id: `${qId}o${oi + 1}`, text })),
      correctOptionId: `${qId}o${clean.correctOptionIndex + 1}`,
      explanation: clean.explanation
    };
  });
}

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Strips correct-answer data before sending a quiz to a student, and
// randomizes question order + option order per request (grading is done by
// stable option ids, so shuffled order never affects correctness).
export function sanitizeForAttempt(quiz) {
  return {
    skillId: quiz.skillId,
    passingScore: quiz.passingScore,
    questionCount: quiz.questions.length,
    questions: shuffle(quiz.questions).map((q) => ({
      id: q.id,
      question: q.question,
      options: shuffle(q.options).map((o) => ({ id: o.id, text: o.text }))
    }))
  };
}

// The full quiz, correct answers included — for the owning mentor to edit
// or preview before publishing. Never used on any learner-facing route.
export function forManage(quiz) {
  return {
    skillId: quiz.skillId,
    passingScore: quiz.passingScore,
    published: quiz.published,
    updatedAt: quiz.updatedAt,
    questions: quiz.questions.map((q) => ({
      id: q.id,
      question: q.question,
      options: q.options.map((o) => o.text),
      correctOptionIndex: q.options.findIndex((o) => o.id === q.correctOptionId),
      explanation: q.explanation
    }))
  };
}

// answers: [{ questionId, selectedOptionId }]
export async function gradeAndRecordAttempt({ user, skill, quiz, answers }) {
  const answerMap = new Map((answers || []).map((a) => [a.questionId, a.selectedOptionId]));

  const results = quiz.questions.map((q) => {
    const selectedOptionId = answerMap.get(q.id) ?? null;
    const correct = selectedOptionId === q.correctOptionId;
    return {
      questionId: q.id,
      selectedOptionId,
      correct,
      correctOptionId: q.correctOptionId,
      explanation: q.explanation
    };
  });

  const correctCount = results.filter((r) => r.correct).length;
  const total = quiz.questions.length;
  const score = total > 0 ? Math.round((correctCount / total) * 100) : 0;
  const passed = score >= quiz.passingScore;

  const attempt = await QuizAttempt.create({
    user: user._id,
    skillId: skill.id,
    answers: results.map(({ questionId, selectedOptionId, correct }) => ({ questionId, selectedOptionId, correct })),
    score,
    total,
    correctCount,
    passed
  });

  return { attempt, results, score, total, correctCount, passed, passingScore: quiz.passingScore };
}

export async function hasPassedQuiz(userId, skillId) {
  const attempt = await QuizAttempt.findOne({ user: userId, skillId, passed: true });
  return Boolean(attempt);
}

export async function listMyAttempts(userId, skillId) {
  return QuizAttempt.find({ user: userId, skillId }).sort({ completedAt: -1 }).lean();
}

export async function getPublishedQuiz(skillId) {
  return Quiz.findOne({ skillId, published: true });
}
