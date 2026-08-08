import ChatSession from '../models/ChatSession.js';
import Progress from '../models/Progress.js';
import Skill from '../models/Skill.js';
import * as aiService from '../lib/aiService.js';
import { extractJson } from '../utils/jsonExtract.js';

// Sends the AI_UNAVAILABLE envelope the spec calls for, instead of letting
// the generic errorHandler's plain `{ message }` shape take over. Anything
// without an aiService-style `.code` still falls through to `next(err)`.
function sendAiError(res, err, next) {
  if (err?.code === 'AI_UNAVAILABLE') {
    return res.status(err.status || 503).json({
      success: false,
      code: 'AI_UNAVAILABLE',
      message: err.message || 'AI service is currently unavailable. Please try again later.'
    });
  }
  next(err);
}

// Only the last N turns ride along in every request — keeps latency/cost
// bounded on a long-running conversation while still giving Claude enough
// of the recent thread to stay coherent. The full transcript still lives
// in Mongo and is what GET /history returns.
const HISTORY_WINDOW = 16;
// Cap what's persisted per user so one very long-lived account can't grow
// its ChatSession document without bound.
const MAX_STORED_MESSAGES = 200;

function leanSession(doc) {
  return doc ? doc.toJSON() : { messages: [] };
}

async function getOrCreateSession(userId) {
  let session = await ChatSession.findOne({ user: userId });
  if (!session) session = await ChatSession.create({ user: userId, messages: [] });
  return session;
}

// Builds the "who is this learner" half of the system prompt: profile,
// enrolled skills + how far into each they are, and a short slice of the
// catalog so the model can make concrete (not made-up) recommendations.
async function buildLearnerProfile(user) {
  const [progress, catalog] = await Promise.all([
    Progress.find({ user: user._id }).lean(),
    Skill.find({}, 'id title category level rating tags').limit(120).lean()
  ]);

  const enrolledIds = progress.map((p) => p.skillId);
  const enrolledSkills = catalog.filter((s) => enrolledIds.includes(s.id));
  const catalogSummary = catalog
    .map((s) => `- ${s.title} [${s.id}] (${s.category}, ${s.level}, ★${s.rating})`)
    .join('\n');

  const progressSummary = progress
    .map((p) => {
      const skill = catalog.find((s) => s.id === p.skillId);
      const lessonCount = skill?.lessons?.length || null;
      return `- ${skill?.title || p.skillId}: ${p.completedLessons.length} lesson(s) completed${lessonCount ? ` of ~${lessonCount}` : ''}, enrolled ${new Date(p.enrolledAt).toLocaleDateString()}`;
    })
    .join('\n') || '(not enrolled in anything yet)';

  return `
LEARNER PROFILE
Name: ${user.name}
Role on platform: ${user.role || 'not set'} (learn = student, teach = mentor, both = both)
Stated goal pace: ${user.goal || 'not set'}
Interests: ${(user.interests || []).join(', ') || 'not set'}
Skills they offer to teach: ${(user.skillsOffered || []).join(', ') || 'none'}
Skills they want to learn: ${(user.skillsWanted || []).join(', ') || 'none'}

CURRENT PROGRESS
${progressSummary}

SKILL CATALOG (use ONLY these when recommending a specific skill by name — cite the [slug] so the app can link to it; never invent a skill that isn't in this list)
${catalogSummary || '(catalog is empty)'}
`.trim();
}

function buildContextBlock(context) {
  if (!context) return '';
  const parts = [];
  if (context.skillTitle) parts.push(`Skill: ${context.skillTitle}`);
  if (context.lessonTitle) parts.push(`Current lesson: ${context.lessonTitle}`);
  if (context.lessonTranscript) parts.push(`Lesson content/transcript excerpt:\n${context.lessonTranscript.slice(0, 4000)}`);
  if (context.codeSnippet) parts.push(`Code the learner is asking about:\n\`\`\`\n${context.codeSnippet.slice(0, 3000)}\n\`\`\``);
  if (context.errorMessage) parts.push(`Error message they hit:\n${context.errorMessage.slice(0, 1000)}`);
  if (parts.length === 0) return '';
  return `\n\nCURRENT SCREEN CONTEXT (the learner is looking at this right now — ground your answer in it when relevant)\n${parts.join('\n\n')}`;
}

const BASE_PERSONA = `You are the SkillSwap AI Learning Mentor — a warm, encouraging, genuinely knowledgeable tutor embedded in the SkillSwap platform (a peer skill-sharing and mentorship marketplace).

You can help with:
- Answering questions about whatever lesson/course the learner is currently viewing.
- Recommending skills, mentors, and next courses based on their goals and progress — only recommend skills that actually appear in the SKILL CATALOG below, and mention them as [Title](slug) so the app can link to them.
- General site help (how booking sessions, certificates, wallet, community posts work on SkillSwap).
- Generating quizzes, flashcards, summaries, and study plans on request.
- Debugging help: when someone shares code or an error, do NOT just hand them the fixed code. Ask a clarifying question or give a pointed hint first, and only give the full fix if they ask again or say they're stuck. Teach the "why", not just the "what".
- Remembering what this learner has told you earlier in the conversation and tailoring answers to their stated goal/pace/interests.

Style: concise, friendly, use short paragraphs or bullet points, avoid long unbroken walls of text. Never make up platform features, prices, or skills that aren't described in the context you're given — if you don't know, say so and suggest where on the site they could check (e.g. Help Center, their mentor).`;

function historyForClaude(messages) {
  return messages.slice(-HISTORY_WINDOW).map((m) => ({ role: m.role, content: m.content }));
}

async function appendAndTrim(session, entries) {
  session.messages.push(...entries);
  if (session.messages.length > MAX_STORED_MESSAGES) {
    session.messages = session.messages.slice(session.messages.length - MAX_STORED_MESSAGES);
  }
  await session.save();
}

// GET /api/chatbot/history (protected)
export async function getHistory(req, res, next) {
  try {
    const session = await ChatSession.findOne({ user: req.user._id });
    res.json(leanSession(session));
  } catch (err) {
    next(err);
  }
}

// DELETE /api/chatbot/history (protected) — "start a new conversation"
export async function clearHistory(req, res, next) {
  try {
    await ChatSession.findOneAndUpdate(
      { user: req.user._id },
      { $set: { messages: [] } },
      { upsert: true }
    );
    res.json({ messages: [] });
  } catch (err) {
    next(err);
  }
}

// POST /api/chatbot/message  { message, context? }  (protected)
export async function sendMessage(req, res, next) {
  try {
    const { message, context } = req.body;
    const session = await getOrCreateSession(req.user._id);

    const [profileBlock] = await Promise.all([buildLearnerProfile(req.user)]);
    const system = `${BASE_PERSONA}\n\n${profileBlock}${buildContextBlock(context)}`;

    const claudeMessages = [
      ...historyForClaude(session.messages),
      { role: 'user', content: message }
    ];

    const reply = await aiService.generateMentorResponse({ system, messages: claudeMessages, maxTokens: 900 });

    await appendAndTrim(session, [
      { role: 'user', content: message, kind: 'chat', context: context || null },
      { role: 'assistant', content: reply, kind: 'chat', context: null }
    ]);

    res.json({ reply, sessionUpdatedAt: session.updatedAt });
  } catch (err) {
    sendAiError(res, err, next);
  }
}

// Prompt builders for each quick action. Each returns { instruction, kind }.
const QUICK_ACTIONS = {
  quiz: (context) => ({
    kind: 'quiz',
    instruction: `Write a short 5-question multiple-choice quiz testing understanding of ${context?.lessonTitle ? `the lesson "${context.lessonTitle}"` : context?.skillTitle ? `the skill "${context.skillTitle}"` : 'what we\'ve been discussing in this conversation'}. Respond with ONLY valid JSON (no markdown fences, no commentary) in this exact shape: {"questions":[{"question":"...","options":["...","...","...","..."],"correctIndex":0,"explanation":"..."}]}`
  }),
  flashcards: (context) => ({
    kind: 'flashcards',
    instruction: `Create 8 flashcards (term/concept on the front, a concise explanation on the back) covering the key points of ${context?.lessonTitle ? `the lesson "${context.lessonTitle}"` : context?.skillTitle ? `the skill "${context.skillTitle}"` : 'what we\'ve been discussing in this conversation'}. Respond with ONLY valid JSON (no markdown fences, no commentary) in this exact shape: {"cards":[{"front":"...","back":"..."}]}`
  }),
  summary: (context) => ({
    kind: 'summary',
    instruction: `Summarize ${context?.lessonTitle ? `the lesson "${context.lessonTitle}"` : context?.skillTitle ? `the skill "${context.skillTitle}"` : 'what we\'ve been discussing'} in 4-6 concise bullet points a learner could skim to review before a quiz. Plain text/markdown bullets, no JSON.`
  }),
  'study-plan': (context) => ({
    kind: 'study-plan',
    instruction: `Based on my profile, current progress, and goal pace, build me a personalized week-by-week study plan${context?.skillTitle ? ` focused on getting through "${context.skillTitle}"` : ''}. Keep it to 3-6 weeks, plain markdown with a short heading per week and 2-4 bullet action items each.`
  }),
  hint: (context) => ({
    kind: 'hint',
    instruction: `I'm stuck${context?.errorMessage ? ` on this error: ${context.errorMessage}` : ''}${context?.codeSnippet ? ` in this code:\n\`\`\`\n${context.codeSnippet}\n\`\`\`` : ''}. Give me ONE pointed hint toward the fix — do NOT give me the full corrected code or the direct answer, just enough to get me thinking in the right direction.`
  })
};

// Which aiService wrapper backs each quick action — purely for readability
// at the call site; all of them funnel into the same free Ollama provider.
const QUICK_ACTION_AI_FN = {
  quiz: aiService.generateQuiz,
  flashcards: aiService.generateFlashcards,
  summary: aiService.summarizeContent,
  'study-plan': aiService.generateStudyPlan,
  hint: aiService.generateMentorResponse
};

// POST /api/chatbot/quick-action  { type: 'quiz'|'flashcards'|'summary'|'study-plan'|'hint', context? }  (protected)
export async function runQuickAction(req, res, next) {
  try {
    const { type, context } = req.body;
    const builder = QUICK_ACTIONS[type];
    if (!builder) return res.status(400).json({ message: `Unknown quick action "${type}"` });

    const { instruction, kind } = builder(context);
    const session = await getOrCreateSession(req.user._id);
    const profileBlock = await buildLearnerProfile(req.user);
    const system = `${BASE_PERSONA}\n\n${profileBlock}${buildContextBlock(context)}`;

    const claudeMessages = [
      ...historyForClaude(session.messages),
      { role: 'user', content: instruction }
    ];

    const aiCall = QUICK_ACTION_AI_FN[type] || aiService.generateMentorResponse;
    const raw = await aiCall({ system, messages: claudeMessages, maxTokens: 1400 });

    let parsed = null;
    if (kind === 'quiz' || kind === 'flashcards') {
      parsed = extractJson(raw);
      const looksValid = kind === 'quiz' ? Array.isArray(parsed?.questions) && parsed.questions.length > 0
        : Array.isArray(parsed?.cards) && parsed.cards.length > 0;
      if (!looksValid) {
        // Never show the model's raw JSON/near-JSON text to the user —
        // surface a clear, retryable error instead (see FIX RAW JSON IN
        // AI MENTOR requirement).
        const err = new Error('The AI Mentor could not generate that right now — please try again.');
        err.code = 'AI_UNAVAILABLE';
        err.status = 502;
        throw err;
      }
    }

    await appendAndTrim(session, [
      { role: 'user', content: `[Quick action: ${type}]`, kind, context: context || null },
      { role: 'assistant', content: raw, kind, context: null }
    ]);

    res.json({ kind, raw, data: parsed, sessionUpdatedAt: session.updatedAt });
  } catch (err) {
    sendAiError(res, err, next);
  }
}
