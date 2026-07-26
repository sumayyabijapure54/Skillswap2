import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout.jsx';

function passwordScore(pw){
  let score = 0;
  if(pw.length >= 8) score++;
  if(/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if(/\d/.test(pw)) score++;
  if(/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
}

export default function ResetPassword(){
  const navigate = useNavigate();
  const [form, setForm] = React.useState({ password:'', confirm:'' });
  const [errors, setErrors] = React.useState({});
  const [showPw, setShowPw] = React.useState(false);
  const [done, setDone] = React.useState(false);

  const set = (k,v)=> setForm(f=>({ ...f, [k]:v }));
  const score = passwordScore(form.password);
  const strengthLabel = ['Too weak','Weak','Okay','Good','Strong'][score];
  const strengthClass = score<=1 ? 'on-weak' : score===2 ? 'on-ok' : 'on-strong';

  const onSubmit = (e)=>{
    e.preventDefault();
    const e2 = {};
    if(form.password.length < 8) e2.password = 'Password must be at least 8 characters.';
    if(form.confirm !== form.password) e2.confirm = "Passwords don't match.";
    setErrors(e2);
    if(Object.keys(e2).length===0) setDone(true);
  };

  return (
    <AuthLayout variant="forgot">
      {!done ? (
        <>
          <div className="eyebrow">Account recovery</div>
          <h1>Set a new password</h1>
          <div className="sub">Choose something you haven't used on SkillSwap before.</div>

          <form onSubmit={onSubmit} noValidate>
            <div className="form-group">
              <label className="form-label">New password</label>
              <div className="form-input-wrap">
                <input className={`form-input ${errors.password?'err':''}`} type={showPw?'text':'password'} placeholder="Create a new password" value={form.password} onChange={e=>set('password', e.target.value)} />
                <button type="button" className="form-toggle-eye" onClick={()=>setShowPw(s=>!s)}>{showPw?'Hide':'Show'}</button>
              </div>
              {form.password && (
                <>
                  <div className="password-meter">
                    {[0,1,2,3].map(i=><i key={i} className={i<score?strengthClass:''}></i>)}
                  </div>
                  <div className="password-meter-label">{strengthLabel}</div>
                </>
              )}
              {errors.password && <div className="form-error">{errors.password}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Confirm new password</label>
              <input className={`form-input ${errors.confirm?'err':''}`} type={showPw?'text':'password'} placeholder="Re-enter your password" value={form.confirm} onChange={e=>set('confirm', e.target.value)} />
              {errors.confirm && <div className="form-error">{errors.confirm}</div>}
            </div>

            <button type="submit" className="btn-primary-lg btn-full">Reset password →</button>
          </form>
        </>
      ) : (
        <div className="success-box">
          <div className="tick">✓</div>
          <h1>Password updated</h1>
          <p>Your password has been reset. You can now log in with your new password.</p>
          <button className="btn-primary-lg btn-full" onClick={()=>navigate('/login')}>Continue to log in →</button>
        </div>
      )}
    </AuthLayout>
  );
}
