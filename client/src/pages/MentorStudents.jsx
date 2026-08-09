import React from 'react';
import { NavLink } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout.jsx';
import { SkeletonRow } from '../components/Skeleton.jsx';
import EmptyState from '../components/EmptyState.jsx';
import ScrollReveal from '../components/ScrollReveal.jsx';
import { api } from '../lib/api.js';

export default function MentorStudents(){
  const [courses, setCourses] = React.useState([]);
  const [students, setStudents] = React.useState(null);
  const [error, setError] = React.useState('');
  const [skillId, setSkillId] = React.useState('');
  const [q, setQ] = React.useState('');

  React.useEffect(() => {
    api.get('/api/skills/mentor/mine').then(data => setCourses(data.results || [])).catch(() => {});
  }, []);

  const load = React.useCallback(() => {
    setStudents(null);
    const params = new URLSearchParams();
    if (skillId) params.set('skillId', skillId);
    if (q.trim()) params.set('q', q.trim());
    api.get(`/api/bookings/mentor/students?${params.toString()}`)
      .then(data => setStudents(data.students || []))
      .catch(err => setError(err.message || 'Could not load students.'));
  }, [skillId, q]);

  React.useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [load]);

  return (
    <DashboardLayout title="Students" subtitle="Everyone who has booked a session with you.">
      <div className="mentor-tabs">
        <NavLink to="/mentor-dashboard" end>Overview</NavLink>
        <NavLink to="/mentor-courses">My Courses</NavLink>
        <NavLink to="/mentor-students" end className={({isActive})=>isActive?'active':''}>Students</NavLink>
        <NavLink to="/mentor-analytics">Analytics</NavLink>
      </div>

      <div className="mentor-toolbar">
        <input
          className="form-input"
          style={{ maxWidth: '280px' }}
          type="text"
          placeholder="Search by name or email"
          value={q}
          onChange={e => setQ(e.target.value)}
        />
        <select className="form-input" style={{ maxWidth: '260px' }} value={skillId} onChange={e => setSkillId(e.target.value)}>
          <option value="">All courses</option>
          {courses.map(c => <option value={c.id} key={c.id}>{c.title}</option>)}
        </select>
      </div>

      {error && <div className="form-error" style={{marginBottom:'20px'}}>{error}</div>}

      {students === null ? (
        <div className="invoice-table">
          {Array.from({length:5}).map((_,i)=><SkeletonRow key={i} />)}
        </div>
      ) : students.length === 0 ? (
        <EmptyState icon="🧑‍🎓" title="No students yet" text="No students match this filter yet." />
      ) : (
        <ScrollReveal as="div" className="students-table">
          <div className="students-row head">
            <span>Student</span><span>Course(s)</span><span>Sessions</span><span>Spent</span><span>Last session</span>
          </div>
          {students.map(s => (
            <div className="students-row" key={s.id}>
              <div>
                <div className="learner-name">{s.name}</div>
                <div className="learner-email">{s.email}</div>
              </div>
              <span>{(s.skills || []).map(sk => sk.skillTitle).join(', ')}</span>
              <span>{s.sessionsCount} <span style={{color:'var(--muted)'}}>({s.completedCount} done)</span></span>
              <span>${(s.totalSpent || 0).toFixed(2)}</span>
              <span>{s.lastSession ? new Date(s.lastSession).toLocaleDateString(undefined,{month:'short', day:'numeric', year:'numeric'}) : '—'}</span>
            </div>
          ))}
        </ScrollReveal>
      )}
    </DashboardLayout>
  );
}
