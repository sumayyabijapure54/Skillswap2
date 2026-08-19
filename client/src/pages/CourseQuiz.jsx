import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSkill } from '../lib/skillsApi.js';
import { useUser } from '../context/UserContext.jsx';
import { fetchCourseQuiz, submitCourseQuiz } from '../lib/quizApi.js';
import QuizTaker from '../components/QuizTaker.jsx';
import ComingSoon from './ComingSoon.jsx';

export default function CourseQuiz() {
  const { id } = useParams();
  const { skill, loading: skillLoading } = useSkill(id);
  const { profile } = useUser();

  const [state, setState] = React.useState({ loading: true, quiz: null, error: null, forbidden: null, notPublished: false });
  const [submitting, setSubmitting] = React.useState(false);

  const isOwnerMentor = Boolean(skill?.mentorUser) && skill.mentorUser === profile?.id;

  const load = React.useCallback(() => {
    setState((s) => ({ ...s, loading: true, error: null, forbidden: null, notPublished: false }));
    fetchCourseQuiz(id)
      .then((data) => {
        setState({ loading: false, quiz: data, error: null, forbidden: null, notPublished: false });
      })
      .catch((err) => {
        if (err.status === 403) {
          setState({ loading: false, quiz: null, error: null, forbidden: err.message, notPublished: false });
        } else if (err.status === 404) {
          // No published quiz for this course yet — distinct from a real
          // failure, so "Try again" isn't the right call to action here.
          setState({ loading: false, quiz: null, error: null, forbidden: null, notPublished: true });
        } else {
          setState({ loading: false, quiz: null, error: err.message, forbidden: null, notPublished: false });
        }
      });
  }, [id]);

  React.useEffect(() => {
    if (skillLoading) return;
    load();
  }, [load, skillLoading]);

  const handleSubmit = async (answers) => {
    setSubmitting(true);
    try {
      const graded = await submitCourseQuiz(id, answers);
      return graded;
    } finally {
      setSubmitting(false);
    }
  };

  if (skillLoading || state.loading) {
    return <ComingSoon title="Loading your quiz…" text="Just a moment." />;
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

  if (state.notPublished) {
    return (
      <ComingSoon
        title="Quiz not available yet"
        text={
          isOwnerMentor
            ? "You haven't published a quiz for this course yet."
            : "This course's mentor hasn't published a quiz yet. Check back later."
        }
        action={
          isOwnerMentor
            ? <Link to={`/mentor-courses/${id}/quiz`} className="btn-primary-lg">Manage quiz →</Link>
            : <Link to={`/learn/${id}`} className="btn-primary-lg">Back to lessons →</Link>
        }
      />
    );
  }

  if (state.error || !state.quiz) {
    return (
      <ComingSoon
        title="Couldn't load the quiz"
        text={state.error || 'Something went wrong loading the quiz — please try again in a moment.'}
        action={<button className="btn-primary-lg" onClick={load}>Try again</button>}
      />
    );
  }

  const { quiz, alreadyPassed, certificateAlreadyIssued, bestScore } = state.quiz;

  return (
    <div className="detail-wrap" style={{ maxWidth: '760px' }}>
      <div className="crumbs" style={{ marginBottom: '18px' }}>
        <Link to="/">Home</Link><span>/</span>
        <Link to={`/skill/${skill.id}`}>{skill.title}</Link><span>/</span>
        <span style={{ color: 'var(--text)' }}>Quiz</span>
      </div>

      <div className="col-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '6px', flexWrap: 'wrap' }}>
          <div>
            <div className="completion-pill" style={{ marginBottom: '10px' }}>🎉 Course completed</div>
            <h2 style={{ marginBottom: '4px' }}>{skill.title} — Quiz</h2>
            <div className="desc">
              {quiz.questionCount} questions · pass with {quiz.passingScore}% or higher to earn your certificate.
            </div>
          </div>
          {isOwnerMentor && (
            <Link to={`/mentor-courses/${id}/quiz`} className="btn-outline">Manage quiz</Link>
          )}
        </div>

        {alreadyPassed && (
          <div className="notice-banner" style={{ margin: '14px 0' }}>
            ✓ You've already passed this quiz{bestScore ? ` (best score: ${bestScore}%)` : ''}
            {certificateAlreadyIssued && <> — <Link to={`/certificate/${skill.id}`}>view your certificate</Link>.</>}
            {' '}Taking it again won't affect your certificate.
          </div>
        )}

        <QuizTaker
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
