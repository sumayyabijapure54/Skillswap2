// AI Mentor quick actions ("Quiz me", "Flashcards") ask the underlying
// model for bare JSON, but models are generally imprecise about that —
// they may wrap it in ```json fences, add a leading "Sure, here's the
// quiz:" sentence, or add trailing commentary. This helper makes JSON-mode
// callers (chatbotController's quiz/flashcards quick actions) resilient to
// that without silently displaying broken output to the user — see
// extractJson's docstring below.

/**
 * Attempts to parse `raw` as JSON. Tries, in order:
 *   1. The trimmed string as-is.
 *   2. The string with a leading/trailing ``` or ```json fence stripped.
 *   3. The substring between the first "{" and the last "}" in the text
 *      (handles a stray sentence before/after the JSON object).
 * Returns the parsed object, or null if none of the above produced valid
 * JSON. Callers MUST treat a null return as "the AI did not return usable
 * JSON" and surface a clear error — never fall back to fabricated content.
 */
export function extractJson(raw) {
  const text = String(raw || '').trim();
  if (!text) return null;

  const attempts = [
    text,
    text.replace(/^```json\s*|^```\s*|\s*```$/gi, '').trim()
  ];

  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    attempts.push(text.slice(firstBrace, lastBrace + 1));
  }

  for (const attempt of attempts) {
    try {
      return JSON.parse(attempt);
    } catch {
      // try the next strategy
    }
  }
  return null;
}
