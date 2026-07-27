import React from 'react';
import { Link } from 'react-router-dom';
import Counter from '../components/Counter.jsx';

const TEAM = [
  { initials:'RK', avatar:'https://i.pravatar.cc/200?img=25', name:'Riya Kapoor', role:'Co-founder & CEO', bio:'Previously led marketplace growth at an edtech startup; started SkillSwap after struggling to find affordable mentorship herself.' },
  { initials:'TM', avatar:'https://i.pravatar.cc/200?img=15', name:'Theo Marsh', role:'Co-founder & CTO', bio:'Ten years building consumer products; believes the best learning happens person-to-person, not just video-to-person.' },
  { initials:'NA', avatar:'https://i.pravatar.cc/200?img=28', name:'Nadia Aziz', role:'Head of Community', bio:'Runs the community programs that keep SkillSwap feeling like a neighborhood, not a marketplace.' }
];

const VALUES = [
  { icon:'🤝', title:'Reciprocity over transactions', text:'The best exchanges go both ways — we design for teaching and learning to feel equally valuable.' },
  { icon:'🌍', title:'Skills know no borders', text:'Some of the best mentors we\'ve met would never have found students without a global platform.' },
  { icon:'🔍', title:'Progressive trust', text:'You can learn for free with zero friction — we only ask for more once you\'re ready to commit.' }
];

export default function About(){
  return (
    <>
      <div className="page-header" style={{textAlign:'center', margin:'0 auto'}}>
        <div className="eyebrow" style={{textAlign:'center'}}>About Us</div>
        <h1>Everyone has something <span className="g">to teach.</span></h1>
        <p style={{margin:'0 auto'}}>SkillSwap started with a simple idea: the person who just learned something is often the best teacher for the next person learning it.</p>
      </div>

      <section style={{paddingTop:0}}>
        <div className="stats-bar" style={{margin:0}}>
          <div className="stat-item"><div className="ic">👥</div><div><div className="num"><Counter target={25000} /></div><div className="lbl">Active learners</div></div></div>
          <div className="stat-item"><div className="ic">🌐</div><div><div className="num"><Counter target={85} /></div><div className="lbl">Countries</div></div></div>
          <div className="stat-item"><div className="ic">⇄</div><div><div className="num"><Counter target={15000} /></div><div className="lbl">Successful swaps</div></div></div>
          <div className="stat-item"><div className="ic">📅</div><div><div className="num">2024</div><div className="lbl">Founded</div></div></div>
        </div>
      </section>

      <section>
        <div className="section-head"><h2>Our <span className="g">story</span></h2></div>
        <div style={{maxWidth:'720px', color:'var(--muted)', fontSize:'14.5px', lineHeight:1.8}}>
          <p style={{marginBottom:'16px'}}>SkillSwap began in 2024 when our founders kept running into the same problem: great mentorship was either locked behind expensive bootcamps, or scattered across forums and DMs with no structure. Meanwhile, people who'd just leveled up a skill themselves had no easy way to turn around and teach it.</p>
          <p>So we built a place where learning free content, exchanging skills directly with peers, and booking paid time with an expert mentor could all live on the same platform — with the friction of signing up pushed as late as possible, so anyone can try before they commit.</p>
        </div>
      </section>

      <section>
        <div className="section-head"><h2>What we <span className="g">believe</span></h2></div>
        <div className="three-col">
          {VALUES.map(v=>(
            <div className="col-card" key={v.title}>
              <div className="cert-card-icon" style={{marginBottom:'14px'}}>{v.icon}</div>
              <h3>{v.title}</h3>
              <div className="desc">{v.text}</div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="section-head"><h2>The <span className="g">team</span></h2></div>
        <div className="mentor-grid">
          {TEAM.map(t=>(
            <div className="col-card" key={t.initials} style={{textAlign:'center'}}>
              <div className="mentor-avatar" style={{position:'static', margin:'0 auto 16px', width:'60px', height:'60px', fontSize:'18px'}}>{t.avatar ? <img src={t.avatar} alt={t.name} /> : t.initials}</div>
              <b style={{display:'block', fontSize:'15px'}}>{t.name}</b>
              <div style={{color:'var(--accent)', fontSize:'12px', marginBottom:'10px'}}>{t.role}</div>
              <div className="desc">{t.bio}</div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="final-cta">
          <div><h2>Come teach, or come learn.</h2><p>Either way, we think you'll find your people here.</p></div>
          <Link to="/signup" className="btn-white">Join SkillSwap — It's Free →</Link>
        </div>
      </section>
    </>
  );
}
