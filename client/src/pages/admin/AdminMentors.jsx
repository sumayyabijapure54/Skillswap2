import React from 'react';
import AdminLayout from '../../components/AdminLayout.jsx';
import { useAdmin } from '../../context/AdminContext.jsx';

// Admin-controlled "Top Mentors" — replaces the old homepage logic that
// auto-picked the 4 highest-rated mentors. The admin decides exactly who
// shows up on the homepage and in what order; nothing here is automatic.
// See server/src/controllers/topMentorsController.js for how "mentor" is
// derived from real Skill.mentorUser relationships.
export default function AdminMentors() {
  const { mentors, mentorsLoading, mentorsError, featureMentor, unfeatureMentor, reorderTopMentors } = useAdmin();
  const [pending, setPending] = React.useState(null); // id of the mentor an action is in flight for

  const featured = mentors.filter(m => m.isTopMentor).sort((a, b) => (a.topMentorOrder || 0) - (b.topMentorOrder || 0));
  const notFeatured = mentors.filter(m => !m.isTopMentor).sort((a, b) => (b.rating || 0) - (a.rating || 0));

  const run = async (id, fn) => {
    setPending(id);
    try { await fn(id); } catch { /* surfaced via mentorsError on next load if needed */ }
    setPending(null);
  };

  const move = async (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= featured.length) return;
    const reordered = [...featured];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    setPending(featured[index].id);
    try { await reorderTopMentors(reordered.map(m => m.id)); } catch { /* surfaced via mentorsError */ }
    setPending(null);
  };

  if (mentorsLoading) {
    return (
      <AdminLayout title="Top Mentors" subtitle="Choose exactly which mentors appear in the homepage Top Mentors section, and in what order.">
        <div className="dash-empty">Loading mentors…</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Top Mentors" subtitle="Choose exactly which mentors appear in the homepage Top Mentors section, and in what order.">
      {mentorsError && (
        <div className="notice-banner warn" style={{ marginBottom: '18px' }}>
          ⚠️ Couldn't load mentors from the server — {mentorsError}
        </div>
      )}

      <div className="dash-section-head"><h2>Featured ({featured.length})</h2></div>
      {featured.length === 0 ? (
        <div className="dash-empty" style={{ marginBottom: '40px' }}>
          No mentors featured yet — feature one from the list below to show it on the homepage.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '40px' }}>
          {featured.map((m, i) => {
            const busy = pending === m.id;
            return (
              <div className="col-card" key={m.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ marginBottom: '4px' }}>{m.name}</h3>
                    <div className="desc">{m.mainSkill || 'No claimed skill'} · ★ {m.rating} · {m.reviews} reviews</div>
                    <div style={{ fontSize: '11.5px', color: 'var(--muted)', marginTop: '4px' }}>Order: {m.topMentorOrder}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button className="btn-outline" style={{ padding: '6px 12px', fontSize: '12px' }} disabled={busy || i === 0} onClick={() => move(i, -1)}>↑</button>
                    <button className="btn-outline" style={{ padding: '6px 12px', fontSize: '12px' }} disabled={busy || i === featured.length - 1} onClick={() => move(i, 1)}>↓</button>
                    <button className="btn-outline" style={{ padding: '6px 14px', fontSize: '12px' }} disabled={busy} onClick={() => run(m.id, unfeatureMentor)}>Remove from Top Mentors</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="dash-section-head"><h2>All mentors ({notFeatured.length})</h2></div>
      {notFeatured.length === 0 ? (
        <div className="dash-empty">
          {mentors.length === 0 ? 'No registered mentors yet — mentors appear here once a real user claims or posts a skill.' : 'Every mentor is already featured.'}
        </div>
      ) : (
        <div className="invoice-table">
          <div className="invoice-row invoice-head" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr' }}>
            <span>Name</span><span>Main skill</span><span>Rating</span><span>Action</span>
          </div>
          {notFeatured.map(m => {
            const busy = pending === m.id;
            return (
              <div className="invoice-row" key={m.id} style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr' }}>
                <span><b>{m.name}</b></span>
                <span>{m.mainSkill || '—'}</span>
                <span>★ {m.rating} ({m.reviews})</span>
                <span>
                  <button className="btn-solid" style={{ padding: '6px 14px', fontSize: '12px' }} disabled={busy} onClick={() => run(m.id, featureMentor)}>
                    Feature as Top Mentor
                  </button>
                </span>
              </div>
            );
          })}
        </div>
      )}
    </AdminLayout>
  );
}
