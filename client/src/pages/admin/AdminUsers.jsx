import React from 'react';
import AdminLayout from '../../components/AdminLayout.jsx';
import { useAdmin } from '../../context/AdminContext.jsx';
import { useUser } from '../../context/UserContext.jsx';

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'mentor', label: 'Mentors' },
  { key: 'learner', label: 'Learners' },
  { key: 'suspended', label: 'Suspended' }
];

export default function AdminUsers() {
  const { users, loading, error, suspendUser, reinstateUser, makeAdmin, revokeAdmin } = useAdmin();
  const { profile } = useUser();
  const [filter, setFilter] = React.useState('all');
  const [pending, setPending] = React.useState(null); // id of the row an action is in flight for

  const filtered = users.filter(u => {
    if (filter === 'all') return true;
    if (filter === 'suspended') return u.status === 'suspended';
    return u.role === filter;
  });

  const run = async (id, fn) => {
    setPending(id);
    try { await fn(id); } catch { /* surfaced via context error on next load if needed */ }
    setPending(null);
  };

  return (
    <AdminLayout title="Users" subtitle="Manage learner and mentor accounts across the platform.">
      {error && (
        <div className="notice-banner warn" style={{ marginBottom: '18px' }}>
          ⚠️ Couldn't load users from the server — {error}
        </div>
      )}

      <div className="tag-pills" style={{ marginBottom: '22px' }}>
        {FILTERS.map(f => (
          <span key={f.key} onClick={() => setFilter(f.key)} style={filter === f.key ? { color: 'var(--accent)', borderColor: 'var(--accent)' } : {}}>{f.label}</span>
        ))}
      </div>

      {loading ? (
        <div className="dash-empty">Loading users…</div>
      ) : filtered.length === 0 ? (
        <div className="dash-empty">No users match this filter.</div>
      ) : (
        <div className="invoice-table">
          <div className="invoice-row invoice-head" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr' }}>
            <span>Name</span><span>Role</span><span>Joined</span><span>Admin</span><span>Action</span>
          </div>
          {filtered.map(u => {
            const isSelf = u.id === profile.id;
            const busy = pending === u.id;
            return (
              <div className="invoice-row" key={u.id} style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr' }}>
                <span>
                  <b>{u.name}</b>
                  <div style={{ fontSize: '11.5px', color: 'var(--muted)' }}>{u.email}</div>
                </span>
                <span style={{ textTransform: 'capitalize' }}>{u.role}</span>
                <span>{new Date(u.joinedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                <span>
                  {u.isAdmin ? (
                    <button
                      className="btn-outline"
                      style={{ padding: '6px 14px', fontSize: '12px' }}
                      disabled={isSelf || busy}
                      title={isSelf ? "You can't revoke your own admin access" : undefined}
                      onClick={() => run(u.id, revokeAdmin)}
                    >
                      Revoke admin
                    </button>
                  ) : (
                    <button
                      className="btn-outline"
                      style={{ padding: '6px 14px', fontSize: '12px' }}
                      disabled={busy}
                      onClick={() => run(u.id, makeAdmin)}
                    >
                      Make admin
                    </button>
                  )}
                </span>
                <span>
                  {u.status === 'active' ? (
                    <button className="btn-outline" style={{ padding: '6px 14px', fontSize: '12px' }} disabled={isSelf || busy} onClick={() => run(u.id, suspendUser)}>Suspend</button>
                  ) : (
                    <button className="btn-solid" style={{ padding: '6px 14px', fontSize: '12px' }} disabled={busy} onClick={() => run(u.id, reinstateUser)}>Reinstate</button>
                  )}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </AdminLayout>
  );
}
