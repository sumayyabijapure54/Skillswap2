import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSkillFull, useSkills, useCategories } from '../lib/skillsApi.js';
import ComingSoon from './ComingSoon.jsx';
import TestimonialCarousel from '../components/TestimonialCarousel.jsx';

// A "mentor profile" is scoped to the skill that got us here — the backend
// models mentors as a claimed/created attribute of a Skill (see
// server/src/models/Skill.js: `mentor` + optional `mentorUser`), not as a
// standalone directory entry. If the same real user (`mentorUser`) teaches
// more than one skill, those show up below as "More from this mentor".
export default function MentorProfile(){
  const { id: skillId } = useParams();
  const { skill, reviews, reviewsTotal, loading } = useSkillFull(skillId);
  const { categories } = useCategories();

  const mentorUser = skill?.mentorUser || null;
  const { skills: otherSkills } = useSkills(mentorUser ? { mentorUser } : {});
  const moreFromMentor = mentorUser ? otherSkills.filter(s => s.id !== skillId) : [];

  if (loading) return null;
  if (!skill){
    return <ComingSoon title="Mentor not found" text="We couldn't find that mentor profile." />;
  }

  const mentor = skill.mentor;
  const testimonials = reviews.map(r => ({ text: r.comment, author: r.reviewer?.name || 'Anonymous', rating: r.rating }));

  return (
    <div className="detail-wrap detail-wrap-narrow">
      <div className="crumbs">
        <Link to="/">Home</Link><span>/</span>
        <Link to="/explore">Explore</Link><span>/</span>
        <span style={{color:'var(--text)'}}>{mentor.name}</span>
      </div>

      <div className="skill-hero mentor-hero">
        <div className="profile-avatar-big" style={{width:'84px', height:'84px', fontSize:'26px'}}>{mentor.initials}</div>

        <div>
          <h1 style={{marginBottom:'6px'}}>{mentor.name}</h1>
          <div style={{color:'var(--muted)', fontSize:'14px', marginBottom:'14px'}}>{mentor.role}</div>
          <p className="desc" style={{marginBottom:'20px'}}>{skill.description}</p>
          <div className="mentor-tags" style={{marginBottom:'0'}}>
            {(skill.tags || []).map(t=><span key={t}>{t}</span>)}
          </div>
        </div>

        <div className="skill-side">
          <ul>
            <li>Rating <b>★ {mentor.rating} ({mentor.reviews})</b></li>
            <li>Students taught <b>{(skill.students || 0).toLocaleString()}</b></li>
            <li>Level <b>{skill.level}</b></li>
          </ul>
          <Link to={`/book/${skill.id}`} className="btn-solid" style={{width:'100%', textAlign:'center', display:'block', marginBottom:'10px'}}>Book a session →</Link>
          {mentorUser
            ? <Link to={`/messages?user=${mentorUser}`} className="btn-ghost-lg" style={{width:'100%', textAlign:'center', display:'block'}}>💬 Message</Link>
            : <div className="desc" style={{fontSize:'12px', textAlign:'center'}}>This mentor hasn't joined messaging yet.</div>}
        </div>
      </div>

      {moreFromMentor.length>0 && (
        <div className="curriculum">
          <h2>More from {mentor.name.split(' ')[0]}</h2>
          {moreFromMentor.map(s=>{
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

      <div style={{marginTop:'60px'}}>
        <h2 style={{fontSize:'1.4rem', marginBottom:'18px'}}>What students say {reviewsTotal>0 && `(${reviewsTotal})`}</h2>
        {testimonials.length>0
          ? <TestimonialCarousel testimonials={testimonials} />
          : <div className="dash-empty">No reviews yet — be the first to book a session and leave one.</div>}
      </div>
    </div>
  );
}
