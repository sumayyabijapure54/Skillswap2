import React from 'react';
import DashboardLayout from '../components/DashboardLayout.jsx';
import { useUser } from '../context/UserContext.jsx';
import { categories } from '../data/skills.js';

export default function Profile(){
  const { profile, updateProfile } = useUser();
  const [form, setForm] = React.useState({
    name: profile.name || '',
    email: profile.email || '',
    bio: profile.bio || '',
    skillsOffered: (profile.skillsOffered || []).join(', '),
    skillsWanted: (profile.skillsWanted || []).join(', ')
  });
  const [saved, setSaved] = React.useState(false);

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
      </div>
    </DashboardLayout>
  );
}
