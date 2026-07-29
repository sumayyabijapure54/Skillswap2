import React from 'react';
import AdminLayout from '../../components/AdminLayout.jsx';
import { useAdmin } from '../../context/AdminContext.jsx';

const TYPE_LABEL = { message: 'Message', skill_post: 'Skill listing', review: 'Review' };

export default function AdminReports() {
  const { reports, resolveReport } = useAdmin();
  const [filter, setFilter] = React.useState('open');

  const filtered = filter === 'all' ? reports : reports.filter(r => r.status === filter);

  return (
    <AdminLayout title="Reports & Moderation" subtitle="Flagged messages, listings, and reviews awaiting a decision.">
      <div className="tag-pills" style={{ marginBottom: '22px' }}>
        {[{ key: 'open', label: 'Open' }, { key: 'resolved', label: 'Resolved' }, { key: 'all', label: 'All' }].map(f => (
          <span key={f.key} onClick={() => setFilter(f.key)} style={filter === f.key ? { color: 'var(--accent)', borderColor: 'var(--accent)' } : {}}>{f.label}</span>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="dash-empty">Nothing here.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filtered.map(r => (
            <div className="col-card" key={r.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
                <div>
                  <span className="badge" style={{ marginBottom: '10px' }}>{TYPE_LABEL[r.type] || r.type}</span>
                  <h3>Reported: {r.reportedUser}</h3>
                  <div className="desc" style={{ marginBottom: '6px' }}>{r.reason}</div>
                  <div style={{ fontSize: '11.5px', color: 'var(--muted)' }}>
                    Flagged {new Date(r.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </div>
                </div>
                {r.status === 'open' ? (
                  <button className="btn-solid" onClick={() => resolveReport(r.id)} style={{ alignSelf: 'flex-start' }}>Mark resolved</button>
                ) : (
                  <span style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '12.5px', alignSelf: 'flex-start' }}>Resolved</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
