import React from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout.jsx';
import { useUser } from '../context/UserContext.jsx';
import { useSkillsById, useCategories } from '../lib/skillsApi.js';
import EmptyState from '../components/EmptyState.jsx';

export default function MyLearning(){
  const { enrolled } = useUser();
  const { getSkillById } = useSkillsById(enrolled.map(e => e.skillId));
  const { categories } = useCategories();

  const withSkill = enrolled.map(e => ({ ...e, skill:getSkillById(e.skillId) })).filter(e=>e.skill);
  const inProgress = withSkill.filter(e => e.completedLessons.length < e.skill.lessons.length);

  return (
    <DashboardLayout title="My Learning" subtitle="Everything you're currently working through.">
      {inProgress.length===0 ? (
        <EmptyState
          icon="📚"
          title="Nothing in progress yet"
          text="Browse skills to start your first course."
          ctaLabel="Browse skills"
          ctaTo="/explore"
        />
      ) : (
        <div className="my-learning-list">
          {inProgress.map(e=>{
            const pct = Math.round((e.completedLessons.length / e.skill.lessons.length) * 100);
            const cat = categories.find(c=>c.key===e.skill.category);
            return (
              <div className="learning-row" key={e.skillId}>
                <div className="learning-row-icon">{cat?.icon}</div>
                <div className="learning-row-info">
                  <b>{e.skill.title}</b>
                  <span>{cat?.label} · {e.skill.level} · {e.completedLessons.length}/{e.skill.lessons.length} lessons</span>
                  <div className="progress-track" style={{marginTop:'10px'}}><i style={{width:`${pct}%`}}></i></div>
                </div>
                <div className="learning-row-pct">{pct}%</div>
                <Link to={`/learn/${e.skillId}`} className="btn-solid">Resume →</Link>
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}
