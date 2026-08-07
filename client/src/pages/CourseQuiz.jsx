import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSkill } from '../lib/skillsApi.js';
import { useUser } from '../context/UserContext.jsx';
import { fetchCourseQuiz, submitCourseQuiz, regenerateCourseQuiz } from '../lib/quizApi.js';
import AiQuiz from '../components/AiQuiz.jsx';
import ComingSoon from './ComingSoon.jsx';

export default function CourseQuiz() {
  const { id } = useParams();
  const { skill, loading: skillLoading } = useSkill(id);
  const { profile, isAdmin } = useUser();

  const [state, setState] = React.useState({ loading: true, quiz: null, error: null, forbidden: null });
  const [submitting, setSubmitting] = React.useState(false);
  const [regenerating, setRegenerating] = React.useState(false);

  const isOwnerMentor = Boolean(skill?.mentorUser) && skill.mentorUser === profile?.id;
  const canRegenerate = isOwnerMentor || isAdmin;

  const load = React.useCallback(() => {
    setState((s) => ({ ...s, loading: true, error: null, forbidden: null }));
    fetchCourseQuiz(id)
      .then((data) => setState({ loading: false, quiz: data, error: null, forbidden: null }))
      .catch((err) => {
        if (err.status === 403) {
          setState({ loading: false, quiz: null, error: null, forbidden: err.message });
        } else {
          setState({ loading: false, quiz: null, error: err.message, forbidden: null });
        }
      });
  }, [id]);

  React.useEffect(() => {
    load();
  }, [load]);

  const handleSubmit = async (answers) => {
    setSubmitting(true);
    try {
      const graded = await submitCourseQuiz(id, answers);
      return graded;
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegenerate = async () => {
    setRegenerating(true);
    try {
      await regenerateCourseQuiz(id);
      load();
    } catch (err) {
      setState((s) => ({ ...s, error: err.message }));
    } finally {
      setRegenerating(false);
    }
  };

  if (skillLoading || state.loading) {
    return <ComingSoon title="Preparing your quiz…" text="Just a moment while the AI puts your quiz together." />;
  }

  if (!skill) {
    return <ComingSoon title="Course not found" text="We couldn't find that course." />;
  }

  if (state.forbidden) {
    return (
      <ComingSoon
        title="Finish the course first"
        text={state.forbidden}
        action={<Link to={`/learn/${id}`} className="btn-primary-lg">Back to lessons →</Link>}
      />
    );
  }

  if (state.error || !state.quiz) {
    return (
      <ComingSoon
        title="Couldn't load the quiz"
        text={state.error || 'Something went wrong generating the quiz — please try again in a moment.'}
        action={<button className="btn-primary-lg" onClick={load}>Try again</button>}
      />
    );
  }

  const { quiz, alreadyPassed, certificateAlreadyIssued, bestScore } = state.quiz;

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto', padding: '150px 24px 100px', position: 'relative', zIndex: 1 }}>
      <div className="crumbs" style={{ marginBottom: '18px' }}>
        <Link to="/">Home</Link><span>/</span>
        <Link to={`/skill/${skill.id}`}>{skill.title}</Link><span>/</span>
        <span style={{ color: 'var(--text)' }}>AI Quiz</span>
      </div>

      <div className="col-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '6px' }}>
          <div>
            <div className="completion-pill" style={{ marginBottom: '10px' }}>🎉 Course completed</div>
            <h2 style={{ marginBottom: '4px' }}>{skill.title} — AI Quiz</h2>
            <div className="desc">
              {quiz.questionCount} questions · pass with {quiz.passingScore}% or higher to earn your certificate.
            </div>
          </div>
          {canRegenerate && (
            <button className="btn-outline" onClick={handleRegenerate} disabled={regenerating}>
              {regenerating ? 'Regenerating…' : '↻ Regenerate AI Quiz'}
            </button>
          )}
        </div>

        {alreadyPassed && (
          <div className="notice-banner" style={{ margin: '14px 0' }}>
            ✓ You've already passed this quiz{bestScore ? ` (best score: ${bestScore}%)` : ''}
            {certificateAlreadyIssued && <> — <Link to={`/certificate/${skill.id}`}>view your certificate</Link>.</>}
            {' '}Taking it again won't affect your certificate.
          </div>
        )}

        <AiQuiz
          key={quiz.questions.map((q) => q.id).join(',')}
          quiz={quiz}
          onSubmit={handleSubmit}
          onRetake={load}
          submitting={submitting}
        />
      </div>
    </div>
  );
}
