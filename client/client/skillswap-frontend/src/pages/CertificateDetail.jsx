import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useUser } from '../context/UserContext.jsx';
import { getSkillById } from '../data/skills.js';
import ComingSoon from './ComingSoon.jsx';

export default function CertificateDetail(){
  const { skillId } = useParams();
  const { profile, enrolled } = useUser();
  const skill = getSkillById(skillId);
  const entry = enrolled.find(e=>e.skillId===skillId);

  const isComplete = entry && skill && entry.completedLessons.length >= skill.lessons.length && skill.lessons.length>0;

  if(!skill || !isComplete){
    return <ComingSoon title="Certificate not available" text="You'll be able to view this certificate once you've completed every lesson in the skill." />;
  }

  const issuedDate = new Date(entry.enrolledAt);
  const certId = `SS-${skill.id.slice(0,4).toUpperCase()}-${issuedDate.getFullYear()}-${String(entry.completedLessons.length).padStart(2,'0')}${skill.id.length}`;

  return (
    <div style={{maxWidth:'900px', margin:'0 auto', padding:'150px 24px 100px', position:'relative', zIndex:1}}>
      <div className="crumbs">
        <Link to="/certificates">Certificates</Link><span>/</span>
        <span style={{color:'var(--text)'}}>{skill.title}</span>
      </div>

      <div className="certificate-card">
        <div className="certificate-seal">🎓</div>
        <div className="certificate-eyebrow">Certificate of Completion</div>
        <h1 className="certificate-name">{profile.name || 'SkillSwap Member'}</h1>
        <p className="certificate-line">has successfully completed</p>
        <h2 className="certificate-skill">{skill.title}</h2>
        <p className="certificate-line">an {skill.duration} course led by {skill.mentor.name}</p>

        <div className="certificate-footer">
          <div>
            <span>Issued</span>
            <b>{issuedDate.toLocaleDateString(undefined, { month:'long', day:'numeric', year:'numeric' })}</b>
          </div>
          <div>
            <span>Certificate ID</span>
            <b>{certId}</b>
          </div>
          <div>
            <span>Verified by</span>
            <b>SkillSwap</b>
          </div>
        </div>
      </div>

      <div className="cta-row" style={{justifyContent:'center', marginTop:'28px'}}>
        <button className="btn-primary-lg" onClick={()=>window.print()}>🖨 Print / Save as PDF</button>
        <Link to="/certificates" className="btn-ghost-lg">← Back to certificates</Link>
      </div>
    </div>
  );
}
