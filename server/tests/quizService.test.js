import { describe, it, expect } from 'vitest';
import { validateQuestionInput, toStoredQuestions, sanitizeForAttempt, forManage } from '../src/services/quizService.js';

function makeQuestion(overrides = {}) {
  return {
    question: 'What does self-attention allow a transformer layer to do?',
    options: [
      "Weigh every other token when computing a token's representation",
      'Store weights permanently across training runs',
      'Compress images before tokenization',
      'Replace the need for an optimizer'
    ],
    correctOptionIndex: 0,
    explanation: 'Self-attention lets each position attend to (weigh) every other position in the sequence.',
    ...overrides
  };
}

describe('validateQuestionInput', () => {
  it('accepts a well-formed mentor-authored question', () => {
    const clean = validateQuestionInput(makeQuestion(), 0);
    expect(clean.question).toContain('self-attention');
    expect(clean.options).toHaveLength(4);
    expect(clean.correctOptionIndex).toBe(0);
  });

  it('rejects a question with empty text', () => {
    expect(() => validateQuestionInput(makeQuestion({ question: '   ' }), 0)).toThrow(/question text/i);
  });

  it('rejects a question without exactly 4 options', () => {
    expect(() => validateQuestionInput(makeQuestion({ options: ['A', 'B', 'C'] }), 0)).toThrow(/4 options/i);
  });

  it('rejects a question with a blank option', () => {
    expect(() => validateQuestionInput(makeQuestion({ options: ['A', '', 'C', 'D'] }), 0)).toThrow(/text/i);
  });

  it('rejects duplicate options within the same question', () => {
    expect(() => validateQuestionInput(makeQuestion({ options: ['Same', 'Same', 'Diff', 'Other'] }), 0)).toThrow(/duplicate/i);
  });

  it('rejects a correctOptionIndex outside 0-3', () => {
    expect(() => validateQuestionInput(makeQuestion({ correctOptionIndex: 4 }), 0)).toThrow(/correct/i);
    expect(() => validateQuestionInput(makeQuestion({ correctOptionIndex: -1 }), 0)).toThrow(/correct/i);
  });

  it('treats explanation as optional, defaulting to an empty string', () => {
    const clean = validateQuestionInput(makeQuestion({ explanation: undefined }), 0);
    expect(clean.explanation).toBe('');
  });
});

describe('toStoredQuestions', () => {
  it('converts mentor input into stable-id storage shape', () => {
    const stored = toStoredQuestions([makeQuestion(), makeQuestion({ question: 'Second question?', correctOptionIndex: 2 })]);
    expect(stored).toHaveLength(2);
    expect(stored[0].id).toBe('q1');
    expect(stored[0].options).toHaveLength(4);
    expect(stored[0].options[0].id).toBe('q1o1');
    // correctOptionIndex 0 → the 1st option's id
    expect(stored[0].correctOptionId).toBe('q1o1');
    // Second question's correctOptionIndex 2 → the 3rd option's id
    expect(stored[1].correctOptionId).toBe('q2o3');
  });

  it('throws on the first invalid question, identifying its position', () => {
    expect(() => toStoredQuestions([makeQuestion(), makeQuestion({ options: ['A', 'B'] })])).toThrow(/Question 2/);
  });
});

describe('sanitizeForAttempt', () => {
  it('never includes correctOptionId or explanation anywhere in the output', () => {
    const stored = toStoredQuestions([makeQuestion()]);
    const sanitized = sanitizeForAttempt({ skillId: 'x', passingScore: 70, questions: stored });
    const serialized = JSON.stringify(sanitized);
    expect(serialized).not.toContain('correctOptionId');
    expect(serialized).not.toContain('explanation');
    expect(serialized).not.toContain(stored[0].explanation);
  });

  it('preserves every question and every option, just reordered', () => {
    const stored = toStoredQuestions([makeQuestion(), makeQuestion({ question: 'Q2?' })]);
    const sanitized = sanitizeForAttempt({ skillId: 'x', passingScore: 70, questions: stored });
    expect(sanitized.questions).toHaveLength(2);
    expect(sanitized.questions.every((q) => q.options.length === 4)).toBe(true);
  });
});

describe('forManage', () => {
  it('exposes the correct answer for the owning mentor to preview/edit', () => {
    const stored = toStoredQuestions([makeQuestion()]);
    const manage = forManage({ skillId: 'x', passingScore: 70, published: false, updatedAt: new Date(), questions: stored });
    expect(manage.questions[0].correctOptionIndex).toBe(0);
    expect(manage.questions[0].options[0]).toBe(stored[0].options[0].text);
  });
});
