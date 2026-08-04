import React from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout.jsx';
import { useSkills } from '../lib/skillsApi.js';

// One card per mentor (deduped by mentor.id — a mentor's `id` is stable
// across every skill they teach, see server/src/models/Skill.js). Booking
// happens per-skill, so each card links into that mentor's profile — from
// there "Book a session" targets whichever specific skill the learner
// actually wants.
export default function BookSession(){
  const { skills, loading } = useSkills();

  const mentors = [];
  const seen = new Set();
  for (const s of skills){
    if (!s.mentor?.id || seen.has(s.mentor.id)) continue;
    seen.add(s.mentor.id);
    mentors.push({ ...s.mentor, skillId: s.id, category: s.category });
  }

  return (
    <DashboardLayout title="Book a Session" subtitle="Pick a mentor to see their profile and book time.">
      {loading ? (
        <div className="dash-empty">Loading mentors…</div>
      ) : (
        <div className="mentor-grid">
          {mentors.map(m=>(
            <Link to={`/mentor/${m.skillId}`} className="mentor-card" key={m.id} style={{textDecoration:'none', color:'inherit'}}>
              <div className="mentor-top"><div className="mentor-avatar">{m.initials}</div></div>
              <div className="mentor-body">
                <b>{m.name}</b>
                <div className="role">{m.role}</div>
                <div className="rating">★ {m.rating} ({m.reviews})</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
