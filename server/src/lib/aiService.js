// ============================================================================
// aiService.js — the ONE shared AI provider hook for the whole app.
//
// The AI Learning Mentor (chatbotController.js) calls into this module
// instead of talking to any provider directly.
//
// No AI provider is configured here. This app previously ran on a
// locally-hosted Ollama model; that integration has been fully removed
// (see PROGRESS_NOTES.md) along with its env vars, network calls, and the
// AI-generated course quiz feature that also depended on it (course
// quizzes are now entirely mentor-authored — see
// server/src/services/quizService.js).
//
// The AI Learning Mentor chat feature still calls these functions, so
// every export below is kept with its original name/signature — but every
// one of them now throws immediately with `.code === 'AI_UNAVAILABLE'` and
// `.status === 503`, the exact same clean "unavailable" response the app
// already showed whenever Ollama happened to be unreachable. Nothing here
// fabricates a reply. To bring the AI Mentor back online, replace the body
// of `complete()` below with a real call to whichever provider you choose
// — every caller already only depends on this one function.
// ============================================================================

function unavailable(message) {
  const err = new Error(message);
  err.code = 'AI_UNAVAILABLE';
  err.status = 503;
  return err;
}

/**
 * True/false health check — does NOT throw. No provider is configured, so
 * this always reports unavailable.
 */
export async function isAvailable() {
  return false;
}

/**
 * Core primitive every named wrapper below funnels through. No provider is
 * configured — always throws AI_UNAVAILABLE rather than fabricating a
 * reply. Kept as the single place a real provider integration would plug
 * in later.
 */
export async function complete() {
  throw unavailable('AI service is currently unavailable. Please try again later.');
}

// ----------------------------------------------------------------------------
// Named, semantic wrappers over `complete()` — kept so chatbotController.js
// reads clearly and needs no changes. Each just inherits the same
// unavailable-until-configured behavior.
// ----------------------------------------------------------------------------

/** Freeform AI Mentor chat turn. */
export async function generateMentorResponse() {
  return complete();
}

/** Structured multiple-choice quiz JSON (AI Mentor's "Quiz me" quick action only — unrelated to the course quiz feature, which is mentor-authored). */
export async function generateQuiz() {
  return complete();
}

/** Structured flashcards JSON ({ cards: [{ front, back }] }). */
export async function generateFlashcards() {
  return complete();
}

/** Plain-text/markdown content summary. */
export async function summarizeContent() {
  return complete();
}

/** Plain-text/markdown multi-week study plan. */
export async function generateStudyPlan() {
  return complete();
}
