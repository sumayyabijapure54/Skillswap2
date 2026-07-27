import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { getSkillById } from '../data/skills.js';
import { useUser } from '../context/UserContext.jsx';
import Quiz from '../components/Quiz.jsx';
import ComingSoon from './ComingSoon.jsx';

const FILLER = [
  "In this lesson we build on what you've already learned and push one step further, focusing on the concept in isolation before combining it with the rest of the skill.",
  "Follow along with the video, then try the exercise on your own before checking the reference solution — struggling with it briefly is where most of the learning happens.",
  "Keep an eye on the small details called out on screen; they're the ones that trip people up the first time but become second nature after this lesson."
];

export default function LessonPlayer(){
  const { id } = useParams();
  const skill = getSkillById(id);
  const { authed, enrolled, enroll, markLessonComplete, recordQuizScore } = useUser();

  const enrolledEntry = enrolled.find(e => e.skillId === id);
  const [activeIdx, setActiveIdx] = React.useState(0);
  // Guests get local-only progress (per the IA: lessons play without login,
  // but progress tracking requires it). Logged-in users read from context.
  const [guestCompleted, setGuestCompleted] = React.useState(new Set());

  React.useEffect(()=>{
    if(authed && skill) enroll(skill.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed, skill?.id]);

  if(!skill){
    return <ComingSoon title="Lesson not found" text="We couldn't find that course. Head back to Explore to find something to learn." />;
  }

  const completed = authed ? new Set(enrolledEntry?.completedLessons || []) : guestCompleted;
  const lesson = skill.lessons[activeIdx];
  const progressPct = Math.round((completed.size / skill.lessons.length) * 100);

  const markDoneAndNext = ()=>{
    if(authed) markLessonComplete(skill.id, lesson.id);
    else setGuestCompleted(prev => new Set(prev).add(lesson.id));
    if(activeIdx < skill.lessons.length-1) setActiveIdx(activeIdx+1);
  };

  return (
    <div className="player-shell">
      <div className="player-main">
        <div className="crumbs" style={{marginBottom:'18px'}}>
          <Link to="/">Home</Link><span>/</span>
          <Link to="/explore">Explore</Link><span>/</span>
          <Link to={`/skill/${skill.id}`}>{skill.title}</Link><span>/</span>
          <span style={{color:'var(--text)'}}>Lesson {activeIdx+1}</span>
        </div>

        {!authed && (
          <div className="guest-banner">
            You're browsing as a guest — <Link to="/signup">create a free account</Link> to save your progress and pick up where you left off.
          </div>
        )}

        <div className="video-frame" style={{backgroundImage:`url(https://picsum.photos/seed/${skill.id}/900/506)`, backgroundSize:'cover', backgroundPosition:'center'}}>
          <div className="video-frame-scrim"></div>
          <div className="playbtn">▶</div>
          <div className="bar"><i style={{width: lesson.type==='Quiz' ? '0%' : '38%'}}></i></div>
        </div>

        <div className="lesson-meta">
          <div>
            <h1>{lesson.title}</h1>
            <div className="sub">{skill.title} · Lesson {activeIdx+1} of {skill.lessons.length} · {lesson.duration}</div>
          </div>
          <div className="lesson-actions">
            <button className="btn-ghost-lg">📝 Notes</button>
            <button className="btn-outline">💬 Ask mentor</button>
          </div>
        </div>

        {lesson.type==='Quiz' ? (
          lesson.quiz ? (
            <div className="col-card" style={{marginBottom:'30px'}}>
              <h3 style={{marginBottom:'4px'}}>Checkpoint quiz</h3>
              <div className="desc" style={{marginBottom:'18px'}}>Answer all {lesson.quiz.length} questions, then submit to see your score.</div>
              <Quiz
                quiz={lesson.quiz}
                onComplete={(score, total)=>{
                  if(authed) recordQuizScore(skill.id, lesson.id, score, total);
                  markDoneAndNext();
                }}
              />
            </div>
          ) : (
            <div className="col-card" style={{marginBottom:'30px'}}>
              <h3>Checkpoint quiz</h3>
              <div className="desc">A short quiz to confirm what you've picked up so far. Multiple choice, no time limit.</div>
              <button className="btn-primary-lg" style={{marginTop:'6px'}} onClick={markDoneAndNext}>Start quiz →</button>
            </div>
          )
        ) : (
          <div className="lesson-body">
            {FILLER.map((p,i)=><p key={i}>{p}</p>)}
          </div>
        )}

        <div className="lesson-nav">
          <button className="btn-ghost-lg" disabled={activeIdx===0} style={activeIdx===0?{opacity:0.4, cursor:'not-allowed'}:{}} onClick={()=>setActiveIdx(Math.max(0,activeIdx-1))}>← Previous</button>
          {!(lesson.type==='Quiz' && lesson.quiz) && (
            <button className="btn-primary-lg" onClick={markDoneAndNext}>
              {activeIdx===skill.lessons.length-1 ? 'Mark complete ✓' : 'Complete & continue →'}
            </button>
          )}
        </div>
      </div>

      <aside className="player-side">
        <h4>{skill.title}</h4>
        <div className="progress-txt">{completed.size}/{skill.lessons.length} lessons complete</div>
        <div className="progress-track"><i style={{width: `${progressPct}%`}}></i></div>

        {skill.lessons.map((l, i)=>(
          <div
            key={l.id}
            className={`side-lesson ${i===activeIdx?'active':''} ${completed.has(l.id)?'done':''}`}
            onClick={()=>setActiveIdx(i)}
          >
            <div className="chk">{completed.has(l.id) ? '✓' : i+1}</div>
            <div className="txt">
              <b>{l.title}</b>
              <span>{l.type} · {l.duration}</span>
            </div>
          </div>
        ))}
      </aside>
    </div>
  );
}
