import React from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout.jsx';
import { useUser } from '../context/UserContext.jsx';

const MOCK_UPCOMING = [
  { student:'Owen Kim', initials:'OK', avatar:'https://i.pravatar.cc/150?img=53', topic:'React project review', day:'Wed', time:'4:00 PM' },
  { student:'Ines Vidal', initials:'IV', avatar:'https://i.pravatar.cc/150?img=48', topic:'Portfolio feedback', day:'Fri', time:'1:00 PM' }
];

const MOCK_REVIEWS = [
  { student:'Haruto M.', rating:5, text:'Clear, patient, and really knew how to explain things simply.' },
  { student:'Ananya G.', rating:5, text:'Best teaching session I\'ve had on this platform so far.' }
];

export default function MentorDashboard(){
  const { profile } = useUser();
  const firstName = (profile.name || 'there').split(' ')[0];
  const skillsOffered = profile.skillsOffered || [];

  // Deterministic mock stats so the numbers don't jump around on every render.
  const seed = (profile.name || 'mentor').length;
  const earnings = 180 + seed*14;
  const studentsCount = 6 + (seed % 5);
  const avgRating = (4.6 + (seed % 4) * 0.1).toFixed(1);

  return (
    <DashboardLayout>
      <div className="dash-header">
        <h1>Mentor overview, {firstName} 🧑‍🏫</h1>
        <p>How your teaching is going on SkillSwap.</p>
      </div>

      <div className="dash-stat-row">
        <div className="dash-stat"><b>${earnings}</b><span>Total earnings</span></div>
        <div className="dash-stat"><b>{studentsCount}</b><span>Students taught</span></div>
        <div className="dash-stat"><b>{MOCK_UPCOMING.length}</b><span>Upcoming sessions</span></div>
        <div className="dash-stat"><b>★ {avgRating}</b><span>Average rating</span></div>
      </div>

      {skillsOffered.length===0 && (
        <div className="guest-banner" style={{marginBottom:'30px'}}>
          You haven't listed any skills to teach yet — add them in your <Link to="/profile">Profile</Link> so students can find you.
        </div>
      )}

      <div className="dash-section-head"><h2>Upcoming teaching sessions</h2><Link to="/sessions">View all →</Link></div>
      {MOCK_UPCOMING.length===0 ? (
        <div className="dash-empty">No upcoming teaching sessions booked yet.</div>
      ) : (
        <div className="my-learning-list" style={{marginBottom:'40px'}}>
          {MOCK_UPCOMING.map((s,i)=>(
            <div className="learning-row" key={i}>
              <div className="learning-row-icon">{s.avatar ? <img src={s.avatar} alt={s.student} /> : s.initials}</div>
              <div className="learning-row-info">
                <b>{s.topic}</b>
                <span>with {s.student} · {s.day}, {s.time}</span>
              </div>
              <button className="btn-outline">Message</button>
            </div>
          ))}
        </div>
      )}

      <div className="two-col-dash">
        <div>
          <div className="dash-section-head"><h2>What you teach</h2></div>
          <div className="col-card">
            {skillsOffered.length===0 ? (
              <div className="dash-empty">Nothing listed yet.</div>
            ) : (
              <div className="mentor-tags">{skillsOffered.map(s=><span key={s}>{s}</span>)}</div>
            )}
          </div>
        </div>
        <div>
          <div className="dash-section-head"><h2>Recent reviews</h2></div>
          <div className="col-card">
            {MOCK_REVIEWS.map((r,i)=>(
              <div className="quote" key={i}>
                <p>"{r.text}"</p>
                <div className="who"><span>{r.student}</span><span>{'★'.repeat(r.rating)}</span></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
