import React from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout.jsx';
import { useUser } from '../context/UserContext.jsx';
import { useSkillsById, useSkills, useCategories } from '../lib/skillsApi.js';
import { MiniBarChart } from '../components/MiniChart.jsx';
import ScrollReveal from '../components/ScrollReveal.jsx';
import Countdown from '../components/Countdown.jsx';
import { myUpcomingLiveSessions, myLiveLiveSessions } from '../lib/liveSessionsApi.js';
import { getSocket } from '../lib/socket.js';

const WEEK_LABELS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

// Shows the soonest live-or-about-to-start session for a course the
// student is enrolled in. Pulls straight from the real
// /api/live-sessions/my/* endpoints (unlike the static "Upcoming
// sessions" list below it, which is placeholder booking data) and
// updates instantly on live-session:update instead of polling.
function NextLiveSessionWidget(){
  const [session, setSession] = React.useState(undefined); // undefined = loading, null = none

  const load = React.useCallback(() => {
    Promise.all([myLiveLiveSessions(), myUpcomingLiveSessions()])
      .then(([live, upcoming]) => {
        const soonest = (live.liveSessions || [])[0] || (upcoming.liveSessions || [])[0] || null;
        setSession(soonest);
      })
      .catch(() => setSession(null));
  }, []);

  React.useEffect(() => { load(); }, [load]);

  React.useEffect(() => {
    const socket = getSocket();
    if (!socket) return;
    const onUpdate = () => load();
    socket.on('live-session:update', onUpdate);
    return () => socket.off('live-session:update', onUpdate);
  }, [load]);

  if (!session) return null;

  return (
    <>
      <div className="dash-section-head"><h2>Live session</h2></div>
      <div className="col-card" style={{marginBottom:'28px'}}>
        <div className="session-item">
          <div className="session-date">{new Date(session.startTime).getDate()}<br />{new Date(session.startTime).toLocaleDateString(undefined,{month:'short'}).toUpperCase()}</div>
          <div className="session-info">
            <b>{session.title}</b>
            <span>{session.skillTitle} · {new Date(session.startTime).toLocaleTimeString(undefined,{hour:'numeric',minute:'2-digit'})}</span>
          </div>
          {session.status === 'live' ? (
            <Link to={`/live-sessions/${session.id}`} className="btn-primary-lg live-join-btn">JOIN NOW</Link>
          ) : (
            <Countdown target={session.startTime} live={false} />
          )}
        </div>
      </div>
    </>
  );
}

export default function Dashboard(){
  const { profile, enrolled, wishlist, notifications } = useUser();
  const { getSkillById } = useSkillsById(enrolled.map(e => e.skillId));
  const { skills } = useSkills();
  const { categories } = useCategories();

  const withSkill = enrolled.map(e => ({ ...e, skill:getSkillById(e.skillId) })).filter(e=>e.skill);
  const inProgress = withSkill.filter(e => e.completedLessons.length < e.skill.lessons.length);
  const completed = withSkill.filter(e => e.completedLessons.length >= e.skill.lessons.length && e.skill.lessons.length>0);
  const unread = notifications.filter(n=>!n.read).length;

  // Illustrative weekly-activity shape until real per-lesson timestamps are
  // tracked — spreads total lessons completed across the week so the chart
  // isn't empty for a brand-new demo account.
  const totalLessonsDone = withSkill.reduce((sum,e)=>sum+e.completedLessons.length,0);
  const activityData = WEEK_LABELS.map((label,i)=>({
    label,
    value: totalLessonsDone===0 ? [1,2,1,3,2,4,2][i] : Math.max(1, Math.round(totalLessonsDone/3 + Math.sin(i*1.3)*1.5))
  }));

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

      <ScrollReveal className="dash-section-head" as="div"><h2>Weekly learning activity</h2></ScrollReveal>
      <div className="col-card" style={{marginBottom:'44px'}}>
        <MiniBarChart data={activityData} height={140} />
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
          <div className="dash-section-head"><h2>Recommended for you</h2><Link to="/recommendations">View all →</Link></div>
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
          <NextLiveSessionWidget />
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
