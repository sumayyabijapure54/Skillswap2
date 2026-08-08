import crypto from 'crypto';
import Quiz from '../models/Quiz.js';
import QuizAttempt from '../models/QuizAttempt.js';
import * as aiService from '../lib/aiService.js';
import { extractJson } from '../utils/jsonExtract.js';
import { fetchTranscript } from '../utils/ytTranscript.js';

const MIN_QUESTIONS = 10;
const MAX_QUESTIONS = 20;
const DEFAULT_PASSING_SCORE = 70;
// How many times to ask the model again if it returns invalid JSON / an
// otherwise malformed quiz, before giving up with AI_QUIZ_GENERATION_FAILED.
// Never falls back to mock/placeholder questions — see parseQuizJson below.
const MAX_GENERATION_ATTEMPTS = 3;
// Below this, there isn't enough real course material to write a
// trustworthy quiz from — see hasEnoughContent().
const MIN_CONTENT_CHARS = 120;

const PLACEHOLDER_PATTERNS = [
  /\[mock\]/i,
  /\bmock ?ai\b/i,
  /\bplaceholder\b/i,
  /\blorem ipsum\b/i,
  /\btodo\b/i,
  /\bfill[- ]?in\b/i,
  /\bsample question\b/i
];

function aiUnavailableError() {
  const err = new Error('AI quiz generation is currently unavailable. Please try again later.');
  err.code = 'AI_QUIZ_UNAVAILABLE';
  err.status = 503;
  return err;
}

function generationFailedError() {
  const err = new Error('AI quiz generation failed after multiple attempts. Please try again later.');
  err.code = 'AI_QUIZ_GENERATION_FAILED';
  err.status = 502;
  return err;
}

function insufficientContentError() {
  const err = new Error("This course does not contain enough content yet to generate a reliable quiz. Ask the mentor to add lesson notes, a description, or a video.");
  err.code = 'AI_QUIZ_INSUFFICIENT_CONTENT';
  err.status = 400;
  return err;
}

// Rough gate on "is there enough real material here to test", independent
// of whether transcript extraction succeeded — a course can still have a
// good quiz built from title + description + lesson titles alone.
function hasEnoughContent(skill, transcriptsByLessonTitle) {
  const transcriptChars = Object.values(transcriptsByLessonTitle).join(' ').length;
  const lessonChars = (skill.lessons || [])
    .map((l) => `${l.title} ${l.description || ''} ${(l.youtube?.chapters || []).map((c) => c.title).join(' ')}`)
    .join(' ').length;
  const baseChars = `${skill.title || ''} ${skill.description || ''}`.length + lessonChars;
  return baseChars + transcriptChars >= MIN_CONTENT_CHARS;
}

// Every video-lesson's own mentor-provided YouTube video, in course order.
function videoLessons(skill) {
  return (skill.lessons || []).filter((l) => l.type === 'Video' && l.youtube?.videoId);
}

// Ties a generated quiz to the exact course content it was built from —
// title, description, and every lesson's title + linked video id. Used to
// decide whether an existing quiz is still valid or the course content has
// moved on since it was generated (see getOrGenerateQuiz below).
export function contentFingerprint(skill) {
  const parts = [
    skill.title || '',
    skill.description || '',
    ...(skill.lessons || []).map((l) => {
      const chapterKey = (l.youtube?.chapters || []).map((c) => c.title).join(',');
      return `${l.title}:${l.description || ''}:${l.youtube?.videoId || ''}:${chapterKey}`;
    })
  ];
  return crypto.createHash('sha256').update(parts.join('|')).digest('hex');
}

function buildQuizPrompt(skill, transcriptsByLessonTitle) {
  const lessons = skill.lessons || [];
  const lessonLines = lessons.length
    ? lessons.map((l, i) => {
        if (l.type === 'Quiz') return `${i + 1}. [Checkpoint quiz] ${l.title}`;
        const v = l.youtube;
        const chapterList = v?.chapters?.length
          ? `\n   Chapters: ${v.chapters.map((c) => c.title).join(' | ')}`
          : '';
        const notes = l.description?.trim() ? `\n   Mentor notes: ${l.description.trim()}` : '';
        return `${i + 1}. ${l.title} (${l.duration || 'unknown length'})${v ? ` — video: "${v.title}" (channel: ${v.channelTitle || 'unknown'})` : ''}${chapterList}${notes}`;
      }).join('\n')
    : '(no lesson list available)';

  const transcriptBlock = Object.keys(transcriptsByLessonTitle).length
    ? `\nLESSON VIDEO TRANSCRIPTS (use these as the primary source of truth for facts/terminology):\n${
        Object.entries(transcriptsByLessonTitle)
          .map(([lessonTitle, text]) => `--- ${lessonTitle} ---\n${text}`)
          .join('\n\n')
      }`
    : '\n(No transcripts could be retrieved for these videos — rely on the title, description, and lesson list instead. Do not invent specific facts, numbers, or code that weren\'t implied by them.)';

  const userContent = `Course title: ${skill.title}

Course description: ${skill.description}

Lessons (in order):
${lessonLines}
${transcriptBlock}

Generate the quiz now, following the schema and rules exactly. Cover the full curriculum, not just the first lesson.`;

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

// Thrown internally to signal "the output was invalid, worth retrying" —
// caught and retried by generateQuiz below, never surfaced to the user
// directly and never papered over with placeholder questions.
class QuizValidationError extends Error {}

function isPlaceholderText(text) {
  return PLACEHOLDER_PATTERNS.some((re) => re.test(text));
}

// Validates + normalizes the raw AI JSON into our storage shape. Throws
// QuizValidationError (retryable, see generateQuiz) on ANY of:
//   - invalid/unparsable JSON
//   - fewer than MIN_QUESTIONS usable questions after cleaning
//   - "[MOCK]"/placeholder text anywhere in a question, option, or explanation
//   - duplicate questions (case/whitespace-insensitive)
//   - duplicate options within a single question
// Malformed *individual* questions (wrong option count, no matching
// correct answer, empty text) are dropped rather than failing the whole
// batch, as long as enough valid ones remain — mirrors the original
// behavior, just with more checks.
export function parseQuizJson(raw) {
  const parsed = extractJson(raw);
  const questions = Array.isArray(parsed?.questions) ? parsed.questions : null;
  if (!questions || questions.length === 0) {
    throw new QuizValidationError('The AI returned a quiz in an unexpected format.');
  }

  const seenQuestionKeys = new Set();
  const cleaned = [];

  questions.slice(0, MAX_QUESTIONS).forEach((q, qi) => {
    if (typeof q.question !== 'string' || !q.question.trim()) return;
    const questionText = q.question.trim();
    if (isPlaceholderText(questionText)) return;

    const rawOptions = Array.isArray(q.options) ? q.options.filter((o) => typeof o === 'string' && o.trim()) : [];
    if (rawOptions.length !== 4) return; // skip malformed questions rather than fail the whole quiz
    const trimmedOptions = rawOptions.map((o) => o.trim());
    if (trimmedOptions.some(isPlaceholderText)) return;

    // No duplicate options within a question (case-insensitive).
    const optionKeySet = new Set(trimmedOptions.map((o) => o.toLowerCase()));
    if (optionKeySet.size !== trimmedOptions.length) return;

    const correctIdx = trimmedOptions.findIndex((o) => o === String(q.correctAnswer || '').trim());
    if (correctIdx === -1) return;

    // No duplicate questions across the quiz (case/whitespace-insensitive).
    const dedupeKey = questionText.toLowerCase().replace(/\s+/g, ' ');
    if (seenQuestionKeys.has(dedupeKey)) return;
    seenQuestionKeys.add(dedupeKey);

    const explanation = typeof q.explanation === 'string' ? q.explanation.trim() : '';
    if (!explanation || isPlaceholderText(explanation)) return;

    const qId = `q${cleaned.length + 1}`;
    cleaned.push({
      id: qId,
      question: questionText,
      options: trimmedOptions.map((text, oi) => ({ id: `${qId}o${oi + 1}`, text })),
      correctOptionId: `${qId}o${correctIdx + 1}`,
      explanation,
      difficulty: ['easy', 'medium', 'hard'].includes(q.difficulty) ? q.difficulty : 'medium'
    });
  });

  if (cleaned.length < MIN_QUESTIONS) {
    throw new QuizValidationError('The AI did not return enough valid, unique questions.');
  }

  return cleaned;
}

// Caps how many of the course's own lesson videos we pull transcripts for —
// enough to ground the quiz in real content across the curriculum without
// the combined prompt growing unbounded on long courses.
const MAX_TRANSCRIPT_LESSONS = 6;

// Generates a fresh quiz from the skill's current content and upserts it
// in place (one quiz document per course — see Quiz.skillId unique index).
// Pulls a best-effort transcript from each of the mentor's own lesson
// videos (never a substitute video) to ground the questions.
export async function generateQuiz(skill) {
  const lessonsWithVideo = videoLessons(skill).slice(0, MAX_TRANSCRIPT_LESSONS);
  const transcriptEntries = await Promise.all(
    lessonsWithVideo.map(async (l) => [l.title, await fetchTranscript(l.youtube.videoId)])
  );
  const transcriptsByLessonTitle = Object.fromEntries(
    transcriptEntries.filter(([, text]) => Boolean(text))
  );

  if (!hasEnoughContent(skill, transcriptsByLessonTitle)) {
    throw insufficientContentError();
  }

  const { system, messages } = buildQuizPrompt(skill, transcriptsByLessonTitle);

  let questions = null;
  let lastValidationError = null;
  for (let attempt = 1; attempt <= MAX_GENERATION_ATTEMPTS; attempt += 1) {
    let raw;
    try {
      raw = await aiService.generateQuiz({ system, messages, maxTokens: 4000 });
    } catch (err) {
      // The provider itself is down/misconfigured — not a validation
      // problem, and retrying won't help, so fail immediately with the
      // dedicated AI_QUIZ_UNAVAILABLE code rather than mock content.
      if (err?.code === 'AI_UNAVAILABLE') throw aiUnavailableError();
      throw err;
    }

    try {
      questions = parseQuizJson(raw);
      break;
    } catch (err) {
      lastValidationError = err;
      questions = null;
    }
  }

  if (!questions) {
    console.error('[aiQuizService] quiz generation validation failed after retries:', lastValidationError?.message);
    throw generationFailedError();
  }

  const firstVideoLesson = videoLessons(skill)[0];
  const quiz = await Quiz.findOneAndUpdate(
    { skillId: skill.id },
    {
      skillId: skill.id,
      generatedBy: 'AI',
      questions,
      passingScore: DEFAULT_PASSING_SCORE,
      sourceVideoId: firstVideoLesson?.youtube?.videoId || null,
      contentFingerprint: contentFingerprint(skill),
      model: aiService.config.OLLAMA_MODEL || null,
      generatedAt: new Date(),
      questionCount: questions.length
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
