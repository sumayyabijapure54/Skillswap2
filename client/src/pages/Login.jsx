import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout.jsx';
import { useUser } from '../context/UserContext.jsx';
import SocialLoginButtons from '../components/SocialLoginButtons.jsx';

export default function Login(){
  const navigate = useNavigate();
  const location = useLocation();
  const { logIn } = useUser();
  const [form, setForm] = React.useState({ email:'', password:'', remember:true });
  const [errors, setErrors] = React.useState({});
  const [showPw, setShowPw] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  const set = (k,v)=> setForm(f=>({ ...f, [k]:v }));

  const validate = ()=>{
    const e = {};
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email address.';
    if(!form.password) e.password = 'Enter your password.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (e)=>{
    e.preventDefault();
    if(!validate()) return;
    setSubmitting(true);
    const res = await logIn({ email: form.email, password: form.password });
    setSubmitting(false);
    if(!res.ok){
      setErrors({ form: res.error || 'Invalid email or password.' });
      return;
    }
    if(!res.verified) navigate('/verify-email', { state: { email: form.email } });
    else if(!res.onboarded) navigate('/onboarding');
    else navigate(location.state?.from || '/dashboard');
  };

  return (
    <AuthLayout variant="login">
      <div className="eyebrow">Welcome back</div>
      <h1>Log in to SkillSwap</h1>
      <div className="sub">New here? <Link to="/signup">Create an account</Link></div>

      <SocialLoginButtons onResult={(res)=>{
        if(!res.ok){ setErrors({ form: res.error || 'Social login failed.' }); return; }
        if(!res.verified) navigate('/verify-email');
        else if(!res.onboarded) navigate('/onboarding');
        else navigate(location.state?.from || '/dashboard');
      }} />
      <div className="auth-divider">or log in with email</div>

      <form onSubmit={onSubmit} noValidate>
        {errors.form && <div className="form-error" style={{marginBottom:'14px'}}>{errors.form}</div>}
        <div className="form-group">
          <label className="form-label">Email</label>
          <input className={`form-input ${errors.email?'err':''}`} type="email" placeholder="you@example.com" value={form.email} onChange={e=>set('email', e.target.value)} />
          {errors.email && <div className="form-error">{errors.email}</div>}
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <div className="form-input-wrap">
            <input className={`form-input ${errors.password?'err':''}`} type={showPw?'text':'password'} placeholder="Your password" value={form.password} onChange={e=>set('password', e.target.value)} />
            <button type="button" className="form-toggle-eye" onClick={()=>setShowPw(s=>!s)}>{showPw?'Hide':'Show'}</button>
          </div>
          {errors.password && <div className="form-error">{errors.password}</div>}
        </div>

        <div className="form-row-between">
          <label className="form-check">
            <input type="checkbox" checked={form.remember} onChange={e=>set('remember', e.target.checked)} />
            Remember me
          </label>
          <Link to="/forgot-password">Forgot password?</Link>
        </div>

        <button type="submit" className="btn-primary-lg btn-full" disabled={submitting}>{submitting ? 'Logging in…' : 'Log in →'}</button>
      </form>
    </AuthLayout>
  );
}
