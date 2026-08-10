import React from 'react';
import { Link, useParams } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout.jsx';
import { Skeleton } from '../components/Skeleton.jsx';
import { useSkill } from '../lib/skillsApi.js';
import { fetchQuizForManage, saveQuiz, setQuizPublished } from '../lib/quizApi.js';
import { useToast } from '../context/ToastContext.jsx';

let nextClientId = 1;
function emptyQuestionDraft() {
  return { clientId: nextClientId++, question: '', options: ['', '', '', ''], correctOptionIndex: 0, explanation: '' };
}
function draftFromServer(q) {
  return { clientId: nextClientId++, question: q.question, options: [...q.options], correctOptionIndex: q.correctOptionIndex, explanation: q.explanation || '' };
}

// Client-side pre-check that mirrors the server's validation — gives an
// immediate, specific error instead of waiting on a round trip. The server
// still re-validates everything itself regardless (never trust the client).
function validateForSave(questions) {
  for (let i = 0; i < questions.length; i += 1) {
    const q = questions[i];
    if (!q.question.trim()) return `Question ${i + 1}: question text is required.`;
    if (q.options.some((o) => !o.trim())) return `Question ${i + 1}: all 4 options must have text.`;
    const dedupe = new Set(q.options.map((o) => o.trim().toLowerCase()));
    if (dedupe.size !== 4) return `Question ${i + 1}: options must not duplicate each other.`;
  }
  return null;
}

function toPayload(questions) {
  return questions.map(({ question, options, correctOptionIndex, explanation }) => ({
    question: question.trim(),
    options: options.map((o) => o.trim()),
    correctOptionIndex,
    explanation: explanation.trim()
  }));
}

export default function MentorQuizManager() {
  const { id } = useParams();
  const toast = useToast();
  const { skill, loading: skillLoading } = useSkill(id);

  const [loading, setLoading] = React.useState(true);
  const [questions, setQuestions] = React.useState([]);
  const [passingScore, setPassingScore] = React.useState(70);
  const [published, setPublished] = React.useState(false);
  const [loadError, setLoadError] = React.useState('');

  const [editing, setEditing] = React.useState(null); // question draft being added/edited in the modal, or null
  const [editingIndex, setEditingIndex] = React.useState(null); // index in `questions`, or null when adding new
  const [saving, setSaving] = React.useState(false);
  const [publishing, setPublishing] = React.useState(false);
  const [preview, setPreview] = React.useState(false);

  React.useEffect(() => {
    fetchQuizForManage(id)
      .then((data) => {
        if (data.quiz) {
          setQuestions(data.quiz.questions.map(draftFromServer));
          setPassingScore(data.quiz.passingScore);
          setPublished(data.quiz.published);
        }
      })
      .catch((err) => setLoadError(err.message || 'Could not load this quiz.'))
      .finally(() => setLoading(false));
  }, [id]);

  const openAdd = () => { setEditing(emptyQuestionDraft()); setEditingIndex(null); };
  const openEdit = (i) => { setEditing({ ...questions[i], options: [...questions[i].options] }); setEditingIndex(i); };
  const closeEditor = () => { setEditing(null); setEditingIndex(null); };

  const saveQuestionDraft = () => {
    const err = validateForSave([editing]);
    if (err) { toast.error(err.replace('Question 1', 'This question')); return; }
    setQuestions((qs) => {
      if (editingIndex === null) return [...qs, editing];
      const next = [...qs];
      next[editingIndex] = editing;
      return next;
    });
    closeEditor();
  };

  const deleteQuestion = (i) => {
    setQuestions((qs) => qs.filter((_, idx) => idx !== i));
  };

  const moveQuestion = (i, dir) => {
    setQuestions((qs) => {
      const j = i + dir;
      if (j < 0 || j >= qs.length) return qs;
      const next = [...qs];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };

  const handleSave = async ({ silent } = {}) => {
    const err = validateForSave(questions);
    if (err) { toast.error(err); return false; }
    setSaving(true);
    try {
      await saveQuiz(id, { questions: toPayload(questions), passingScore: Number(passingScore) || 70 });
      if (!silent) toast.success('Quiz saved as draft.');
      return true;
    } catch (e) {
      toast.error(e.message || 'Could not save the quiz.');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handlePublishToggle = async () => {
    if (!published && questions.length === 0) {
      toast.error('Add at least one question before publishing.');
      return;
    }
    setPublishing(true);
    try {
      // Publishing always saves current edits first, so what goes live is
      // never stale relative to what the mentor sees on screen. Unpublishing
      // doesn't need this — it's just a visibility flip.
      if (!published) {
        const ok = await handleSave({ silent: true });
        if (!ok) { setPublishing(false); return; }
      }
      const data = await setQuizPublished(id, !published);
      setPublished(data.quiz.published);
      toast.success(data.quiz.published ? 'Quiz published — learners can now take it.' : 'Quiz unpublished.');
    } catch (e) {
      toast.error(e.message || 'Could not update publish status.');
    } finally {
      setPublishing(false);
    }
  };

  if (loading || skillLoading) {
    return (
      <DashboardLayout title="Manage Quiz">
        <div className="col-card"><Skeleton height="20px" width="60%" style={{ marginBottom: '14px' }} /><Skeleton height="14px" width="90%" /></div>
      </DashboardLayout>
    );
  }

  if (!skill) {
    return (
      <DashboardLayout title="Manage Quiz">
        <div className="form-error">Course not found.</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Manage Quiz" subtitle={skill.title}>
      <div className="crumbs" style={{ marginBottom: '18px' }}>
        <Link to="/mentor-courses">My Courses</Link><span>/</span>
        <span style={{ color: 'var(--text)' }}>{skill.title} — Quiz</span>
      </div>

      {loadError && <div className="form-error" style={{ marginBottom: '16px' }}>{loadError}</div>}

      <div className="col-card" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div>
            <span className={published ? 'completion-pill' : 'notice-banner'} style={{ display: 'inline-block' }}>
              {published ? '✓ Published — visible to learners' : '● Draft — not visible to learners yet'}
            </span>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button className="btn-ghost-lg" onClick={() => setPreview(true)} disabled={questions.length === 0}>Preview</button>
            <button className="btn-outline" onClick={() => handleSave()} disabled={saving}>{saving ? 'Saving…' : 'Save draft'}</button>
            <button
              className={published ? 'btn-danger-outline' : 'btn-primary-lg'}
              onClick={handlePublishToggle}
              disabled={publishing}
            >
              {publishing ? 'Working…' : published ? 'Unpublish' : 'Publish'}
            </button>
          </div>
        </div>
      </div>

      <div className="col-card" style={{ marginBottom: '20px' }}>
        <label className="form-label">Passing percentage</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', maxWidth: '160px' }}>
          <input
            className="form-input"
            type="number"
            min={0}
            max={100}
            value={passingScore}
            onChange={(e) => setPassingScore(e.target.value)}
          />
          <span style={{ color: 'var(--muted)', fontSize: '13px' }}>%</span>
        </div>
      </div>

      <div className="mentor-toolbar">
        <p style={{ color: 'var(--muted)', fontSize: '13px', margin: 0 }}>
          {questions.length} question{questions.length === 1 ? '' : 's'}
        </p>
        <button className="btn-primary-lg" onClick={openAdd}>＋ Add question</button>
      </div>

      {questions.length === 0 ? (
        <div className="col-card">
          <p className="desc" style={{ margin: 0 }}>No questions yet — add your first one to start building this quiz.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {questions.map((q, i) => (
            <div className="col-card" key={q.clientId} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <button className="btn-ghost-lg" style={{ padding: '4px 10px' }} disabled={i === 0} onClick={() => moveQuestion(i, -1)}>↑</button>
                <button className="btn-ghost-lg" style={{ padding: '4px 10px' }} disabled={i === questions.length - 1} onClick={() => moveQuestion(i, 1)}>↓</button>
              </div>
              <div style={{ flex: '1 1 260px', minWidth: 0 }}>
                <b>{i + 1}. {q.question}</b>
                <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '6px' }}>
                  Correct: {q.options[q.correctOptionIndex]}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn-outline" onClick={() => openEdit(i)}>Edit</button>
                <button className="btn-danger-outline" onClick={() => deleteQuestion(i)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div className="modal-backdrop" onClick={closeEditor}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>{editingIndex === null ? 'Add question' : 'Edit question'}</h3>

            <label className="form-label" style={{ marginTop: '14px' }}>Question text</label>
            <textarea
              className="form-input"
              rows={2}
              value={editing.question}
              onChange={(e) => setEditing((d) => ({ ...d, question: e.target.value }))}
            />

            <label className="form-label" style={{ marginTop: '14px' }}>Options — select the correct one</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {editing.options.map((opt, oi) => (
                <label
                  key={oi}
                  className={`quiz-option ${editing.correctOptionIndex === oi ? 'selected' : ''}`}
                  style={{ cursor: 'pointer' }}
                >
                  <input
                    type="radio"
                    name="correct-option"
                    checked={editing.correctOptionIndex === oi}
                    onChange={() => setEditing((d) => ({ ...d, correctOptionIndex: oi }))}
                  />
                  <input
                    className="form-input"
                    style={{ border: 'none', background: 'transparent', padding: '0', flex: 1 }}
                    placeholder={`Option ${oi + 1}`}
                    value={opt}
                    onChange={(e) => setEditing((d) => {
                      const next = [...d.options];
                      next[oi] = e.target.value;
                      return { ...d, options: next };
                    })}
                  />
                </label>
              ))}
            </div>

            <label className="form-label" style={{ marginTop: '14px' }}>Explanation (optional)</label>
            <textarea
              className="form-input"
              rows={2}
              placeholder="Shown to learners after they answer, to explain why the correct option is correct."
              value={editing.explanation}
              onChange={(e) => setEditing((d) => ({ ...d, explanation: e.target.value }))}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button className="btn-ghost-lg" onClick={closeEditor}>Cancel</button>
              <button className="btn-primary-lg" onClick={saveQuestionDraft}>
                {editingIndex === null ? 'Add question' : 'Save changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {preview && (
        <div className="modal-backdrop" onClick={() => setPreview(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxHeight: '80vh', overflowY: 'auto' }}>
            <h3>Preview — {skill.title}</h3>
            <p className="desc">{questions.length} questions · pass with {passingScore || 70}% or higher</p>
            <div className="quiz-review">
              {questions.map((q, i) => (
                <div className="quiz-review-item" key={q.clientId}>
                  <span className="right">✓</span>
                  <div>
                    <b>{i + 1}. {q.question}</b>
                    <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '4px' }}>
                      {q.options.map((o, oi) => (
                        <div key={oi} style={{ color: oi === q.correctOptionIndex ? 'var(--accent)' : 'var(--muted)' }}>
                          {oi === q.correctOptionIndex ? '✓ ' : '· '}{o}
                        </div>
                      ))}
                    </div>
                    {q.explanation && (
                      <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '4px' }}>{q.explanation}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '18px' }}>
              <button className="btn-ghost-lg" onClick={() => setPreview(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
