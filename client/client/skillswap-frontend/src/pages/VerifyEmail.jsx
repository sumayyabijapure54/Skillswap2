import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout.jsx';
import OtpInput from '../components/OtpInput.jsx';
import { useUser } from '../context/UserContext.jsx';

export default function VerifyEmail(){
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, verifyEmail } = useUser();
  const email = location.state?.email || profile.email || 'your email';

  const [code, setCode] = React.useState('');
  const [error, setError] = React.useState('');
  const [verifying, setVerifying] = React.useState(false);
  const [seconds, setSeconds] = React.useState(45);

  React.useEffect(()=>{
    if(seconds<=0) return;
    const t = setTimeout(()=>setSeconds(s=>s-1), 1000);
    return ()=>clearTimeout(t);
  }, [seconds]);

  const onVerify = (e)=>{
    e.preventDefault();
    if(code.length < 6){ setError('Enter all 6 digits.'); return; }
    setError('');
    setVerifying(true);
    // Mock verification — any complete 6-digit code succeeds. A real backend
    // would check this against the OTP it emailed/texted at sign-up.
    setTimeout(()=>{
      setVerifying(false);
      verifyEmail();
      navigate('/onboarding');
    }, 700);
  };

  const resend = ()=>{
    if(seconds>0) return;
    setSeconds(45);
    setCode('');
  };

  return (
    <AuthLayout variant="verify">
      <div className="eyebrow">Almost there</div>
      <h1>Verify your email</h1>
      <div className="sub">We sent a 6-digit code to <b style={{color:'var(--text)'}}>{email}</b></div>

      <form onSubmit={onVerify} noValidate>
        <div className="form-group">
          <OtpInput length={6} value={code} onChange={setCode} error={!!error} />
          {error && <div className="form-error">{error}</div>}
        </div>

        <div className="resend-row">
          {seconds>0 ? (
            <>Didn't get a code? Resend in {seconds}s</>
          ) : (
            <>Didn't get a code? <button type="button" onClick={resend}>Resend code</button></>
          )}
        </div>

        <button type="submit" className="btn-primary-lg btn-full" disabled={verifying}>
          {verifying ? 'Verifying…' : 'Verify & continue →'}
        </button>
      </form>

      <div className="sub" style={{marginTop:'22px', marginBottom:0}}>
        Wrong email? <Link to="/signup">Go back</Link>
      </div>
    </AuthLayout>
  );
}
