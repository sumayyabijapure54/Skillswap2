// ============================================================================
// aiService.js — the ONE shared AI provider for the whole app.
//
// Both the AI Learning Mentor (chatbotController.js) and the Course AI Quiz
// (aiQuizService.js) call into this module instead of talking to any
// provider directly. It is backed by a locally-running, free, open-source
// LLM via Ollama (https://ollama.com) — no Anthropic/OpenAI/Gemini key,
// and no per-request cost.
//
// There is NO mock/fake/placeholder fallback in here. If Ollama isn't
// reachable or isn't configured, every exported function throws an error
// with `.code === 'AI_UNAVAILABLE'` and `.status === 503`. Callers must
// turn that into a clear API error for the user — never substitute
// fabricated content. See README / PROGRESS_NOTES for the full rationale.
//
// Configuration (server/.env):
//   OLLAMA_BASE_URL   — where Ollama is running. Defaults to
//                        http://localhost:11434 (Ollama's own default).
//   OLLAMA_MODEL      — which pulled model to use, e.g. "llama3.1:8b" or
//                        "qwen2.5:7b". Deliberately has NO hardcoded
//                        default here — a model name baked into the code
//                        might not exist on a given machine, and silently
//                        picking one would contradict "don't invent
//                        content" the same way a mock fallback would.
//                        If this is unset, every call fails fast with a
//                        clear config error instead of guessing.
// ============================================================================

const OLLAMA_BASE_URL = (process.env.OLLAMA_BASE_URL || 'http://localhost:11434').replace(/\/+$/, '');
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || '';
// Generous, but bounded — a 20-question quiz generation on modest hardware
// can legitimately take a while; we'd rather wait than time out and make
// the caller retry into an even longer queue.
const REQUEST_TIMEOUT_MS = Number(process.env.OLLAMA_TIMEOUT_MS) || 120_000;

let warnedMissingModel = false;

function unavailable(message) {
  const err = new Error(message);
  err.code = 'AI_UNAVAILABLE';
  err.status = 503;
  return err;
}

/**
 * True/false health check — does NOT throw. Used by callers that want to
 * fail fast with a friendly message before doing any other work (e.g. the
 * quiz route can check this before bothering to fetch transcripts).
 */
export async function isAvailable() {
  if (!OLLAMA_MODEL) return false;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(`${OLLAMA_BASE_URL}/api/tags`, { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) return false;
    const data = await res.json().catch(() => null);
    const models = Array.isArray(data?.models) ? data.models.map((m) => m.name) : [];
    // Accept either an exact match or a "family" match (user wrote
    // "llama3.1" but pulled "llama3.1:8b", etc.) rather than being overly
    // strict about tag suffixes.
    return models.some((name) => name === OLLAMA_MODEL || name.startsWith(`${OLLAMA_MODEL}:`) || OLLAMA_MODEL.startsWith(name));
  } catch {
    return false;
  }
}

/**
 * Core primitive: sends a system prompt + conversation to the local Ollama
 * model and returns the plain-text reply. This is the direct, drop-in
 * replacement for the old askClaude({ system, messages, maxTokens }).
 *
 * @param {Object} params
 * @param {string} params.system
 * @param {{role:'user'|'assistant', content:string}[]} params.messages
 * @param {number} [params.maxTokens]
 * @param {boolean} [params.json] - set true when the caller needs strict
 *   JSON back (quiz generation, flashcards, quiz-me). Uses Ollama's
 *   `format: "json"` constrained-decoding mode when available.
 * @returns {Promise<string>}
 */
export async function complete({ system, messages, maxTokens = 1024, json = false }) {
  if (!OLLAMA_MODEL) {
    if (!warnedMissingModel) {
      console.warn('[aiService] OLLAMA_MODEL is not set — AI features will return AI_UNAVAILABLE until it is configured. See server/.env.');
      warnedMissingModel = true;
    }
    throw unavailable('AI service is currently unavailable. Please try again later.');
  }

  const ollamaMessages = [
    ...(system ? [{ role: 'system', content: system }] : []),
    ...(messages || []).map((m) => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: String(m.content ?? '') }))
  ];

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let res;
  try {
    res = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        messages: ollamaMessages,
        stream: false,
        ...(json ? { format: 'json' } : {}),
        options: {
          num_predict: maxTokens,
          temperature: json ? 0.4 : 0.7
        }
      })
    });
  } catch (err) {
    console.error('[aiService] could not reach Ollama at', OLLAMA_BASE_URL, err.message);
    throw unavailable('AI service is currently unavailable. Please try again later.');
  } finally {
    clearTimeout(timer);
  }

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    console.error('[aiService] Ollama request failed', res.status, body);
    // A 404 here almost always means the model name isn't pulled yet —
    // still an availability problem from the caller's point of view, not
    // something to retry with fabricated content.
    throw unavailable('AI service is currently unavailable. Please try again later.');
  }

  const data = await res.json().catch(() => null);
  const text = data?.message?.content?.trim();

  if (!text) {
    throw unavailable('AI service is currently unavailable. Please try again later.');
  }

  return text;
}

// ----------------------------------------------------------------------------
// Named, semantic wrappers over `complete()`. These exist so callers read
// clearly ("aiService.generateFlashcards(...)" instead of a bare generic
// call) even though — deliberately — there's only one underlying provider
// call. Each quick-action/feature in chatbotController.js and the course
// quiz in aiQuizService.js still builds its own system/user prompt (the
// domain knowledge of *what* to ask lives with the caller); this module's
// job is only *how* that prompt reaches a real, free model and comes back.
// ----------------------------------------------------------------------------

/** Freeform AI Mentor chat turn. */
export async function generateMentorResponse({ system, messages, maxTokens }) {
  return complete({ system, messages, maxTokens, json: false });
}

/**
 * Structured multiple-choice quiz JSON. Used by both the chatbot's
 * "Quiz me" quick action and the full course AI Quiz (aiQuizService.js) —
 * each passes its own schema-specific system prompt.
 */
export async function generateQuiz({ system, messages, maxTokens }) {
  return complete({ system, messages, maxTokens, json: true });
}

/** Structured flashcards JSON ({ cards: [{ front, back }] }). */
export async function generateFlashcards({ system, messages, maxTokens }) {
  return complete({ system, messages, maxTokens, json: true });
}

/** Plain-text/markdown content summary. */
export async function summarizeContent({ system, messages, maxTokens }) {
  return complete({ system, messages, maxTokens, json: false });
}

/** Plain-text/markdown multi-week study plan. */
export async function generateStudyPlan({ system, messages, maxTokens }) {
  return complete({ system, messages, maxTokens, json: false });
}

export const config = { OLLAMA_BASE_URL, OLLAMA_MODEL };
