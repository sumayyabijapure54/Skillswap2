import React from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout.jsx';
import { useAdmin } from '../../context/AdminContext.jsx';
import { useSkills } from '../../lib/skillsApi.js';
import { MiniLineChart } from '../../components/MiniChart.jsx';

function weeklySignups(users) {
  const now = new Date();
  const weeks = Array.from({ length: 6 }, (_, i) => {
    const start = new Date(now); start.setDate(now.getDate() - (5 - i) * 7 - 6);
    const end = new Date(now); end.setDate(now.getDate() - (5 - i) * 7);
    const count = users.filter(u => {
      const joined = new Date(u.joinedAt);
      return joined >= start && joined <= end;
    }).length;
    return { label: `W${i + 1}`, value: count };
  });
  return weeks;
}

export default function AdminOverview() {
  const { users, mentorApplications, reports } = useAdmin();
  const { count: skillsCount } = useSkills();

  const activeUsers = users.filter(u => u.status === 'active').length;
  const suspended = users.filter(u => u.status === 'suspended').length;
  const mentors = users.filter(u => u.role === 'mentor').length;
  const pendingApps = mentorApplications.filter(a => a.status === 'pending').length;
  const openReports = reports.filter(r => r.status === 'open').length;

  const recentUsers = [...users].sort((a, b) => new Date(b.joinedAt) - new Date(a.joinedAt)).slice(0, 5);
  const signupTrend = weeklySignups(users);

  return (
    <AdminLayout title="Admin Overview" subtitle="Platform-wide health at a glance.">
      <div className="dash-stat-row">
        <div className="dash-stat"><b>{users.length}</b><span>Total users</span></div>
        <div className="dash-stat"><b>{mentors}</b><span>Active mentors</span></div>
        <div className="dash-stat"><b>{skillsCount}</b><span>Published skills</span></div>
        <div className="dash-stat"><b>{suspended}</b><span>Suspended accounts</span></div>
      </div>

      <div className="dash-section-head"><h2>Signups, last 6 weeks</h2></div>
      <div className="col-card" style={{ marginBottom: '40px' }}>
        <MiniLineChart data={signupTrend} />
      </div>

      <div className="two-col-dash">
        <div>
          <div className="dash-section-head">
            <h2>Pending mentor applications</h2>
            {pendingApps > 0 && <Link to="/admin/mentor-applications">Review all →</Link>}
          </div>
          <div className="col-card">
            {pendingApps === 0 ? (
              <div style={{ color: 'var(--muted)', fontSize: '13px' }}>No applications waiting on review.</div>
            ) : (
              mentorApplications.filter(a => a.status === 'pending').slice(0, 3).map(a => (
                <div className="feed-item" key={a.id}>
                  <div className="dot">🧑‍🏫</div>
                  <p><b>{a.name}</b><br /><span>Wants to teach "{a.skill}"</span></p>
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <div className="dash-section-head">
            <h2>Open reports</h2>
            {openReports > 0 && <Link to="/admin/reports">Review all →</Link>}
          </div>
          <div className="col-card">
            {openReports === 0 ? (
              <div style={{ color: 'var(--muted)', fontSize: '13px' }}>Nothing flagged right now.</div>
            ) : (
              reports.filter(r => r.status === 'open').slice(0, 3).map(r => (
                <div className="feed-item" key={r.id}>
                  <div className="dot">🚩</div>
                  <p><b>{r.reportedUser}</b><br /><span>{r.reason}</span></p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="dash-section-head">
        <h2>Recently joined</h2>
        <Link to="/admin/users">View all users →</Link>
      </div>
      <div className="invoice-table">
        <div className="invoice-row invoice-head">
          <span>Name</span><span>Role</span><span>Joined</span><span>Status</span>
        </div>
        {recentUsers.map(u => (
          <div className="invoice-row" key={u.id}>
            <span><b>{u.name}</b><div style={{ fontSize: '11.5px', color: 'var(--muted)' }}>{u.email}</div></span>
            <span style={{ textTransform: 'capitalize' }}>{u.role}</span>
            <span>{new Date(u.joinedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            <span style={{ color: u.status === 'active' ? 'var(--accent)' : 'var(--danger)', fontWeight: 700, textTransform: 'capitalize' }}>{u.status}</span>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
