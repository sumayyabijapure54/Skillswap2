import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../lib/api.js';
import Avatar from '../components/Avatar.jsx';
import ComingSoon from './ComingSoon.jsx';

// Public, no-login page at /u/:userId — the "portfolio" a learner can share
// showing their name, bio, and whichever certificates they've opted to make
// public (see the "Show on my public SkillSwap profile" toggle on
// CertificateDetail). Backed by GET /api/users/:id/public.
export default function PublicProfile() {
  const { userId } = useParams();
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(false);
    api.get(`/api/users/${userId}/public`)
      .then((res) => { if (alive) setData(res); })
      .catch(() => { if (alive) setError(true); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [userId]);

  if (loading) {
    return <ComingSoon title="Loading profile…" text="Just a moment." />;
  }
  if (error || !data) {
    return <ComingSoon title="Profile not found" text="This SkillSwap member doesn't exist or their profile isn't available." />;
  }

  const { user, certificates } = data;

  return (
    <div className="page-header" style={{maxWidth:'820px', margin:'0 auto'}}>
      <div style={{display:'flex', alignItems:'center', gap:'18px', marginBottom:'8px'}}>
        <Avatar src={user.avatar} name={user.name} style={{width:'72px', height:'72px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:'22px', background:'var(--panel)'}} />
        <div>
          <h1 style={{margin:0}}>{user.name}</h1>
          {user.bio && <p style={{margin:'4px 0 0', color:'var(--muted)', maxWidth:'520px'}}>{user.bio}</p>}
        </div>
      </div>

      <h2 style={{marginTop:'36px', fontSize:'18px'}}>
        {certificates.length > 0 ? `Certificates (${certificates.length})` : 'Certificates'}
      </h2>

      {certificates.length === 0 ? (
        <div className="dash-empty" style={{maxWidth:'520px'}}>
          {user.name} hasn't made any certificates public yet.
        </div>
      ) : (
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(260px, 1fr))', gap:'16px', marginTop:'12px'}}>
          {certificates.map((c) => (
            <Link
              key={c.certificateNumber}
              to={`/verify/${c.certificateNumber}`}
              className="col-card"
              style={{textDecoration:'none', color:'inherit', display:'block'}}
            >
              <div style={{fontSize:'12px', color:'var(--accent)', fontWeight:700, textTransform:'uppercase'}}>
                {c.skillLevel || 'Certificate'}
              </div>
              <h3 style={{margin:'6px 0 4px', fontSize:'16px'}}>{c.skillTitle}</h3>
              <div style={{fontSize:'12.5px', color:'var(--muted)'}}>
                Led by {c.mentorName}{c.mentorRole ? `, ${c.mentorRole}` : ''}
              </div>
              <div style={{fontSize:'12px', color:'var(--muted)', marginTop:'8px'}}>
                Issued {new Date(c.issuedAt).toLocaleDateString(undefined, { month:'short', day:'numeric', year:'numeric' })}
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="cta-row" style={{marginTop:'32px'}}>
        <Link to="/" className="btn-ghost-lg">← Back to Home</Link>
      </div>
    </div>
  );
}
