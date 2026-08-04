import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout.jsx';
import { useSkill } from '../lib/skillsApi.js';
import ComingSoon from './ComingSoon.jsx';

// Flat platform session pricing — the backend's Skill model has no
// per-mentor rate field (mentors are a denormalized attribute of a skill,
// not a priced listing), so pricing is a platform-wide rate by session
// length rather than something each mentor sets. Keeps checkout simple and
// consistent across every mentor.
const SESSION_TYPES = [
  { key:'quick', label:'Quick Chat', duration:60*30, durationLabel:'30 min', price:15, desc:'Fast, focused help on one specific question.' },
  { key:'deep', label:'Deep Dive', duration:60*60, durationLabel:'60 min', price:35, desc:'A full session working through a topic or project together.' }
];

function todayISO(){
  const d = new Date();
  d.setDate(d.getDate()+1); // earliest bookable day is tomorrow
  return d.toISOString().slice(0,10);
}

export default function SessionBooking(){
  const { skillId } = useParams();
  const { skill, loading } = useSkill(skillId);
  const navigate = useNavigate();

  const [date, setDate] = React.useState('');
  const [time, setTime] = React.useState('');
  const [sessionType, setSessionType] = React.useState('quick');
  const [error, setError] = React.useState('');

  if (loading) return null;
  if (!skill){
    return <ComingSoon title="Skill not found" text="We couldn't find that session to book." />;
  }

  const mentor = skill.mentor;
  const type = SESSION_TYPES.find(t=>t.key===sessionType);
  const canConfirm = !!(date && time);

  const onContinue = ()=>{
    if (!canConfirm) return;
    const scheduledAt = new Date(`${date}T${time}`);
    if (Number.isNaN(scheduledAt.getTime()) || scheduledAt.getTime() <= Date.now()){
      setError('Pick a date and time in the future.');
      return;
    }
    navigate('/checkout', {
      state: {
        skillId: skill.id,
        skillTitle: skill.title,
        mentorName: mentor.name,
        mentorInitials: mentor.initials,
        scheduledAt: scheduledAt.toISOString(),
        durationMinutes: Math.round(type.duration/60),
        sessionType: type.label,
        price: type.price
      }
    });
  };

  return (
    <DashboardLayout title={`Book a session with ${mentor.name}`} subtitle={`${mentor.role} · ${skill.title}`}>
      <div className="two-col-dash" style={{alignItems:'flex-start'}}>
        <div>
          <div className="col-card" style={{marginBottom:'20px'}}>
            <h3>1. Choose a session type</h3>
            <div className="desc">&nbsp;</div>
            <div className="role-grid" style={{gridTemplateColumns:'1fr 1fr', gap:'12px'}}>
              {SESSION_TYPES.map(t=>(
                <div key={t.key} className={`role-card ${sessionType===t.key?'selected':''}`} onClick={()=>setSessionType(t.key)} style={{padding:'16px'}}>
                  <b style={{fontSize:'14px'}}>{t.label}</b>
                  <span style={{fontSize:'12px', display:'block', marginBottom:'4px'}}>{t.durationLabel} · ${t.price}</span>
                  <span style={{fontSize:'11.5px'}}>{t.desc}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="col-card">
            <h3>2. Pick a day &amp; time</h3>
            <div className="desc">Your local time — sessions must be booked at least a day out.</div>
            <div style={{display:'flex', gap:'12px', marginTop:'14px'}}>
              <input className="form-input" type="date" min={todayISO()} value={date} onChange={e=>{ setDate(e.target.value); setError(''); }} />
              <input className="form-input" type="time" value={time} onChange={e=>{ setTime(e.target.value); setError(''); }} />
            </div>
            {error && <div className="field-error" style={{marginTop:'8px'}}>{error}</div>}
          </div>
        </div>

        <div className="col-card" style={{alignSelf:'flex-start'}}>
          <h3>Booking summary</h3>
          <ul style={{listStyle:'none'}}>
            <li style={{display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid var(--border)', fontSize:'12.5px', color:'var(--muted)'}}>Mentor <b style={{color:'var(--text)'}}>{mentor.name}</b></li>
            <li style={{display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid var(--border)', fontSize:'12.5px', color:'var(--muted)'}}>Skill <b style={{color:'var(--text)'}}>{skill.title}</b></li>
            <li style={{display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid var(--border)', fontSize:'12.5px', color:'var(--muted)'}}>Type <b style={{color:'var(--text)'}}>{type.label}</b></li>
            <li style={{display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid var(--border)', fontSize:'12.5px', color:'var(--muted)'}}>When <b style={{color:'var(--text)'}}>{date && time ? `${date}, ${time}` : 'Not selected'}</b></li>
            <li style={{display:'flex', justifyContent:'space-between', padding:'8px 0', fontSize:'12.5px', color:'var(--muted)'}}>Price <b style={{color:'var(--text)'}}>${type.price}</b></li>
          </ul>
          <button className="btn-primary-lg btn-full" disabled={!canConfirm} style={!canConfirm?{opacity:0.45, cursor:'not-allowed'}:{}} onClick={onContinue}>
            Continue to checkout →
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
