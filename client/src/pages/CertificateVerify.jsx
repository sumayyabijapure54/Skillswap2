import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../lib/api.js';

// Public, no-login page — lets anyone (an employer, a third party) confirm a
// SkillSwap certificate is real by its certificate number. Backed by
// GET /api/certificates/verify/:certificateNumber, which only returns the
// non-sensitive fields needed to confirm authenticity (no account details).
export default function CertificateVerify(){
  const { certificateNumber } = useParams();
  const navigate = useNavigate();
  const [input, setInput] = React.useState(certificateNumber || '');
  const [result, setResult] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [checked, setChecked] = React.useState(false);

  const runCheck = React.useCallback((number) => {
    const trimmed = (number || '').trim();
    if (!trimmed) return;
    setLoading(true);
    setChecked(false);
    api.get(`/api/certificates/verify/${encodeURIComponent(trimmed)}`)
      .then((data) => { setResult(data); })
      .catch((err) => {
        // 404 from a real "not found" response still has a JSON body with
        // valid:false — api.js throws on non-2xx, so surface a matching shape.
        setResult(err.data && typeof err.data.valid === 'boolean'
          ? err.data
          : { valid: false, message: 'No certificate found with that number' });
      })
      .finally(() => { setLoading(false); setChecked(true); });
  }, []);

  React.useEffect(() => {
    if (certificateNumber) runCheck(certificateNumber);
  }, [certificateNumber, runCheck]);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    navigate(`/verify/${encodeURIComponent(input.trim())}`);
  };

  return (
    <div className="page-header" style={{maxWidth:'640px'}}>
      <div className="eyebrow">Public verification</div>
      <h1>Verify a <span className="g">Certificate</span></h1>
      <p>Paste a SkillSwap certificate number below to confirm it's genuine. No account required.</p>

      <form className="explore-search" style={{maxWidth:'480px', marginTop:'24px', marginBottom:'0'}} onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="e.g. SS-7F3K2A9Q"
          value={input}
          onChange={e=>setInput(e.target.value)}
          autoFocus
        />
        <button type="submit" style={{border:'none', background:'none', cursor:'pointer'}}>⌕</button>
      </form>

      {loading && (
        <div className="dash-empty" style={{marginTop:'32px', maxWidth:'480px'}}>Checking…</div>
      )}

      {!loading && checked && result && (
        result.valid ? (
          <div className="certificate-card" style={{marginTop:'32px', maxWidth:'560px'}}>
            <div className="certificate-seal">✅</div>
            <div className="certificate-eyebrow">Verified certificate</div>
            <h1 className="certificate-name">{result.holderName}</h1>
            <p className="certificate-line">has successfully completed</p>
            <h2 className="certificate-skill">{result.skillTitle}</h2>
            <p className="certificate-line">led by {result.mentorName}</p>
            <div className="certificate-footer">
              <div>
                <span>Issued</span>
                <b>{new Date(result.issuedAt).toLocaleDateString(undefined, { month:'long', day:'numeric', year:'numeric' })}</b>
              </div>
              <div>
                <span>Certificate ID</span>
                <b>{result.certificateNumber}</b>
              </div>
              <div>
                <span>Status</span>
                <b style={{color:'var(--accent)'}}>Genuine</b>
              </div>
            </div>
          </div>
        ) : (
          <div className="dash-empty" style={{marginTop:'32px', maxWidth:'480px', color:'var(--danger)'}}>
            ❌ {result.message || "This certificate number doesn't match any issued certificate."}
          </div>
        )
      )}

      <div className="cta-row" style={{marginTop:'32px'}}>
        <Link to="/" className="btn-ghost-lg">← Back to Home</Link>
      </div>
    </div>
  );
}
