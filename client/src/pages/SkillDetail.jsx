import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useCategories, useSkill } from '../lib/skillsApi.js';
import { useUser } from '../context/UserContext.jsx';
import { useAiMentor } from '../context/AiMentorContext.jsx';
import ComingSoon from './ComingSoon.jsx';

export default function SkillDetail(){
  const { id } = useParams();
  const navigate = useNavigate();
  const { categories } = useCategories();
  const { skill, loading } = useSkill(id);
  const { authed, wishlist, toggleWishlist } = useUser();
  const { setPageContext } = useAiMentor();

  React.useEffect(() => {
    if (!skill) return undefined;
    setPageContext({ skillId: skill.id, skillTitle: skill.title });
    return () => setPageContext(null);
  }, [skill, setPageContext]);

  if(loading){
    return <ComingSoon title="Loading skill…" text="Just a moment while we fetch this skill." />;
  }

  if(!skill){
    return <ComingSoon title="Skill not found" text="We couldn't find that skill. It may have been renamed or removed." />;
  }

  const cat = categories.find(c=>c.key===skill.category);
  const saved = wishlist.includes(skill.id);

  const onSaveClick = ()=>{
    if(!authed){ navigate('/login', { state:{ from:`/skill/${skill.id}` } }); return; }
    toggleWishlist(skill.id);
  };

  return (
    <div style={{maxWidth:'1240px', margin:'0 auto', padding:'150px 48px 0', position:'relative', zIndex:1}}>
      <div className="crumbs">
        <Link to="/">Home</Link><span>/</span>
        <Link to="/explore">Explore</Link><span>/</span>
        <Link to={`/explore?cat=${skill.category}`}>{cat?.label}</Link><span>/</span>
        <span style={{color:'var(--text)'}}>{skill.title}</span>
      </div>

      <div className="skill-hero">
        <div>
          <span className="cat">{cat?.icon} {cat?.label} · {skill.level}</span>
          <h1>{skill.title}</h1>
          <p className="desc">{skill.description}</p>
          <div className="meta-row">
            <div><b>★ {skill.rating}</b><span>Rating</span></div>
            <div><b>{skill.students.toLocaleString()}</b><span>Students</span></div>
            <div><b>{skill.duration}</b><span>Total length</span></div>
            <div><b>{skill.lessons.length}</b><span>Lessons</span></div>
          </div>
          <div className="cta-row" style={{marginBottom:0}}>
            <Link to={`/learn/${skill.id}`} className="btn-primary-lg">Start Learning →</Link>
            <button className="btn-ghost-lg" onClick={onSaveClick}>{saved ? '★ Saved' : '☆ Save to Wishlist'}</button>
          </div>
        </div>

        <div className="skill-side">
          <Link to={`/mentor/${skill.mentor.id}`} className="mentor-mini" style={{textDecoration:'none', color:'inherit'}}>
            <div className="av">{skill.mentor.initials}</div>
            <div>
              <b>{skill.mentor.name}</b>
              <span>{skill.mentor.role}</span>
            </div>
          </Link>
          <ul>
            <li>Rating <b>★ {skill.mentor.rating} ({skill.mentor.reviews})</b></li>
            <li>Level <b>{skill.level}</b></li>
            <li>Language <b>English</b></li>
            <li>Format <b>Self-paced + live sessions</b></li>
          </ul>
          <Link to={`/learn/${skill.id}`} className="btn-solid" style={{width:'100%', textAlign:'center', display:'block', marginBottom:'10px'}}>Start Learning →</Link>
          <Link to={`/book/${skill.mentor.id}`} className="btn-outline" style={{width:'100%', textAlign:'center', display:'block'}}>📅 Book a session</Link>
        </div>
      </div>

      {skill.previewVideoUrl && (
        <div className="curriculum" style={{paddingBottom:0}}>
          <h2>Course preview</h2>
          <video
            className="video-frame"
            src={skill.previewVideoUrl}
            controls
            playsInline
            style={{ width:'100%', maxWidth:'760px', objectFit:'cover' }}
          />
        </div>
      )}

      <div className="curriculum">
        <h2>Curriculum</h2>
        {skill.lessons.map((lesson, i)=>(
          <Link to={`/learn/${skill.id}`} className="lesson-row" key={lesson.id}>
            <div className="num">{i+1}</div>
            <div className="info">
              <b>{lesson.title}</b>
              <span>{lesson.type}</span>
            </div>
            <div className="dur">{lesson.duration}</div>
          </Link>
        ))}
      </div>

      <div>
        <h2 style={{fontSize:'1.4rem', marginBottom:'18px'}}>Prerequisites</h2>
        <ul className="prereq-list">
          {skill.prerequisites.map(p=><li key={p}>{p}</li>)}
        </ul>
      </div>
    </div>
  );
}
