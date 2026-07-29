import React from 'react';
import { Link } from 'react-router-dom';

const REASONS = [
  { key:'support', label:'Account or technical support' },
  { key:'partnership', label:'Partnership inquiry' },
  { key:'press', label:'Press / media' },
  { key:'other', label:'Something else' }
];

export default function Contact(){
  const [form, setForm] = React.useState({ name:'', email:'', reason:'support', message:'' });
  const [errors, setErrors] = React.useState({});
  const [sent, setSent] = React.useState(false);

  const set = (k,v)=>{ setForm(f=>({ ...f, [k]:v })); setErrors(e=>({ ...e, [k]:null })); };

  const onSubmit = (e)=>{
    e.preventDefault();
    const errs = {};
    if(!form.name.trim()) errs.name = 'Enter your name.';
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email.';
    if(!form.message.trim() || form.message.trim().length<10) errs.message = 'Add a bit more detail (10+ characters).';
    setErrors(errs);
    if(Object.keys(errs).length===0) setSent(true);
  };

  return (
    <div className="page-header">
      <div className="eyebrow">Contact</div>
      <h1>Get in <span className="g">touch</span></h1>
      <p>Have a question, a partnership idea, or found a bug? We read every message.</p>

      <div className="two-col-dash" style={{marginTop:'40px', alignItems:'flex-start'}}>
        <div className="col-card" style={{maxWidth:'560px'}}>
          {!sent ? (
            <form onSubmit={onSubmit}>
              <div className="form-group">
                <label className="form-label">Name</label>
                <input className={`form-input ${errors.name?'err':''}`} type="text" value={form.name} onChange={e=>set('name', e.target.value)} placeholder="Your name" />
                {errors.name && <div className="form-error">{errors.name}</div>}
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className={`form-input ${errors.email?'err':''}`} type="email" value={form.email} onChange={e=>set('email', e.target.value)} placeholder="you@example.com" />
                {errors.email && <div className="form-error">{errors.email}</div>}
              </div>
              <div className="form-group">
                <label className="form-label">Reason</label>
                <select className="form-input" value={form.reason} onChange={e=>set('reason', e.target.value)}>
                  {REASONS.map(r=><option value={r.key} key={r.key}>{r.label}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Message</label>
                <textarea className={`form-input ${errors.message?'err':''}`} rows={5} value={form.message} onChange={e=>set('message', e.target.value)} placeholder="How can we help?" />
                {errors.message && <div className="form-error">{errors.message}</div>}
              </div>
              <button type="submit" className="btn-primary-lg">Send message →</button>
            </form>
          ) : (
            <div className="success-box" style={{padding:'10px 0'}}>
              <div className="tick">✓</div>
              <h1 style={{fontSize:'1.4rem'}}>Message sent</h1>
              <p>Thanks, {form.name.split(' ')[0]} — our team typically replies within one business day.</p>
              <Link to="/" className="btn-ghost-lg" style={{display:'inline-block'}}>← Back to Home</Link>
            </div>
          )}
        </div>

        <div>
          <div className="col-card" style={{marginBottom:'20px'}}>
            <h3>Other ways to reach us</h3>
            <ul style={{listStyle:'none', marginTop:'10px'}}>
              <li style={{padding:'8px 0', borderBottom:'1px solid var(--border)', fontSize:'13px', color:'var(--muted)'}}>General support <br /><b style={{color:'var(--text)'}}>support@skillswap.example</b></li>
              <li style={{padding:'8px 0', borderBottom:'1px solid var(--border)', fontSize:'13px', color:'var(--muted)'}}>Partnerships <br /><b style={{color:'var(--text)'}}>partners@skillswap.example</b></li>
              <li style={{padding:'8px 0', fontSize:'13px', color:'var(--muted)'}}>Press <br /><b style={{color:'var(--text)'}}>press@skillswap.example</b></li>
            </ul>
          </div>
          <div className="col-card">
            <h3>Looking for quick answers?</h3>
            <div className="desc">Most questions are already answered in our Help Center.</div>
            <Link to="/help" className="btn-outline" style={{display:'inline-block', marginTop:'6px'}}>Visit Help Center →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
