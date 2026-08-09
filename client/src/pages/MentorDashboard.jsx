import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout.jsx';
import { useUser } from '../context/UserContext.jsx';
import { api } from '../lib/api.js';
import { mentorTodayLiveSessions } from '../lib/liveSessionsApi.js';
import { SkeletonRow, Skeleton } from '../components/Skeleton.jsx';

export default function MentorDashboard(){
  const { profile } = useUser();
  const firstName = (profile.name || 'there').split(' ')[0];

  const [stats, setStats] = React.useState(null);
  const [courses, setCourses] = React.useState(null);
  const [upcoming, setUpcoming] = React.useState(null);
  const [reviews, setReviews] = React.useState(null);
  const [liveToday, setLiveToday] = React.useState(null);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    Promise.all([
      api.get('/api/bookings/mentor/earnings'),
      api.get('/api/skills/mentor/mine'),
      api.get('/api/bookings/mentor?when=upcoming&limit=5'),
      api.get('/api/reviews/mentor?limit=3'),
      mentorTodayLiveSessions().catch(() => ({ liveSessions: [] }))
    ]).then(([earnings, mine, bookings, reviewsRes, liveRes]) => {
      setStats(earnings);
      setCourses(mine.results || []);
      setUpcoming(bookings.bookings || []);
      setReviews(reviewsRes.reviews || []);
      setLiveToday(liveRes.liveSessions || []);
    }).catch(err => setError(err.message || 'Could not load your mentor dashboard.'));
  }, []);

  return (
    <DashboardLayout>
      <div className="dash-header">
        <h1>Mentor overview, {firstName} 🧑‍🏫</h1>
        <p>How your teaching is going on SkillSwap.</p>
      </div>

      <div className="mentor-tabs">
        <NavLink to="/mentor-dashboard" end className={({isActive})=>isActive?'active':''}>Overview</NavLink>
        <NavLink to="/mentor-courses">My Courses</NavLink>
        <NavLink to="/mentor-students">Students</NavLink>
        <NavLink to="/mentor-analytics">Analytics</NavLink>
      </div>

      {error && <div className="form-error" style={{marginBottom:'20px'}}>{error}</div>}

      <div className="dash-stat-row">
        <div className="dash-stat"><b>{stats ? `$${stats.earnings}` : '—'}</b><span>Total earnings</span></div>
        <div className="dash-stat"><b>{stats ? stats.studentsCount : '—'}</b><span>Students taught</span></div>
        <div className="dash-stat"><b>{stats ? stats.upcomingCount : '—'}</b><span>Upcoming sessions</span></div>
        <div className="dash-stat"><b>{stats ? (stats.avgRating ? `★ ${stats.avgRating}` : '—') : '—'}</b><span>Average rating</span></div>
      </div>

      {courses !== null && courses.length === 0 && (
        <div className="guest-banner" style={{marginBottom:'30px'}}>
          You haven't created any courses yet — <Link to="/mentor-courses/new">create your first course</Link> so students can find you.
        </div>
      )}

      {liveToday !== null && liveToday.length > 0 && (
        <>
          <div className="dash-section-head"><h2>Today's live sessions</h2><Link to="/live-sessions">Manage →</Link></div>
          <div className="my-learning-list" style={{marginBottom:'40px'}}>
            {liveToday.map(s => (
              <div className="learning-row" key={s.id}>
                <div className="learning-row-icon">🔴</div>
                <div className="learning-row-info">
                  <b>{s.title}</b>
                  <span>{s.skillTitle} · {new Date(s.startTime).toLocaleTimeString(undefined,{hour:'numeric',minute:'2-digit'})}</span>
                  <span className={`status-badge status-${s.status}`}>{s.status === 'live' ? 'Live Now' : 'Scheduled'}</span>
                </div>
                <Link to={`/live-sessions/${s.id}`} className={s.status === 'live' ? 'btn-primary-lg live-join-btn' : 'btn-outline'}>
                  {s.status === 'live' ? 'Open' : 'Details'}
                </Link>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="dash-section-head"><h2>Upcoming teaching sessions</h2><Link to="/mentor-students">View students →</Link></div>
      {upcoming === null ? (
        <div className="my-learning-list" style={{marginBottom:'40px'}}>
          {Array.from({ length: 3 }).map((_, i) => <SkeletonRow key={i} />)}
        </div>
      ) : upcoming.length === 0 ? (
        <div className="dash-empty">No upcoming teaching sessions booked yet.</div>
      ) : (
        <div className="my-learning-list" style={{marginBottom:'40px'}}>
          {upcoming.map(s => {
            const initials = (s.learner?.name || 'S').split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase();
            return (
              <div className="learning-row" key={s.id}>
                <div className="learning-row-icon">{initials}</div>
                <div className="learning-row-info">
                  <b>{s.skillTitle}{s.sessionType ? ` · ${s.sessionType}` : ''}</b>
                  <span>with {s.learner?.name || 'Student'} · {new Date(s.scheduledAt).toLocaleDateString(undefined,{month:'short', day:'numeric'})}, {new Date(s.scheduledAt).toLocaleTimeString(undefined,{hour:'numeric', minute:'2-digit'})}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="two-col-dash">
        <div>
          <div className="dash-section-head"><h2>What you teach</h2><Link to="/mentor-courses">Manage →</Link></div>
          <div className="col-card">
            {courses === null ? (
              <Skeleton height="28px" width="90%" style={{margin:0}} />
            ) : courses.length === 0 ? (
              <div className="dash-empty" style={{margin:0}}>Nothing listed yet.</div>
            ) : (
              <div className="mentor-tags">{courses.map(c=><span key={c.id}>{c.title}</span>)}</div>
            )}
          </div>
        </div>
        <div>
          <div className="dash-section-head"><h2>Recent reviews</h2><Link to="/mentor-analytics">See analytics →</Link></div>
          <div className="col-card">
            {reviews === null ? (
              <Skeleton height="50px" width="100%" style={{margin:0}} />
            ) : reviews.length === 0 ? (
              <div className="dash-empty" style={{margin:0}}>No reviews yet.</div>
            ) : (
              reviews.map(r => (
                <div className="quote" key={r.id}>
                  <p>"{r.comment || 'No comment left.'}"</p>
                  <div className="who"><span>{r.reviewer?.name || 'Student'}</span><span>{'★'.repeat(r.rating)}</span></div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
