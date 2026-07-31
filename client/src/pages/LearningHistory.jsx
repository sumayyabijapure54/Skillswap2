import React from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout.jsx';
import { useUser } from '../context/UserContext.jsx';
import { useSkillsById, useCategories } from '../lib/skillsApi.js';

export default function LearningHistory(){
  const { enrolled } = useUser();
  const { getSkillById } = useSkillsById(enrolled.map(e => e.skillId));
  const { categories } = useCategories();

  const withSkill = enrolled.map(e => ({ ...e, skill:getSkillById(e.skillId) })).filter(e=>e.skill);
  const completed = withSkill.filter(e => e.completedLessons.length >= e.skill.lessons.length && e.skill.lessons.length>0);

  return (
    <DashboardLayout title="Learning History" subtitle="Skills you've fully completed.">
      {completed.length===0 ? (
        <div className="dash-empty">
          No completed skills yet — finish every lesson in a course from <Link to="/my-learning">My Learning</Link> and it'll show up here.
        </div>
      ) : (
        <div className="my-learning-list">
          {completed.map(e=>{
            const cat = categories.find(c=>c.key===e.skill.category);
            const finishedDate = new Date(e.enrolledAt);
            return (
              <div className="learning-row" key={e.skillId}>
                <div className="learning-row-icon" style={{color:'var(--accent)'}}>✓</div>
                <div className="learning-row-info">
                  <b>{e.skill.title}</b>
                  <span>{cat?.label} · Completed · {e.skill.lessons.length} lessons</span>
                </div>
                <div className="learning-row-pct" style={{color:'var(--accent)'}}>100%</div>
                <Link to={`/certificate/${e.skillId}`} className="btn-outline">View certificate</Link>
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}
