import React from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout.jsx';
import { useUser } from '../context/UserContext.jsx';
import { getSkillById, skills, categories } from '../data/skills.js';

export default function Dashboard(){
  const { profile, enrolled, wishlist, notifications } = useUser();

  const withSkill = enrolled.map(e => ({ ...e, skill:getSkillById(e.skillId) })).filter(e=>e.skill);
  const inProgress = withSkill.filter(e => e.completedLessons.length < e.skill.lessons.length);
  const completed = withSkill.filter(e => e.completedLessons.length >= e.skill.lessons.length && e.skill.lessons.length>0);
  const unread = notifications.filter(n=>!n.read).length;

  const interestKeys = profile.interests || [];
  const enrolledIds = new Set(enrolled.map(e=>e.skillId));
  const recommended = skills
    .filter(s => !enrolledIds.has(s.id))
    .sort((a,b) => {
      const aMatch = interestKeys.includes(a.category) ? 1 : 0;
      const bMatch = interestKeys.includes(b.category) ? 1 : 0;
      return bMatch - aMatch || b.rating - a.rating;
    })
    .slice(0, 3);

  const firstName = (profile.name || 'there').split(' ')[0];

  return (
    <DashboardLayout>
      <div className="dash-header">
        <h1>Welcome back, {firstName} 👋</h1>
        <p>Here's what's happening with your learning today.</p>
      </div>

      <div className="dash-stat-row">
        <div className="dash-stat"><b>{inProgress.length}</b><span>In progress</span></div>
        <div className="dash-stat"><b>{completed.length}</b><span>Completed</span></div>
        <div className="dash-stat"><b>{wishlist.length}</b><span>Wishlisted</span></div>
        <div className="dash-stat"><b>{unread}</b><span>Unread alerts</span></div>
      </div>

      <div className="dash-section-head">
        <h2>Continue learning</h2>
        {inProgress.length>0 && <Link to="/my-learning">View all →</Link>}
      </div>

      {inProgress.length===0 ? (
        <div className="dash-empty">
          You haven't started a skill yet. <Link to="/explore">Browse skills</Link> to get going.
        </div>
      ) : (
        <div className="continue-grid">
          {inProgress.slice(0,3).map(e=>{
            const pct = Math.round((e.completedLessons.length / e.skill.lessons.length) * 100);
            return (
              <div className="continue-card" key={e.skillId}>
                <div className="cat">{categories.find(c=>c.key===e.skill.category)?.icon} {e.skill.title}</div>
                <div className="progress-track" style={{margin:'12px 0'}}><i style={{width:`${pct}%`}}></i></div>
                <div className="continue-meta">
                  <span>{e.completedLessons.length}/{e.skill.lessons.length} lessons · {pct}%</span>
                  <Link to={`/learn/${e.skillId}`} className="btn-solid">Resume →</Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="two-col-dash">
        <div>
          <div className="dash-section-head"><h2>Recommended for you</h2></div>
          <div className="col-card">
            {recommended.map(s=>(
              <Link to={`/skill/${s.id}`} className="feed-item" key={s.id} style={{textDecoration:'none', color:'inherit'}}>
                <div className="dot">{categories.find(c=>c.key===s.category)?.icon}</div>
                <p><b>{s.title}</b><br /><span>★ {s.rating} · {s.students.toLocaleString()} students</span></p>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <div className="dash-section-head"><h2>Upcoming sessions</h2></div>
          <div className="col-card">
            <div className="session-item"><div className="session-date">24<br />MAY</div><div className="session-info"><b>Mastering Python Basics</b><span>John Doe · 7:00 PM IST</span></div><button>Join</button></div>
            <div className="session-item"><div className="session-date">25<br />MAY</div><div className="session-info"><b>UI/UX Design Workshop</b><span>Sarah Williams · 8:00 PM IST</span></div><button>Join</button></div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
