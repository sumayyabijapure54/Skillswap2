import crypto from 'crypto';
import Quiz from '../models/Quiz.js';
import QuizAttempt from '../models/QuizAttempt.js';
import { askClaude } from '../lib/anthropicClient.js';
import { fetchTranscript } from '../utils/ytTranscript.js';

const MIN_QUESTIONS = 10;
const MAX_QUESTIONS = 20;
const DEFAULT_PASSING_SCORE = 70;

// Ties a generated quiz to the exact course content it was built from —
// title, description, linked video, and chapter/lesson titles. Used to
// decide whether an existing quiz is still valid or the course content has
// moved on since it was generated (see getOrGenerateQuiz below).
export function contentFingerprint(skill) {
  const parts = [
    skill.title || '',
    skill.description || '',
    skill.youtubeVideo?.videoId || '',
    ...(skill.lessons || []).map((l) => l.title)
  ];
  return crypto.createHash('sha256').update(parts.join('|')).digest('hex');
}

function buildQuizPrompt(skill, transcript) {
  const chapterTitles = (skill.lessons || [])
    .filter((l) => l.type === 'Video')
    .map((l, i) => `${i + 1}. ${l.title} (${l.duration})`)
    .join('\n') || '(no chapter list available)';

  const video = skill.youtubeVideo;
  const videoBlock = video
    ? `Linked course video: "${video.title}" (channel: ${video.channelTitle || 'unknown'}, duration: ${video.duration || 'unknown'})`
    : 'No mentor-linked video — base the quiz on the course title, description, and chapter list only.';

  const transcriptBlock = transcript
    ? `\nVIDEO TRANSCRIPT (use this as the primary source of truth for facts/terminology):\n${transcript}`
    : '\n(No transcript could be retrieved for this video — rely on the title, description, and chapter titles instead. Do not invent specific facts, numbers, or code that weren\'t implied by them.)';

  const userContent = `Course title: ${skill.title}

Course description: ${skill.description}

${videoBlock}

Chapter/lesson titles:
${chapterTitles}
${transcriptBlock}

Generate the quiz now, following the schema and rules exactly.`;

  const system = `You are an assessment generator for the SkillSwap learning platform. Your ONLY job is to write a multiple-choice quiz that tests understanding of the specific course content provided below — never general trivia, never facts unrelated to this course.

Rules:
- Produce between ${MIN_QUESTIONS} and ${MAX_QUESTIONS} questions total.
- Every question has EXACTLY 4 answer options and EXACTLY ONE correct answer.
- Mix difficulty across the quiz: include some easy, some medium, some hard questions (tag each with "difficulty").
- Every question must include a short (1-2 sentence) explanation of why the correct answer is correct.
- No duplicate or near-duplicate questions.
- Base every question only on the course title, description, chapter titles, and transcript given to you — if the transcript is missing, stay at a level those other fields actually support instead of inventing specifics.
- Respond with ONLY valid JSON — no markdown code fences, no commentary before or after — matching exactly this shape:
{"questions":[{"question":"string","options":["string","string","string","string"],"correctAnswer":"string, must exactly match one of the 4 options","explanation":"string","difficulty":"easy"|"medium"|"hard"}]}`;

  return { system, messages: [{ role: 'user', content: userContent }] };
}

function parseQuizJson(raw) {
  let parsed;
  try {
    parsed = JSON.parse(raw.replace(/^```json\s*|^```\s*|\s*```$/g, '').trim());
  } catch {
    const err = new Error('The AI returned a quiz in an unexpected format — please try regenerating.');
    err.status = 502;
    throw err;
  }

  const questions = Array.isArray(parsed?.questions) ? parsed.questions : null;
  if (!questions || questions.length < MIN_QUESTIONS) {
    const err = new Error('The AI did not return enough valid questions — please try regenerating.');
    err.status = 502;
    throw err;
  }

  const cleaned = [];
  questions.slice(0, MAX_QUESTIONS).forEach((q, qi) => {
    const options = Array.isArray(q.options) ? q.options.filter((o) => typeof o === 'string' && o.trim()) : [];
    if (options.length !== 4) return; // skip malformed questions rather than fail the whole quiz
    const correctIdx = options.findIndex((o) => o.trim() === String(q.correctAnswer || '').trim());
    if (correctIdx === -1) return;
    if (typeof q.question !== 'string' || !q.question.trim()) return;

    const qId = `q${qi + 1}`;
    cleaned.push({
      id: qId,
      question: q.question.trim(),
      options: options.map((text, oi) => ({ id: `${qId}o${oi + 1}`, text: text.trim() })),
      correctOptionId: `${qId}o${correctIdx + 1}`,
      explanation: typeof q.explanation === 'string' ? q.explanation.trim() : '',
      difficulty: ['easy', 'medium', 'hard'].includes(q.difficulty) ? q.difficulty : 'medium'
    });
  });

  if (cleaned.length < MIN_QUESTIONS) {
    const err = new Error('The AI did not return enough valid questions — please try regenerating.');
    err.status = 502;
    throw err;
  }

  return cleaned;
}

// Generates a fresh quiz from the skill's current content and upserts it
// in place (one quiz document per course — see Quiz.skillId unique index).
export async function generateQuiz(skill) {
  const transcript = skill.youtubeVideo?.videoId
    ? await fetchTranscript(skill.youtubeVideo.videoId)
    : null;

  const { system, messages } = buildQuizPrompt(skill, transcript);
  const raw = await askClaude({ system, messages, maxTokens: 4000 });
  const questions = parseQuizJson(raw);

  const quiz = await Quiz.findOneAndUpdate(
    { skillId: skill.id },
    {
      skillId: skill.id,
      generatedBy: 'AI',
      questions,
      passingScore: DEFAULT_PASSING_SCORE,
      sourceVideoId: skill.youtubeVideo?.videoId || null,
      contentFingerprint: contentFingerprint(skill)
    },
    { new: true, upsert: true }
  );

  return quiz;
}

// The core cache: reuse the stored quiz unless it doesn't exist yet, or the
// course content has changed since it was generated. Never calls the AI on
// a plain page load when a valid quiz is already on file.
export async function getOrGenerateQuiz(skill) {
  const existing = await Quiz.findOne({ skillId: skill.id });
  if (existing && existing.contentFingerprint === contentFingerprint(skill)) {
    return existing;
  }
  return generateQuiz(skill);
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
      difficulty: q.difficulty,
      options: shuffle(q.options).map((o) => ({ id: o.id, text: o.text }))
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
