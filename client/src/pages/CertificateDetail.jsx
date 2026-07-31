import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useUser } from '../context/UserContext.jsx';
import { useSkill } from '../lib/skillsApi.js';
import { api, downloadFile } from '../lib/api.js';
import ComingSoon from './ComingSoon.jsx';

export default function CertificateDetail(){
  const { skillId } = useParams();
  const { enrolled } = useUser();
  const { skill, loading: skillLoading } = useSkill(skillId);
  const entry = enrolled.find(e=>e.skillId===skillId);

  const [certificate, setCertificate] = React.useState(null);
  const [certLoading, setCertLoading] = React.useState(true);
  const [certError, setCertError] = React.useState(null);
  const [pdfDownloading, setPdfDownloading] = React.useState(false);
  const [pdfError, setPdfError] = React.useState(null);

  // Every lesson locally shows as complete — ask the backend to issue (or
  // return the existing) certificate. Idempotent: calling this again just
  // returns the same certificateNumber, so it's safe to run on every visit.
  const locallyComplete = entry && skill && entry.completedLessons.length >= skill.lessons.length && skill.lessons.length>0;

  React.useEffect(() => {
    if (!locallyComplete) { setCertLoading(false); return; }
    let alive = true;
    setCertLoading(true);
    setCertError(null);
    api.post(`/api/certificates/${skillId}/issue`, {})
      .then((data) => { if (alive) setCertificate(data.certificate); })
      .catch((err) => { if (alive) setCertError(err); })
      .finally(() => { if (alive) setCertLoading(false); });
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skillId, locallyComplete]);

  if (skillLoading || (locallyComplete && certLoading)) {
    return <ComingSoon title="Loading certificate…" text="Just a moment while we pull up your certificate." />;
  }

  if (!skill || !locallyComplete || !certificate) {
    return <ComingSoon title="Certificate not available" text="You'll be able to view this certificate once you've completed every lesson in the skill." />;
  }

  const issuedDate = new Date(certificate.issuedAt);
  const verifyPath = `/verify/${certificate.certificateNumber}`;
  const verifyUrl = `${window.location.origin}${verifyPath}`;
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&margin=8&data=${encodeURIComponent(verifyUrl)}`;

  const downloadPdf = () => {
    setPdfDownloading(true);
    setPdfError(null);
    downloadFile(`/api/certificates/${skillId}/pdf`, `${skill.id}-certificate.pdf`)
      .catch((err) => setPdfError(err))
      .finally(() => setPdfDownloading(false));
  };

  return (
    <div className="certificate-print-page" style={{maxWidth:'900px', margin:'0 auto', padding:'150px 24px 100px', position:'relative', zIndex:1}}>
      <div className="crumbs">
        <Link to="/certificates">Certificates</Link><span>/</span>
        <span style={{color:'var(--text)'}}>{skill.title}</span>
      </div>

      {certError && (
        <div className="notice-banner warn" style={{marginBottom:'18px'}}>
          ⚠️ Couldn't refresh this certificate from the server — showing the last known details.
        </div>
      )}

      <div className="certificate-card">
        <div className="certificate-seal">🎓</div>
        <div className="certificate-eyebrow">Certificate of Completion</div>
        <h1 className="certificate-name">{certificate.holderName || 'SkillSwap Member'}</h1>
        <p className="certificate-line">has successfully completed</p>
        <h2 className="certificate-skill">{certificate.skillTitle}</h2>
        <p className="certificate-line">an {skill.duration} course led by {certificate.mentorName}</p>

        <div className="certificate-footer">
          <div>
            <span>Issued</span>
            <b>{issuedDate.toLocaleDateString(undefined, { month:'long', day:'numeric', year:'numeric' })}</b>
          </div>
          <div>
            <span>Certificate ID</span>
            <b>{certificate.certificateNumber}</b>
          </div>
          <div>
            <span>Verified by</span>
            <b>SkillSwap</b>
          </div>
        </div>

        <div style={{display:'flex', alignItems:'center', gap:'16px', marginTop:'24px', paddingTop:'20px', borderTop:'1px solid var(--border)'}}>
          <img src={qrSrc} alt="QR code linking to the public verification page" width={92} height={92} style={{borderRadius:'8px', background:'#fff', padding:'4px'}} />
          <div style={{fontSize:'12.5px', color:'var(--muted)'}}>
            Scan to verify, or share this link with anyone who wants to confirm it's real —
            no login required.
            <br />
            <Link to={verifyPath} style={{color:'var(--accent)'}}>{window.location.host}{verifyPath}</Link>
          </div>
        </div>
      </div>

      {pdfError && (
        <div className="notice-banner warn" style={{marginTop:'18px'}}>
          ⚠️ Couldn't generate the PDF right now — try again in a moment.
        </div>
      )}

      <div className="cta-row" style={{justifyContent:'center', marginTop:'28px'}}>
        <button className="btn-primary-lg" onClick={downloadPdf} disabled={pdfDownloading}>
          {pdfDownloading ? 'Preparing PDF…' : '⬇ Download PDF'}
        </button>
        <button className="btn-outline" onClick={()=>window.print()}>🖨 Print</button>
        <Link to={verifyPath} className="btn-outline">🔗 View public verify page</Link>
        <Link to="/certificates" className="btn-ghost-lg">← Back to certificates</Link>
      </div>
    </div>
  );
}
