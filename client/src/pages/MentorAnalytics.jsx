import React from 'react';
import { NavLink } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout.jsx';
import { api } from '../lib/api.js';
import { MiniLineChart, MiniBarChart } from '../components/MiniChart.jsx';
import { Skeleton } from '../components/Skeleton.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { useToast } from '../context/ToastContext.jsx';

const RANGE_OPTIONS = [
  { key: 3, label: '3 months' },
  { key: 6, label: '6 months' },
  { key: 12, label: '12 months' }
];

export default function MentorAnalytics(){
  const [months, setMonths] = React.useState(6);
  const [data, setData] = React.useState(null);
  const [error, setError] = React.useState('');
  const [refreshKey, setRefreshKey] = React.useState(0);
  const toast = useToast();

  React.useEffect(() => {
    setData(null);
    setError('');
    api.get(`/api/bookings/mentor/analytics?months=${months}`)
      .then(setData)
      .catch(err => {
        const msg = err.message || 'Could not load analytics.';
        setError(msg);
        toast.error(msg);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [months, refreshKey]);

  const ratingSeries = React.useMemo(() => {
    if (!data) return [];
    return data.ratingTrend.map(r => ({ label: r.label, value: r.avgRating || 0 }));
  }, [data]);

  return (
    <DashboardLayout title="Analytics" subtitle="How your courses are performing over time.">
      <div className="mentor-tabs">
        <NavLink to="/mentor-dashboard" end>Overview</NavLink>
        <NavLink to="/mentor-courses">My Courses</NavLink>
        <NavLink to="/mentor-students">Students</NavLink>
        <NavLink to="/mentor-analytics" end className={({isActive})=>isActive?'active':''}>Analytics</NavLink>
      </div>

      <div className="mentor-toolbar">
        <div className="tag-pills" style={{ marginBottom: 0 }}>
          {RANGE_OPTIONS.map(o => (
            <span key={o.key} onClick={() => setMonths(o.key)} style={months===o.key ? {color:'var(--accent)', borderColor:'var(--accent)'} : {}}>{o.label}</span>
          ))}
        </div>
      </div>

      {data === null && error ? (
        <EmptyState icon="⚠" title="Couldn't load analytics" text={error} ctaLabel="Try again" ctaOnClick={() => setRefreshKey(k => k + 1)} />
      ) : data === null ? (
        <>
          <div className="analytics-grid">
            <div className="col-card">
              <Skeleton height="16px" width="40%" style={{ marginBottom: '10px' }} />
              <Skeleton height="12px" width="70%" style={{ marginBottom: '16px' }} />
              <Skeleton height="160px" width="100%" radius="10px" />
            </div>
            <div className="col-card">
              <Skeleton height="16px" width="40%" style={{ marginBottom: '10px' }} />
              <Skeleton height="12px" width="70%" style={{ marginBottom: '16px' }} />
              <Skeleton height="160px" width="100%" radius="10px" />
            </div>
          </div>
          <div className="col-card" style={{ marginBottom: '32px' }}>
            <Skeleton height="16px" width="30%" style={{ marginBottom: '16px' }} />
            <Skeleton height="140px" width="100%" radius="10px" />
          </div>
        </>
      ) : (
        <>
          <div className="analytics-grid">
            <div className="col-card">
              <h3>Revenue</h3>
              <p className="desc">Monthly revenue from completed and booked sessions.</p>
              <MiniLineChart data={data.monthly} valueKey="revenue" labelKey="label" height={160} />
            </div>
            <div className="col-card">
              <h3>Enrollments</h3>
              <p className="desc">New bookings per month across all your courses.</p>
              <MiniBarChart data={data.monthly} valueKey="enrollments" labelKey="label" height={160} />
            </div>
          </div>

          <div className="col-card" style={{ marginBottom: '32px' }}>
            <h3>Average rating trend</h3>
            <p className="desc">Average review rating per month (blank where there were no reviews).</p>
            <MiniLineChart data={ratingSeries} valueKey="value" labelKey="label" height={140} />
          </div>

          <div className="dash-section-head"><h2>Performance by course</h2></div>
          {data.courses.length === 0 ? (
            <EmptyState icon="📊" title="No course activity yet" text="Once students enroll, their activity will show up here." />
          ) : (
            <div className="analytics-course-table">
              <div className="analytics-course-row head">
                <span>Course</span><span>Enrollments</span><span>Revenue</span><span>Students</span><span>Rating</span>
              </div>
              {data.courses.map(c => (
                <div className="analytics-course-row" key={c.skillId}>
                  <span><b>{c.skillTitle}</b></span>
                  <span>{c.enrollments}</span>
                  <span>${c.revenue.toFixed(2)}</span>
                  <span>{c.studentsCount}</span>
                  <span>{c.avgRating ? `★ ${c.avgRating}` : '—'}</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  );
}
