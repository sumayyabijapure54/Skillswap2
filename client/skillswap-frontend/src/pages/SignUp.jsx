import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout.jsx';
import { useUser } from '../context/UserContext.jsx';

function passwordScore(pw){
  let score = 0;
  if(pw.length >= 8) score++;
  if(/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if(/\d/.test(pw)) score++;
  if(/[^A-Za-z0-9]/.test(pw)) score++;
  return score; // 0-4
}

export default function SignUp(){
  const navigate = useNavigate();
  const { signUp } = useUser();
  const [form, setForm] = React.useState({ name:'', email:'', password:'', confirm:'', agree:false });
  const [errors, setErrors] = React.useState({});
  const [showPw, setShowPw] = React.useState(false);

  const set = (k,v)=> setForm(f=>({ ...f, [k]:v }));

  const score = passwordScore(form.password);
  const strengthLabel = ['Too weak','Weak','Okay','Good','Strong'][score];
  const strengthClass = score<=1 ? 'on-weak' : score===2 ? 'on-ok' : 'on-strong';

  const validate = ()=>{
    const e = {};
    if(!form.name.trim()) e.name = 'Enter your full name.';
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email address.';
    if(form.password.length < 8) e.password = 'Password must be at least 8 characters.';
    if(form.confirm !== form.password) e.confirm = 'Passwords don\'t match.';
    if(!form.agree) e.agree = 'You must accept the Terms to continue.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = (e)=>{
    e.preventDefault();
    if(!validate()) return;
    signUp({ name: form.name, email: form.email });
    navigate('/verify-email', { state: { email: form.email } });
  };

  return (
    <AuthLayout variant="signup">
      <div className="eyebrow">Get started</div>
      <h1>Create your account</h1>
      <div className="sub">Already have an account? <Link to="/login">Log in</Link></div>

      <div className="social-row">
        <button className="social-btn" type="button">G Google</button>
        <button className="social-btn" type="button">in LinkedIn</button>
      </div>
      <div className="auth-divider">or sign up with email</div>

      <form onSubmit={onSubmit} noValidate>
        <div className="form-group">
          <label className="form-label">Full name</label>
          <input className={`form-input ${errors.name?'err':''}`} type="text" placeholder="Jordan Lee" value={form.name} onChange={e=>set('name', e.target.value)} />
          {errors.name && <div className="form-error">{errors.name}</div>}
        </div>

        <div className="form-group">
          <label className="form-label">Email</label>
          <input className={`form-input ${errors.email?'err':''}`} type="email" placeholder="you@example.com" value={form.email} onChange={e=>set('email', e.target.value)} />
          {errors.email && <div className="form-error">{errors.email}</div>}
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <div className="form-input-wrap">
            <input className={`form-input ${errors.password?'err':''}`} type={showPw?'text':'password'} placeholder="Create a password" value={form.password} onChange={e=>set('password', e.target.value)} />
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
          <label className="form-label">Confirm password</label>
          <input className={`form-input ${errors.confirm?'err':''}`} type={showPw?'text':'password'} placeholder="Re-enter your password" value={form.confirm} onChange={e=>set('confirm', e.target.value)} />
          {errors.confirm && <div className="form-error">{errors.confirm}</div>}
        </div>

        <div className="form-group">
          <label className="form-check">
            <input type="checkbox" checked={form.agree} onChange={e=>set('agree', e.target.checked)} />
            I agree to the <Link to="/legal">Terms of Service</Link> and <Link to="/legal">Privacy Policy</Link>
          </label>
          {errors.agree && <div className="form-error">{errors.agree}</div>}
        </div>

        <button type="submit" className="btn-primary-lg btn-full">Create account →</button>
      </form>
    </AuthLayout>
  );
}
