import React from 'react';
import AdminLayout from '../../components/AdminLayout.jsx';
import { useAdmin } from '../../context/AdminContext.jsx';
import { useCategories } from '../../lib/skillsApi.js';

export default function AdminMentorApplications() {
  const { mentorApplications, approveMentorApplication, rejectMentorApplication } = useAdmin();
  const { categories } = useCategories();

  const pending = mentorApplications.filter(a => a.status === 'pending');
  const decided = mentorApplications.filter(a => a.status !== 'pending');

  return (
    <AdminLayout title="Mentor Applications" subtitle="Review and approve members applying to teach a skill.">
      <div className="dash-section-head"><h2>Pending review ({pending.length})</h2></div>

      {pending.length === 0 ? (
        <div className="dash-empty" style={{ marginBottom: '40px' }}>Nothing waiting on review.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px' }}>
          {pending.map(a => {
            const cat = categories.find(c => c.key === a.category);
            return (
              <div className="col-card" key={a.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
                  <div>
                    <h3>{a.name} — {cat?.icon} {a.skill}</h3>
                    <div className="desc">{a.bio}</div>
                    <div style={{ fontSize: '11.5px', color: 'var(--muted)' }}>
                      Submitted {new Date(a.submittedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <button className="btn-outline" onClick={() => rejectMentorApplication(a.id)}>Reject</button>
                    <button className="btn-solid" onClick={() => approveMentorApplication(a.id)}>Approve</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {decided.length > 0 && (
        <>
          <div className="dash-section-head"><h2>Past decisions</h2></div>
          <div className="invoice-table">
            <div className="invoice-row invoice-head" style={{ gridTemplateColumns: '2fr 1fr 1fr' }}>
              <span>Applicant</span><span>Skill</span><span>Decision</span>
            </div>
            {decided.map(a => (
              <div className="invoice-row" key={a.id} style={{ gridTemplateColumns: '2fr 1fr 1fr' }}>
                <span><b>{a.name}</b></span>
                <span>{a.skill}</span>
                <span style={{ color: a.status === 'approved' ? 'var(--accent)' : 'var(--danger)', fontWeight: 700, textTransform: 'capitalize' }}>{a.status}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </AdminLayout>
  );
}
