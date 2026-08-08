import { describe, it, expect } from 'vitest';
import { parseQuizJson } from '../src/services/aiQuizService.js';

function makeQuestion(i, overrides = {}) {
  return {
    question: `What does self-attention allow a transformer layer to do, question ${i}?`,
    options: [
      'Weigh every other token when computing a token\'s representation',
      'Store weights permanently across training runs',
      'Compress images before tokenization',
      'Replace the need for an optimizer'
    ],
    correctAnswer: 'Weigh every other token when computing a token\'s representation',
    explanation: 'Self-attention lets each position attend to (weigh) every other position in the sequence.',
    difficulty: 'medium',
    ...overrides
  };
}

function validQuizJson(count = 10) {
  return JSON.stringify({
    questions: Array.from({ length: count }, (_, i) => makeQuestion(i + 1))
  });
}

describe('parseQuizJson', () => {
  it('accepts a well-formed quiz with enough unique questions', () => {
    const cleaned = parseQuizJson(validQuizJson(10));
    expect(cleaned.length).toBe(10);
    expect(cleaned[0]).toHaveProperty('correctOptionId');
    expect(cleaned[0].options).toHaveLength(4);
  });

  it('strips ```json fences before parsing', () => {
    const fenced = '```json\n' + validQuizJson(10) + '\n```';
    const cleaned = parseQuizJson(fenced);
    expect(cleaned.length).toBe(10);
  });

  it('rejects output containing [MOCK] anywhere in a question', () => {
    const bad = JSON.stringify({
      questions: [
        makeQuestion(1, { question: '[MOCK] Which statement best describes this topic?' }),
        ...Array.from({ length: 9 }, (_, i) => makeQuestion(i + 2))
      ]
    });
    // The [MOCK] question is dropped, but 9 valid ones remain — still
    // below MIN_QUESTIONS(10), so the whole batch is rejected rather than
    // silently shipping 9. This proves [MOCK] content never survives.
    expect(() => parseQuizJson(bad)).toThrow();
  });

  it('rejects a quiz with duplicate questions', () => {
    const dup = JSON.stringify({
      questions: Array.from({ length: 10 }, () => makeQuestion(1)) // identical question 10x
    });
    expect(() => parseQuizJson(dup)).toThrow();
  });

  it('rejects a quiz with fewer than 10 valid questions', () => {
    const tooFew = validQuizJson(5);
    expect(() => parseQuizJson(tooFew)).toThrow();
  });

  it('rejects invalid JSON entirely', () => {
    expect(() => parseQuizJson('not json at all')).toThrow();
  });

  it('drops a question with duplicate options while keeping the rest', () => {
    // 11 total, 1 malformed → 10 valid remain, still meeting MIN_QUESTIONS.
    const withDupOptions = JSON.stringify({
      questions: [
        makeQuestion(1, { options: ['Same', 'Same', 'Different', 'Other'], correctAnswer: 'Same' }),
        ...Array.from({ length: 10 }, (_, i) => makeQuestion(i + 2))
      ]
    });
    const cleaned = parseQuizJson(withDupOptions);
    expect(cleaned.length).toBe(10);
    expect(cleaned.every((q) => new Set(q.options.map((o) => o.text)).size === 4)).toBe(true);
  });
});
