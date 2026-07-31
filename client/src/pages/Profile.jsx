import React from 'react';
import DashboardLayout from '../components/DashboardLayout.jsx';
import { useUser } from '../context/UserContext.jsx';
import { useCategories } from '../lib/skillsApi.js';

const TEACHING_ROLES = [
  { key:'learn', icon:'🎓', title:'Learn', desc:'Pick up new skills from mentors and free lessons.' },
  { key:'teach', icon:'🧑‍🏫', title:'Teach', desc:'Share what you know and mentor other members.' },
  { key:'both', icon:'⇄', title:'Both', desc:'Learn some skills and teach others in exchange.' }
];

export default function Profile(){
  const { profile, updateProfile, completeOnboarding } = useUser();
  const { categories } = useCategories();
  const isAdmin = profile.role === 'admin';
  const [form, setForm] = React.useState({
    name: profile.name || '',
    email: profile.email || '',
    bio: profile.bio || '',
    skillsOffered: (profile.skillsOffered || []).join(', '),
    skillsWanted: (profile.skillsWanted || []).join(', ')
  });
  const [saved, setSaved] = React.useState(false);
  const [roleSaving, setRoleSaving] = React.useState(false);
  const [roleError, setRoleError] = React.useState('');
  const [roleSaved, setRoleSaved] = React.useState(false);

  const currentTeachingRole = ['learn','teach','both'].includes(profile.role) ? profile.role : null;

  const switchRole = async (key)=>{
    if (key === currentTeachingRole || roleSaving) return;
    setRoleSaving(true);
    setRoleError('');
    setRoleSaved(false);
    const res = await completeOnboarding({ role: key });
    setRoleSaving(false);
    if (!res.ok) { setRoleError(res.error || 'Could not update your role — please try again.'); return; }
    setRoleSaved(true);
  };

  const set = (k,v)=>{ setForm(f=>({ ...f, [k]:v })); setSaved(false); };

  const onSubmit = (e)=>{
    e.preventDefault();
    updateProfile({
      name: form.name,
      email: form.email,
      bio: form.bio,
      skillsOffered: form.skillsOffered.split(',').map(s=>s.trim()).filter(Boolean),
      skillsWanted: form.skillsWanted.split(',').map(s=>s.trim()).filter(Boolean)
    });
    setSaved(true);
  };

  const initials = (form.name || 'U').split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase();

  return (
    <DashboardLayout title="Profile" subtitle="This is what other members see when they view you.">
      <div className="profile-shell">
        <form className="col-card" onSubmit={onSubmit} style={{maxWidth:'640px'}}>
          <div className="profile-avatar-row">
            <div className="profile-avatar-big">{initials}</div>
            <div>
              <b style={{display:'block', fontSize:'14px'}}>Profile photo</b>
              <span style={{fontSize:'12px', color:'var(--muted)'}}>Using your initials for now — photo uploads aren't wired up yet.</span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Full name</label>
            <input className="form-input" type="text" value={form.name} onChange={e=>set('name', e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" value={form.email} onChange={e=>set('email', e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label">Bio</label>
            <textarea className="form-input" rows={4} placeholder="Tell the community a bit about yourself…" value={form.bio} onChange={e=>set('bio', e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label">Skills I can teach</label>
            <input className="form-input" type="text" placeholder="e.g. React, UI Design, Spanish" value={form.skillsOffered} onChange={e=>set('skillsOffered', e.target.value)} />
            <div className="form-hint">Comma-separated — used to match you as a mentor.</div>
          </div>

          <div className="form-group">
            <label className="form-label">Skills I want to learn</label>
            <input className="form-input" type="text" placeholder="e.g. Photography, SEO" value={form.skillsWanted} onChange={e=>set('skillsWanted', e.target.value)} />
          </div>

          <button type="submit" className="btn-primary-lg">Save changes</button>
          {saved && <span style={{marginLeft:'14px', fontSize:'13px', color:'var(--accent)'}}>✓ Saved</span>}
        </form>

        <div style={{display:'flex', flexDirection:'column', gap:'20px'}}>
          <div className="col-card" style={{alignSelf:'flex-start'}}>
            <h3>Teaching &amp; learning</h3>
            <div className="desc">Switch any time — teaching unlocks the Mentor Dashboard in your sidebar.</div>
            <div className="role-grid" style={{marginTop:'12px'}}>
              {TEACHING_ROLES.map(r=>(
                <div
                  key={r.key}
                  className={`role-card ${currentTeachingRole===r.key?'selected':''}`}
                  onClick={()=>switchRole(r.key)}
                  style={roleSaving?{opacity:0.6, pointerEvents:'none'}:{cursor:'pointer'}}
                >
                  <div className="ic">{r.icon}</div>
                  <b>{r.title}</b>
                  <span>{r.desc}</span>
                </div>
              ))}
            </div>
            {roleError && <div className="form-error" style={{marginTop:'10px'}}>{roleError}</div>}
            {roleSaved && !roleError && <span style={{display:'block', marginTop:'10px', fontSize:'13px', color:'var(--accent)'}}>✓ Role updated</span>}
          </div>

          <div className="col-card" style={{alignSelf:'flex-start'}}>
            <h3>Your interests</h3>
            <div className="desc">Set during onboarding — used for skill recommendations.</div>
            <div className="mentor-tags">
              {(profile.interests || []).length===0 && <span>None set</span>}
              {(profile.interests || []).map(k=>{
                const c = categories.find(c=>c.key===k);
                return <span key={k}>{c?.icon} {c?.label}</span>;
              })}
            </div>
          </div>

          <div className="col-card" style={{alignSelf:'flex-start'}}>
            <h3>Admin access</h3>
            <div className="desc">
              Demo-only toggle standing in for a real backend role system, where
              admin access would be granted by another admin, not by the account
              holder. Toggling this reveals the admin dashboard in the sidebar.
            </div>
            <label style={{display:'flex', alignItems:'center', gap:'10px', fontSize:'13.5px', cursor:'pointer'}}>
              <input
                type="checkbox"
                checked={isAdmin}
                onChange={(e)=> updateProfile({ role: e.target.checked ? 'admin' : 'learner' })}
              />
              Enable admin dashboard access
            </label>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
