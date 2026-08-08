import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout.jsx';
import { SkeletonSkillCard } from '../components/Skeleton.jsx';
import { api } from '../lib/api.js';

// The client's static category list (data/skills.js) has drifted from the
// backend's real category set, so labels are looked up from the live
// /api/skills/meta/categories response instead (fetched below), falling
// back to a title-cased version of the raw key if that hasn't loaded yet.
function titleCase(key){ return key.replace(/-/g,' ').replace(/\b\w/g, c => c.toUpperCase()); }

export default function MentorCourses(){
  const [courses, setCourses] = React.useState(null);
  const [categories, setCategories] = React.useState([]);
  const [courseStats, setCourseStats] = React.useState({});
  const [error, setError] = React.useState('');
  const [deletingId, setDeletingId] = React.useState(null);
  const [confirmId, setConfirmId] = React.useState(null);

  const categoryLabel = (key) => categories.find(c => c.key === key)?.label || titleCase(key);

  const load = React.useCallback(() => {
    api.get('/api/skills/mentor/mine')
      .then(data => setCourses(data.results || []))
      .catch(err => setError(err.message || 'Could not load your courses.'));
  }, []);

  React.useEffect(() => {
    load();
    api.get('/api/skills/meta/categories').then(cats => setCategories(cats || [])).catch(() => {});
    // Skill.students is set to 0 at creation and never incremented by the
    // booking flow, so it can't be trusted for a live count — pull real
    // per-course enrollment/student numbers from the analytics endpoint's
    // (all-time, not time-boxed) per-course rollup instead.
    api.get('/api/bookings/mentor/analytics?months=1')
      .then(data => {
        const map = {};
        (data.courses || []).forEach(c => { map[c.skillId] = c; });
        setCourseStats(map);
      })
      .catch(() => {});
  }, [load]);

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await api.del(`/api/skills/${id}`);
      setCourses(cs => cs.filter(c => c.id !== id));
      setConfirmId(null);
    } catch (err) {
      setError(err.message || 'Could not delete this course.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <DashboardLayout title="My Courses" subtitle="Create, edit, and manage the courses you teach on SkillSwap.">
      <div className="mentor-tabs">
        <NavLink to="/mentor-dashboard" end className={({isActive})=>isActive?'active':''}>Overview</NavLink>
        <NavLink to="/mentor-courses" end className={({isActive})=>isActive?'active':''}>My Courses</NavLink>
        <NavLink to="/mentor-students">Students</NavLink>
        <NavLink to="/mentor-analytics">Analytics</NavLink>
      </div>

      <div className="mentor-toolbar">
        <p style={{color:'var(--muted)', fontSize:'13px', margin:0}}>
          {courses ? `${courses.length} course${courses.length===1?'':'s'}` : 'Loading…'}
        </p>
        <Link to="/mentor-courses/new" className="btn-primary-lg">＋ New course</Link>
      </div>

      {error && <div className="form-error" style={{marginBottom:'20px'}}>{error}</div>}

      {courses === null ? (
        <div className="course-grid">
          {Array.from({length:3}).map((_,i)=><SkeletonSkillCard key={i} />)}
        </div>
      ) : courses.length === 0 ? (
        <div className="dash-empty">
          You haven't created any courses yet. <Link to="/mentor-courses/new">Create your first course</Link> to start teaching.
        </div>
      ) : (
        <div className="course-grid">
          {courses.map(c => (
            <div className="course-card" key={c.id}>
              <div className="course-card-thumb">
                {c.lessons?.find(l => l.type === 'Video' && l.youtube?.thumbnail)?.youtube?.thumbnail ? (
                  <img src={c.lessons.find(l => l.type === 'Video' && l.youtube?.thumbnail).youtube.thumbnail} alt={c.title} />
                ) : (
                  <div className="no-video">No video uploaded</div>
                )}
              </div>
              <div className="course-card-body">
                <h3>{c.title}</h3>
                <div className="course-card-meta">
                  <span>{categoryLabel(c.category)}</span>
                  <span>{c.level}</span>
                </div>
                <div className="course-card-stats">
                  <span><b>{courseStats[c.id]?.studentsCount ?? 0}</b> students</span>
                  <span><b>★ {c.rating || '—'}</b></span>
                </div>
                <div className="course-card-actions">
                  <Link to={`/mentor-courses/${c.id}/edit`} className="btn-outline">Edit</Link>
                  <Link to={`/learn/${c.id}/quiz`} className="btn-outline">AI Quiz</Link>
                  {confirmId === c.id ? (
                    <button
                      className="btn-danger-outline"
                      disabled={deletingId === c.id}
                      onClick={() => handleDelete(c.id)}
                    >
                      {deletingId === c.id ? 'Deleting…' : 'Confirm delete'}
                    </button>
                  ) : (
                    <button className="btn-danger-outline" onClick={() => setConfirmId(c.id)}>Delete</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
