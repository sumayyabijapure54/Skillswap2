import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout.jsx';
import { getMentorById } from '../data/mentors.js';
import { useUser } from '../context/UserContext.jsx';
import ComingSoon from './ComingSoon.jsx';

const SESSION_TYPES = [
  { key:'quick', label:'Quick Chat', duration:'30 min', desc:'Fast, focused help on one specific question.' },
  { key:'deep', label:'Deep Dive', duration:'60 min', desc:'A full session working through a topic or project together.' }
];

export default function SessionBooking(){
  const { mentorId } = useParams();
  const mentor = getMentorById(mentorId);
  const navigate = useNavigate();
  const { bookSession } = useUser();

  const [day, setDay] = React.useState(null);
  const [time, setTime] = React.useState(null);
  const [sessionType, setSessionType] = React.useState('quick');

  if(!mentor){
    return <ComingSoon title="Mentor not found" text="We couldn't find that mentor to book with." />;
  }

  const canConfirm = day && time && sessionType;

  const onConfirm = ()=>{
    if(!canConfirm) return;
    const typeLabel = SESSION_TYPES.find(t=>t.key===sessionType)?.label;
    const id = bookSession({ mentorId: mentor.id, skillId: null, day, time, sessionType: typeLabel });
    navigate(`/session/${id}`);
  };

  return (
    <DashboardLayout title={`Book a session with ${mentor.name}`} subtitle={`${mentor.role} · $${mentor.rate}/session · ${mentor.responseTime}`}>
      <div className="two-col-dash" style={{alignItems:'flex-start'}}>
        <div>
          <div className="col-card" style={{marginBottom:'20px'}}>
            <h3>1. Choose a session type</h3>
            <div className="desc">&nbsp;</div>
            <div className="role-grid" style={{gridTemplateColumns:'1fr 1fr', gap:'12px'}}>
              {SESSION_TYPES.map(t=>(
                <div key={t.key} className={`role-card ${sessionType===t.key?'selected':''}`} onClick={()=>setSessionType(t.key)} style={{padding:'16px'}}>
                  <b style={{fontSize:'14px'}}>{t.label}</b>
                  <span style={{fontSize:'12px', display:'block', marginBottom:'4px'}}>{t.duration}</span>
                  <span style={{fontSize:'11.5px'}}>{t.desc}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="col-card">
            <h3>2. Pick a day &amp; time</h3>
            <div className="desc">Times shown in {mentor.name.split(' ')[0]}'s timezone ({mentor.timezone}).</div>
            <div className="avail-grid">
              {mentor.availability.map(a=>(
                <div className="avail-day" key={a.day}>
                  <b>{a.day}</b>
                  <div className="avail-slots">
                    {a.slots.map(t=>(
                      <span
                        key={t}
                        className={day===a.day && time===t ? 'selected' : ''}
                        onClick={()=>{ setDay(a.day); setTime(t); }}
                      >{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-card" style={{alignSelf:'flex-start'}}>
          <h3>Booking summary</h3>
          <ul style={{listStyle:'none'}}>
            <li style={{display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid var(--border)', fontSize:'12.5px', color:'var(--muted)'}}>Mentor <b style={{color:'var(--text)'}}>{mentor.name}</b></li>
            <li style={{display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid var(--border)', fontSize:'12.5px', color:'var(--muted)'}}>Type <b style={{color:'var(--text)'}}>{SESSION_TYPES.find(t=>t.key===sessionType)?.label}</b></li>
            <li style={{display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid var(--border)', fontSize:'12.5px', color:'var(--muted)'}}>When <b style={{color:'var(--text)'}}>{day && time ? `${day}, ${time}` : 'Not selected'}</b></li>
            <li style={{display:'flex', justifyContent:'space-between', padding:'8px 0', fontSize:'12.5px', color:'var(--muted)'}}>Price <b style={{color:'var(--text)'}}>${mentor.rate}</b></li>
          </ul>
          <button className="btn-primary-lg btn-full" disabled={!canConfirm} style={!canConfirm?{opacity:0.45, cursor:'not-allowed'}:{}} onClick={onConfirm}>
            Confirm booking →
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
