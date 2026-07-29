import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout.jsx';

export default function ForgotPassword(){
  const navigate = useNavigate();
  const [email, setEmail] = React.useState('');
  const [error, setError] = React.useState('');
  const [sent, setSent] = React.useState(false);

  const onSubmit = (e)=>{
    e.preventDefault();
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){ setError('Enter a valid email address.'); return; }
    setError('');
    setSent(true);
  };

  return (
    <AuthLayout variant="forgot">
      {!sent ? (
        <>
          <div className="eyebrow">Account recovery</div>
          <h1>Forgot your password?</h1>
          <div className="sub">Remembered it after all? <Link to="/login">Back to log in</Link></div>

          <form onSubmit={onSubmit} noValidate>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className={`form-input ${error?'err':''}`} type="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} />
              {error && <div className="form-error">{error}</div>}
              <div className="form-hint">We'll send a password reset link to this address.</div>
            </div>
            <button type="submit" className="btn-primary-lg btn-full">Send reset link →</button>
          </form>
        </>
      ) : (
        <div className="success-box">
          <div className="tick">✓</div>
          <h1>Check your email</h1>
          <p>We've sent a password reset link to <b style={{color:'var(--text)'}}>{email}</b>. It expires in 30 minutes.</p>
          <button className="btn-primary-lg btn-full" onClick={()=>navigate('/reset-password')}>Continue to reset password →</button>
          <div className="resend-row" style={{textAlign:'center'}}>
            Didn't get it? <button onClick={()=>setSent(false)}>Try a different email</button>
          </div>
        </div>
      )}
    </AuthLayout>
  );
}
