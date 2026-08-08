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
  // Same eligibility check as server's quizController.loadSkillOr404 — a
  // course with no lessons yet will 400 on every single request, forever,
  // no matter how many times "Try again" is clicked. Short-circuit instead
  // of hitting that wall.
  const hasQuizContent = Boolean(skill) && (skill.lessons?.length || 0) > 0;

  const load = React.useCallback(() => {
    setState((s) => ({ ...s, loading: true, error: null, forbidden: null }));
    fetchCourseQuiz(id)
      .then((data) => {
        setState({ loading: false, quiz: data, error: null, forbidden: null });
      })
      .catch((err) => {
        if (err.status === 403) {
          setState({ loading: false, quiz: null, error: null, forbidden: err.message });
        } else {
          setState({ loading: false, quiz: null, error: err.message, forbidden: null });
        }
      });
  }, [id]);

  React.useEffect(() => {
    if (skillLoading) return;
    // Don't even ask the server for a quiz this course can never generate —
    // see hasQuizContent above. Surfacing this locally avoids the endless
    // "Couldn't load the quiz" / "Try again" loop for these courses.
    if (!hasQuizContent) {
      setState({ loading: false, quiz: null, error: null, forbidden: null });
      return;
    }
    load();
  }, [load, skillLoading, hasQuizContent]);

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
    return <ComingSoon title="Preparing your quiz…" text="Preparing your course quiz from the lessons you've completed…" />;
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

  if (!hasQuizContent) {
    return (
      <ComingSoon
        title="Quiz not available yet"
        text="This course's mentor hasn't linked a course video or lessons yet, so there's nothing for the AI to build a quiz from. Check back once they add content."
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
