// Thin wrapper around Anthropic's Messages API (https://docs.claude.com/en/api/messages).
// Mirrors the style of razorpayClient.js — warn once at boot if the key is
// missing rather than crashing the whole server, since every other route
// should keep working even if the AI Mentor can't.
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_VERSION = '2023-06-01';

// claude-sonnet-4-6: current-generation Sonnet — strong reasoning/coding
// help at a cost point sane for a per-message chat feature. Swap this one
// string if Anthropic ships a newer default you'd rather use.
const MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-6';

if (!process.env.ANTHROPIC_API_KEY) {
  console.warn('[anthropic] ANTHROPIC_API_KEY is not set — the AI Mentor chatbot will return an error until it is.');
}

/**
 * @param {Object} params
 * @param {string} params.system - system prompt
 * @param {{role: 'user'|'assistant', content: string}[]} params.messages - conversation so far, ending in the newest user turn
 * @param {number} [params.maxTokens]
 * @returns {Promise<string>} the assistant's reply text
 */
export async function askClaude({ system, messages, maxTokens = 1024 }) {
  if (!process.env.ANTHROPIC_API_KEY) {
    const err = new Error('AI Mentor is not configured yet — ask an admin to set ANTHROPIC_API_KEY on the server.');
    err.status = 503;
    throw err;
  }

  const res = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': ANTHROPIC_VERSION
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: maxTokens,
      system,
      messages
    })
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    console.error('[anthropic] request failed', res.status, body);
    const err = new Error('The AI Mentor is temporarily unavailable — please try again in a moment.');
    err.status = 502;
    throw err;
  }

  const data = await res.json();
  const text = (data.content || [])
    .filter((block) => block.type === 'text')
    .map((block) => block.text)
    .join('\n')
    .trim();

  if (!text) {
    const err = new Error('The AI Mentor returned an empty response — please try again.');
    err.status = 502;
    throw err;
  }

  return text;
}
