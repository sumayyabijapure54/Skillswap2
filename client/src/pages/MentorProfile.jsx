import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { getMentorById } from '../data/mentors.js';
import { useSkills, useCategories } from '../lib/skillsApi.js';
import ComingSoon from './ComingSoon.jsx';
import TestimonialCarousel from '../components/TestimonialCarousel.jsx';

export default function MentorProfile(){
  const { id } = useParams();
  const mentor = getMentorById(id);
  const { skills, loading: skillsLoading } = useSkills();
  const { categories } = useCategories();

  if(!mentor){
    return <ComingSoon title="Mentor not found" text="We couldn't find that mentor profile." />;
  }

  const taughtSkills = skillsLoading ? [] : skills.filter(s => s.mentor?.id === mentor.id);

  return (
    <div style={{maxWidth:'1100px', margin:'0 auto', padding:'150px 48px 100px', position:'relative', zIndex:1}}>
      <div className="crumbs">
        <Link to="/">Home</Link><span>/</span>
        <Link to="/explore">Explore</Link><span>/</span>
        <span style={{color:'var(--text)'}}>{mentor.name}</span>
      </div>

      <div className="skill-hero" style={{gridTemplateColumns:'auto 1fr 300px', alignItems:'flex-start', gap:'30px'}}>
        <div className="profile-avatar-big" style={{width:'84px', height:'84px', fontSize:'26px'}}>{mentor.initials}</div>

        <div>
          <h1 style={{marginBottom:'6px'}}>{mentor.name}</h1>
          <div style={{color:'var(--muted)', fontSize:'14px', marginBottom:'14px'}}>{mentor.role} · {mentor.location}</div>
          <p className="desc" style={{marginBottom:'20px'}}>{mentor.bio}</p>
          <div className="mentor-tags" style={{marginBottom:'0'}}>
            {mentor.tags.map(t=><span key={t}>{t}</span>)}
          </div>
        </div>

        <div className="skill-side">
          <ul>
            <li>Rating <b>★ {mentor.rating} ({mentor.reviews})</b></li>
            <li>Students taught <b>{mentor.students.toLocaleString()}</b></li>
            <li>Timezone <b>{mentor.timezone}</b></li>
            <li>Response time <b style={{textAlign:'right', maxWidth:'160px'}}>{mentor.responseTime}</b></li>
            <li>Rate <b>${mentor.rate}/session</b></li>
          </ul>
          <Link to={`/book/${mentor.id}`} className="btn-solid" style={{width:'100%', textAlign:'center', display:'block', marginBottom:'10px'}}>Book a session →</Link>
          <Link to={`/messages?mentor=${mentor.id}`} className="btn-ghost-lg" style={{width:'100%', textAlign:'center', display:'block'}}>💬 Message</Link>
        </div>
      </div>

      {mentor.introVideoUrl && (
        <div className="curriculum" style={{paddingBottom:0}}>
          <h2>Meet {mentor.name.split(' ')[0]}</h2>
          <video
            className="video-frame"
            src={mentor.introVideoUrl}
            controls
            playsInline
            style={{ width:'100%', maxWidth:'760px', objectFit:'cover' }}
          />
        </div>
      )}

      {taughtSkills.length>0 && (
        <div className="curriculum">
          <h2>Skills taught</h2>
          {taughtSkills.map(s=>{
            const cat = categories.find(c=>c.key===s.category);
            return (
              <Link to={`/skill/${s.id}`} className="lesson-row" key={s.id}>
                <div className="num">{cat?.icon}</div>
                <div className="info">
                  <b>{s.title}</b>
                  <span>{cat?.label} · {s.level}</span>
                </div>
                <div className="dur">★ {s.rating}</div>
              </Link>
            );
          })}
        </div>
      )}

      <div>
        <h2 style={{fontSize:'1.4rem', marginBottom:'18px'}}>Availability this week</h2>
        <div className="avail-grid">
          {mentor.availability.map(a=>(
            <div className="avail-day" key={a.day}>
              <b>{a.day}</b>
              <div className="avail-slots">
                {a.slots.map(t=><span key={t}>{t}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{marginTop:'60px'}}>
        <h2 style={{fontSize:'1.4rem', marginBottom:'18px'}}>What students say</h2>
        <TestimonialCarousel testimonials={mentor.testimonials} />
      </div>
    </div>
  );
}
