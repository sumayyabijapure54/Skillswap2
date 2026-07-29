import React from 'react';
import AdminLayout from '../../components/AdminLayout.jsx';
import { useAdmin } from '../../context/AdminContext.jsx';

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'mentor', label: 'Mentors' },
  { key: 'learner', label: 'Learners' },
  { key: 'suspended', label: 'Suspended' }
];

export default function AdminUsers() {
  const { users, suspendUser, reinstateUser } = useAdmin();
  const [filter, setFilter] = React.useState('all');

  const filtered = users.filter(u => {
    if (filter === 'all') return true;
    if (filter === 'suspended') return u.status === 'suspended';
    return u.role === filter;
  });

  return (
    <AdminLayout title="Users" subtitle="Manage learner and mentor accounts across the platform.">
      <div className="tag-pills" style={{ marginBottom: '22px' }}>
        {FILTERS.map(f => (
          <span key={f.key} onClick={() => setFilter(f.key)} style={filter === f.key ? { color: 'var(--accent)', borderColor: 'var(--accent)' } : {}}>{f.label}</span>
        ))}
      </div>

      <div className="invoice-table">
        <div className="invoice-row invoice-head" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr' }}>
          <span>Name</span><span>Role</span><span>Joined</span><span>Action</span>
        </div>
        {filtered.map(u => (
          <div className="invoice-row" key={u.id} style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr' }}>
            <span>
              <b>{u.name}</b>
              <div style={{ fontSize: '11.5px', color: 'var(--muted)' }}>{u.email}</div>
            </span>
            <span style={{ textTransform: 'capitalize' }}>{u.role}</span>
            <span>{new Date(u.joinedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            <span>
              {u.status === 'active' ? (
                <button className="btn-outline" style={{ padding: '6px 14px', fontSize: '12px' }} onClick={() => suspendUser(u.id)}>Suspend</button>
              ) : (
                <button className="btn-solid" style={{ padding: '6px 14px', fontSize: '12px' }} onClick={() => reinstateUser(u.id)}>Reinstate</button>
              )}
            </span>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
