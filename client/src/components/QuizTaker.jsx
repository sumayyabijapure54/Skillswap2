import React from 'react';

// `quiz` is the sanitized shape from GET /api/quiz/:skillId — no correct
// answers included. `onSubmit(answers)` should POST to /submit and resolve
// with the graded result ({ score, total, passed, results, certificate }).
// `onRetake()` re-fetches a fresh (re-shuffled) attempt of the same quiz.
export default function QuizTaker({ quiz, onSubmit, onRetake, submitting }) {
  const [idx, setIdx] = React.useState(0);
  const [answers, setAnswers] = React.useState({}); // questionId -> selectedOptionId
  const [result, setResult] = React.useState(null); // graded response, once submitted
  const [error, setError] = React.useState(null);

  const questions = quiz.questions;
  const q = questions[idx];
  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === questions.length;
  const progressPct = Math.round(((idx + (answers[q?.id] ? 1 : 0)) / questions.length) * 100);

  const pick = (optionId) => {
    setAnswers((prev) => ({ ...prev, [q.id]: optionId }));
  };

  const goTo = (i) => setIdx(Math.max(0, Math.min(questions.length - 1, i)));

  const handleSubmit = async () => {
    if (!allAnswered || submitting) return;
    setError(null);
    try {
      const payload = questions.map((question) => ({
        questionId: question.id,
        selectedOptionId: answers[question.id] || null
      }));
      const graded = await onSubmit(payload);
      setResult(graded);
    } catch (err) {
      setError(err.message || 'Could not submit the quiz — please try again.');
    }
  };

  const handleRetake = async () => {
    setResult(null);
    setAnswers({});
    setIdx(0);
    setError(null);
    if (onRetake) await onRetake();
  };

  if (result) {
    const explanationByQuestionId = new Map(result.results.map((r) => [r.questionId, r]));
    return (
      <div className="quiz-result">
        <div className="quiz-result-icon">{result.passed ? '✓' : '↻'}</div>
        <h3>{result.passed ? '🎉 Quiz passed!' : 'Almost there'}</h3>
        <p>
          You scored <b style={{ color: 'var(--text)' }}>{result.correctCount}/{result.total}</b> ({result.score}%)
          {' — '}
          {result.passed
            ? `certificate ${result.certificate ? 'issued!' : 'will be issued shortly.'}`
            : `you need ${result.passingScore}% to pass. Review the explanations below and try again.`}
        </p>
        <div className="quiz-review">
          {questions.map((question, i) => {
            const r = explanationByQuestionId.get(question.id);
            const selected = answers[question.id];
            const selectedOption = question.options.find((o) => o.id === selected);
            const correctOption = question.options.find((o) => o.id === r?.correctOptionId);
            return (
              <div className="quiz-review-item" key={question.id}>
                <span className={r?.correct ? 'right' : 'wrong'}>{r?.correct ? '✓' : '✗'}</span>
                <div>
                  <b>{i + 1}. {question.question}</b>
                  <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
                    Your answer: {selectedOption?.text || '(left blank)'}
                  </div>
                  {!r?.correct && (
                    <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
                      Correct answer: {correctOption?.text}
                    </div>
                  )}
                  {r?.explanation && (
                    <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '4px' }}>{r.explanation}</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {!result.passed && (
          <button className="btn-primary-lg" style={{ marginTop: '18px' }} onClick={handleRetake}>
            Retake quiz →
          </button>
        )}
      </div>
    );
  }

  if (!q) return null;

  return (
    <div className="quiz-body">
      <div className="progress-track" style={{ marginBottom: '14px' }}>
        <i style={{ width: `${progressPct}%` }} />
      </div>
      <div style={{ fontSize: '11.5px', color: 'var(--muted)', marginBottom: '10px' }}>
        Question {idx + 1} of {questions.length} · {answeredCount} answered
      </div>

      <div className="quiz-question">
        <b>{idx + 1}. {q.question}</b>
        <div className="quiz-options">
          {q.options.map((opt) => (
            <label className={`quiz-option ${answers[q.id] === opt.id ? 'selected' : ''}`} key={opt.id}>
              <input
                type="radio"
                name={q.id}
                checked={answers[q.id] === opt.id}
                onChange={() => pick(opt.id)}
              />
              {opt.text}
            </label>
          ))}
        </div>
      </div>

      {error && <div style={{ color: 'var(--danger)', fontSize: '12.5px', marginBottom: '12px' }}>{error}</div>}

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
        <button
          className="btn-ghost-lg"
          disabled={idx === 0}
          style={idx === 0 ? { opacity: 0.4, cursor: 'not-allowed' } : {}}
          onClick={() => goTo(idx - 1)}
        >
          ← Previous
        </button>

        {idx < questions.length - 1 ? (
          <button className="btn-primary-lg" onClick={() => goTo(idx + 1)}>Next →</button>
        ) : (
          <button
            className="btn-primary-lg"
            disabled={!allAnswered || submitting}
            style={!allAnswered || submitting ? { opacity: 0.45, cursor: 'not-allowed' } : {}}
            onClick={handleSubmit}
          >
            {submitting ? 'Submitting…' : 'Submit answers →'}
          </button>
        )}
      </div>
    </div>
  );
}
