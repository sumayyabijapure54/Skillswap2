import { api } from './api.js';

// GET /api/quiz/:skillId — generates the AI quiz once and caches it
// server-side; safe to call every time the quiz page mounts.
export function fetchCourseQuiz(skillId) {
  return api.get(`/api/quiz/${skillId}`);
}

// POST /api/quiz/:skillId/submit — grades server-side, auto-issues a
// certificate on a pass. answers: [{ questionId, selectedOptionId }]
export function submitCourseQuiz(skillId, answers) {
  return api.post(`/api/quiz/${skillId}/submit`, { answers });
}

// POST /api/quiz/:skillId/regenerate — mentor/admin only.
export function regenerateCourseQuiz(skillId) {
  return api.post(`/api/quiz/${skillId}/regenerate`, {});
}
