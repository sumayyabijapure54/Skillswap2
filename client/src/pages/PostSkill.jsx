import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout.jsx';
import { useCategories } from '../lib/skillsApi.js';
import { api } from '../lib/api.js';

export default function PostSkill(){
  const navigate = useNavigate();
  const { categories } = useCategories();

  const [form, setForm] = React.useState({ type:'offer', category:'programming', title:'', description:'', tags:'' });
  const [errors, setErrors] = React.useState({});
  const [posted, setPosted] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  const set = (k,v)=>{ setForm(f=>({ ...f, [k]:v })); setErrors(e=>({ ...e, [k]:null })); };

  const onSubmit = async (e)=>{
    e.preventDefault();
    const errs = {};
    if(!form.title.trim()) errs.title = 'Give your post a short title.';
    if(!form.description.trim() || form.description.trim().length<20) errs.description = 'Add a bit more detail (20+ characters).';
    setErrors(errs);
    if(Object.keys(errs).length) return;

    setSubmitting(true);
    try{
      await api.post('/api/community', {
        type: form.type,
        category: form.category,
        title: form.title.trim(),
        text: form.description.trim(),
        tags: form.tags.split(',').map(t=>t.trim()).filter(Boolean)
      });
      setPosted(true);
    }catch(err){
      setErrors({ form: err.message });
    }
    setSubmitting(false);
  };

  if(posted){
    return (
      <DashboardLayout>
        <div className="success-box" style={{maxWidth:'480px', margin:'60px auto 0'}}>
          <div className="tick">✓</div>
          <h1>Your post is live</h1>
          <p>It's now visible in the Community Feed — other members can reach out to connect.</p>
          <button className="btn-primary-lg btn-full" onClick={()=>navigate('/community')}>View in Community Feed →</button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Post a Skill" subtitle="List a skill you can teach, or one you're hoping to learn — the community will find you.">
      <form className="col-card" onSubmit={onSubmit} style={{maxWidth:'640px'}}>
        <div className="form-group">
          <label className="form-label">What are you posting?</label>
          <div className="role-grid" style={{gridTemplateColumns:'1fr 1fr', gap:'12px'}}>
            <div className={`role-card ${form.type==='offer'?'selected':''}`} onClick={()=>set('type','offer')} style={{padding:'18px'}}>
              <div className="ic" style={{width:'36px', height:'36px', fontSize:'16px'}}>🎓</div>
              <b style={{fontSize:'14px'}}>I can teach this</b>
              <span style={{fontSize:'12px'}}>Offer a skill</span>
            </div>
            <div className={`role-card ${form.type==='request'?'selected':''}`} onClick={()=>set('type','request')} style={{padding:'18px'}}>
              <div className="ic" style={{width:'36px', height:'36px', fontSize:'16px'}}>🔍</div>
              <b style={{fontSize:'14px'}}>I want to learn this</b>
              <span style={{fontSize:'12px'}}>Request a skill</span>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Category</label>
          <select className="form-input" value={form.category} onChange={e=>set('category', e.target.value)}>
            {categories.map(c=><option value={c.key} key={c.key}>{c.icon} {c.label}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Title</label>
          <input className={`form-input ${errors.title?'err':''}`} type="text" placeholder="e.g. Will teach Python basics for help with Spanish practice" value={form.title} onChange={e=>set('title', e.target.value)} />
          {errors.title && <div className="form-error">{errors.title}</div>}
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea className={`form-input ${errors.description?'err':''}`} rows={5} placeholder="What can you offer, and what (if anything) are you hoping to get in return?" value={form.description} onChange={e=>set('description', e.target.value)} />
          {errors.description && <div className="form-error">{errors.description}</div>}
        </div>

        <div className="form-group">
          <label className="form-label">Tags</label>
          <input className="form-input" type="text" placeholder="Comma-separated, e.g. Python, Beginner-friendly" value={form.tags} onChange={e=>set('tags', e.target.value)} />
          <div className="form-hint">Helps other members find your post when searching.</div>
        </div>

        {errors.form && <div className="form-error">{errors.form}</div>}
        <button type="submit" className="btn-primary-lg" disabled={submitting}>{submitting ? 'Posting…' : 'Post to Community →'}</button>
      </form>
    </DashboardLayout>
  );
}
