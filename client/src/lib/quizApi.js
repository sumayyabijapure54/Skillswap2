import { api } from './api.js';

// --- Learner-facing ---

// GET /api/quiz/:skillId/status — cheap existence check, used by
// LessonPlayer to decide whether to show a "Take Quiz" CTA once a course
// is finished, without pulling the full (lesson-completion-gated) quiz.
export function fetchQuizStatus(skillId) {
  return api.get(`/api/quiz/${skillId}/status`);
}

// GET /api/quiz/:skillId — the published quiz, correct answers stripped.
export function fetchCourseQuiz(skillId) {
  return api.get(`/api/quiz/${skillId}`);
}

// POST /api/quiz/:skillId/submit — grades server-side, auto-issues a
// certificate on a pass. answers: [{ questionId, selectedOptionId }]
export function submitCourseQuiz(skillId, answers) {
  return api.post(`/api/quiz/${skillId}/submit`, { answers });
}

// --- Mentor management (owning mentor only) ---

// GET /api/quiz/:skillId/manage — full quiz including correct answers,
// or { quiz: null } if this course doesn't have one yet.
export function fetchQuizForManage(skillId) {
  return api.get(`/api/quiz/${skillId}/manage`);
}

// PUT /api/quiz/:skillId — create or fully replace this course's quiz
// questions. { questions: [{ question, options[4], correctOptionIndex, explanation }], passingScore }
export function saveQuiz(skillId, { questions, passingScore }) {
  return api.put(`/api/quiz/${skillId}`, { questions, passingScore });
}

// PATCH /api/quiz/:skillId/publish — { published: boolean }
export function setQuizPublished(skillId, published) {
  return api.patch(`/api/quiz/${skillId}/publish`, { published });
}
