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
import { Skeleton } from '../components/Skeleton.jsx';
import EmptyState from '../components/EmptyState.jsx';
import TiltCard from '../components/TiltCard.jsx';
import { api } from '../lib/api.js';

const WEEK_LABELS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const DATE_MONTH_LABELS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];

// Real upcoming (confirmed, not-yet-happened) 1:1 bookings — pulled from
// GET /api/bookings and filtered/sorted client-side (there's no
// `?when=upcoming` filter on this endpoint, unlike the mentor-side one).
// Distinct from NextLiveSessionWidget above, which covers group live
// sessions rather than these mentor 1:1 bookings.
function UpcomingSessionsWidget(){
  const [bookings, setBookings] = React.useState(undefined); // undefined = loading

  React.useEffect(() => {
    let alive = true;
    api.get('/api/bookings')
      .then(data => {
        if (!alive) return;
        const now = Date.now();
        const upcoming = (data.bookings || [])
          .filter(b => b.status === 'confirmed' && new Date(b.scheduledAt).getTime() > now)
          .sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt))
          .slice(0, 3);
        setBookings(upcoming);
      })
      .catch(() => { if (alive) setBookings([]); });
    return () => { alive = false; };
  }, []);

  if (bookings === undefined) {
    return (
      <div className="col-card">
        {Array.from({ length: 2 }).map((_, i) => (
          <div className="session-item" key={i}>
            <Skeleton height="40px" width="40px" radius="10px" />
            <div style={{ flex: 1 }}>
              <Skeleton height="12px" width="60%" style={{ marginBottom: '8px' }} />
              <Skeleton height="10px" width="40%" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="col-card">
        <EmptyState icon="📅" title="No sessions booked" text="Book time with a mentor to see it here." ctaLabel="Book a session" ctaTo="/book-session" />
      </div>
    );
  }

  return (
    <div className="col-card">
      {bookings.map(b => {
        const d = new Date(b.scheduledAt);
        return (
          <div className="session-item" key={b.id}>
            <div className="session-date">{d.getDate()}<br />{DATE_MONTH_LABELS[d.getMonth()]}</div>
            <div className="session-info">
              <b>{b.sessionType} with {b.mentorName}</b>
              <span>{d.toLocaleString(undefined, { hour: 'numeric', minute: '2-digit' })}</span>
            </div>
            <Link to={`/session/${b.id}`}><button>View</button></Link>
          </div>
        );
      })}
    </div>
  );
}

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
  const { getSkillById, loading: enrolledLoading } = useSkillsById(enrolled.map(e => e.skillId));
  const { skills, loading: skillsLoading } = useSkills();
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

      {enrolledLoading ? (
        <div className="continue-grid">
          {Array.from({ length: 3 }).map((_, i) => (
            <div className="continue-card" key={i}>
              <Skeleton height="13px" width="60%" style={{ marginBottom: '14px' }} />
              <Skeleton height="8px" width="100%" radius="100px" style={{ margin: '12px 0' }} />
              <Skeleton height="12px" width="80%" />
            </div>
          ))}
        </div>
      ) : inProgress.length===0 ? (
        <EmptyState
          icon="🎯"
          title="You haven't started a skill yet"
          text="Browse the catalog and pick something to learn."
          ctaLabel="Browse skills"
          ctaTo="/explore"
        />
      ) : (
        <div className="continue-grid">
          {inProgress.slice(0,3).map(e=>{
            const pct = Math.round((e.completedLessons.length / e.skill.lessons.length) * 100);
            return (
              <TiltCard as="div" className="continue-card" key={e.skillId}>
                <div className="cat">{categories.find(c=>c.key===e.skill.category)?.icon} {e.skill.title}</div>
                <div className="progress-track" style={{margin:'12px 0'}}><i style={{width:`${pct}%`}}></i></div>
                <div className="continue-meta">
                  <span>{e.completedLessons.length}/{e.skill.lessons.length} lessons · {pct}%</span>
                  <Link to={`/learn/${e.skillId}`} className="btn-solid">Resume →</Link>
                </div>
              </TiltCard>
            );
          })}
        </div>
      )}

      <div className="two-col-dash">
        <div>
          <div className="dash-section-head"><h2>Recommended for you</h2><Link to="/recommendations">View all →</Link></div>
          <div className="col-card">
            {skillsLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div className="feed-item" key={i}>
                  <Skeleton height="34px" width="34px" radius="50%" />
                  <div style={{ flex: 1 }}>
                    <Skeleton height="12px" width="70%" style={{ marginBottom: '8px' }} />
                    <Skeleton height="10px" width="45%" />
                  </div>
                </div>
              ))
            ) : recommended.map(s=>(
              <Link to={`/skill/${s.id}`} className="feed-item" key={s.id} style={{textDecoration:'none', color:'inherit'}}>
                <div className="dot">{categories.find(c=>c.key===s.category)?.icon}</div>
                <p><b>{s.title}</b><br /><span>★ {s.rating} · {s.students.toLocaleString()} students</span></p>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <NextLiveSessionWidget />
          <div className="dash-section-head"><h2>Upcoming sessions</h2><Link to="/sessions">View all →</Link></div>
          <UpcomingSessionsWidget />
        </div>
      </div>
    </DashboardLayout>
  );
}
