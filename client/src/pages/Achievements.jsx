import React from 'react';
import DashboardLayout from '../components/DashboardLayout.jsx';
import { useUser } from '../context/UserContext.jsx';
import { useSkillsById } from '../lib/skillsApi.js';
import { api } from '../lib/api.js';

export default function Achievements() {
  const { enrolled, wishlist } = useUser();
  const { getSkillById } = useSkillsById(enrolled.map(e => e.skillId));

  const [bookings, setBookings] = React.useState([]);
  const [reviews, setReviews] = React.useState([]);
  const [transactions, setTransactions] = React.useState([]);

  React.useEffect(() => {
    api.get('/api/bookings').then(d => setBookings(d.bookings || [])).catch(()=>{});
    api.get('/api/reviews/mine').then(d => setReviews(d.reviews || [])).catch(()=>{});
    api.get('/api/wallet/transactions').then(d => setTransactions(d.transactions || [])).catch(()=>{});
  }, []);

  const withSkill = enrolled.map(e => ({ ...e, skill: getSkillById(e.skillId) })).filter(e => e.skill);
  const completedSkills = withSkill.filter(e => e.completedLessons.length >= e.skill.lessons.length && e.skill.lessons.length > 0);
  const categoriesTouched = new Set(withSkill.map(e => e.skill.category));
  const completedSessions = bookings.filter(b => b.status === 'completed');
  const perfectQuiz = withSkill.some(e => Object.values(e.quizScores || {}).some(q => q.score === q.total && q.total > 0));
  const toppedUp = transactions.some(t => t.type === 'topup');

  const achievements = [
    { key: 'first-step', icon: '🚀', title: 'First Step', desc: 'Enroll in your first skill.', unlocked: enrolled.length >= 1 },
    { key: 'skill-master', icon: '🏆', title: 'Skill Master', desc: 'Complete every lesson in a skill.', unlocked: completedSkills.length >= 1, progress: completedSkills.length >= 1 ? null : `${Math.max(...withSkill.map(e => e.completedLessons.length), 0)} lessons done` },
    { key: 'polyglot', icon: '🌐', title: 'Well-Rounded Learner', desc: 'Explore 3 different skill categories.', unlocked: categoriesTouched.size >= 3, progress: `${categoriesTouched.size}/3 categories` },
    { key: 'session-regular', icon: '📅', title: 'Session Regular', desc: 'Complete 3 mentor sessions.', unlocked: completedSessions.length >= 3, progress: `${completedSessions.length}/3 sessions` },
    { key: 'reviewer', icon: '⭐', title: 'Thoughtful Reviewer', desc: 'Leave your first mentor review.', unlocked: reviews.length >= 1 },
    { key: 'curator', icon: '☆', title: 'Wishlist Curator', desc: 'Save 5 skills to your wishlist.', unlocked: wishlist.length >= 5, progress: `${wishlist.length}/5 saved` },
    { key: 'quiz-ace', icon: '🎯', title: 'Quiz Ace', desc: 'Score 100% on a checkpoint quiz.', unlocked: perfectQuiz },
    { key: 'wallet-wizard', icon: '◎', title: 'Wallet Wizard', desc: 'Top up your wallet for the first time.', unlocked: toppedUp }
  ];

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <DashboardLayout
      title="Achievements"
      subtitle={`${unlockedCount} of ${achievements.length} unlocked — keep learning to earn the rest.`}
    >
      <div className="dash-stat-row" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
        <div className="dash-stat"><b>{unlockedCount}</b><span>Unlocked</span></div>
        <div className="dash-stat"><b>{achievements.length - unlockedCount}</b><span>Remaining</span></div>
        <div className="dash-stat"><b>{Math.round((unlockedCount / achievements.length) * 100)}%</b><span>Complete</span></div>
      </div>

      <div className="cert-grid">
        {achievements.map(a => (
          <div key={a.key} className={`achievement-card ${a.unlocked ? 'unlocked' : 'locked'}`}>
            <div className="achievement-icon">{a.unlocked ? a.icon : '🔒'}</div>
            <b>{a.title}</b>
            <span>{a.desc}</span>
            {!a.unlocked && a.progress && <span className="achievement-progress">{a.progress}</span>}
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
