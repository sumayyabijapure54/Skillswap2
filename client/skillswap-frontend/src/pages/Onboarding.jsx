import React from 'react';
import { useNavigate } from 'react-router-dom';
import { categories } from '../data/skills.js';
import { useUser } from '../context/UserContext.jsx';

const ROLES = [
  { key:'learn', icon:'🎓', title:'Learn', desc:'I want to pick up new skills from mentors and free lessons.' },
  { key:'teach', icon:'🧑‍🏫', title:'Teach', desc:'I want to share what I know and mentor other members.' },
  { key:'both', icon:'⇄', title:'Both', desc:'I want to learn some skills and teach others in exchange.' }
];

const GOALS = [
  { key:'casual', label:'Casual', desc:'~1 hour a week' },
  { key:'regular', label:'Regular', desc:'~3–5 hours a week' },
  { key:'intense', label:'Intense', desc:'5+ hours a week' }
];

const TOTAL_STEPS = 3;

export default function Onboarding(){
  const navigate = useNavigate();
  const { completeOnboarding } = useUser();
  const [step, setStep] = React.useState(0);
  const [role, setRole] = React.useState(null);
  const [interests, setInterests] = React.useState([]);
  const [goal, setGoal] = React.useState(null);
  const [finished, setFinished] = React.useState(false);

  const toggleInterest = (key)=>{
    setInterests(prev => prev.includes(key) ? prev.filter(k=>k!==key) : [...prev, key]);
  };

  const canNext = step===0 ? !!role : step===1 ? interests.length>0 : !!goal;

  const next = ()=>{
    if(!canNext) return;
    if(step < TOTAL_STEPS-1) setStep(step+1);
    else { completeOnboarding({ role, interests, goal }); setFinished(true); }
  };
  const back = ()=>{ if(step>0) setStep(step-1); };

  if(finished){
    return (
      <div className="onboard-shell">
        <div className="success-box">
          <div className="tick">✓</div>
          <h1>You're all set, welcome to SkillSwap!</h1>
          <p>
            We've personalized your feed around {interests.length} interest{interests.length!==1?'s':''} as
            a <b style={{color:'var(--text)'}}>{ROLES.find(r=>r.key===role)?.title.toLowerCase()}</b> member.
            Your dashboard is ready.
          </p>
          <button className="btn-primary-lg btn-full" onClick={()=>navigate('/dashboard')}>Go to my dashboard →</button>
        </div>
      </div>
    );
  }

  return (
    <div className="onboard-shell">
      <div className="onboard-stepper">
        {Array.from({ length: TOTAL_STEPS }).map((_, i)=>(
          <div className="seg" key={i}><i style={{ width: i<step ? '100%' : i===step ? '50%' : '0%' }}></i></div>
        ))}
      </div>

      {step===0 && (
        <>
          <div className="onboard-head">
            <div className="eyebrow">Step 1 of 3</div>
            <h1>What brings you to <span className="g">SkillSwap</span>?</h1>
            <p>This just personalizes your dashboard — you can switch roles any time later.</p>
          </div>
          <div className="role-grid">
            {ROLES.map(r=>(
              <div key={r.key} className={`role-card ${role===r.key?'selected':''}`} onClick={()=>setRole(r.key)}>
                <div className="ic">{r.icon}</div>
                <b>{r.title}</b>
                <span>{r.desc}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {step===1 && (
        <>
          <div className="onboard-head">
            <div className="eyebrow">Step 2 of 3</div>
            <h1>What are you <span className="g">interested in</span>?</h1>
            <p>Pick a few categories — you can always add more later.</p>
          </div>
          <div className="interest-grid">
            {categories.map(c=>(
              <div key={c.key} className={`interest-chip ${interests.includes(c.key)?'selected':''}`} onClick={()=>toggleInterest(c.key)}>
                {c.icon} {c.label}
              </div>
            ))}
          </div>
        </>
      )}

      {step===2 && (
        <>
          <div className="onboard-head">
            <div className="eyebrow">Step 3 of 3</div>
            <h1>How much time can you <span className="g">commit</span>?</h1>
            <p>We'll pace your recommendations and session reminders around this.</p>
          </div>
          <div className="role-grid">
            {GOALS.map(g=>(
              <div key={g.key} className={`role-card ${goal===g.key?'selected':''}`} onClick={()=>setGoal(g.key)}>
                <div className="ic">⏱</div>
                <b>{g.label}</b>
                <span>{g.desc}</span>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="onboard-actions">
        {step>0 ? <button className="btn-ghost-lg" onClick={back}>← Back</button> : <span className="step-count">Step {step+1} of {TOTAL_STEPS}</span>}
        <button className="btn-primary-lg" onClick={next} disabled={!canNext} style={!canNext?{opacity:0.45, cursor:'not-allowed'}:{}}>
          {step===TOTAL_STEPS-1 ? 'Finish →' : 'Continue →'}
        </button>
      </div>
    </div>
  );
}
