import React from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout.jsx';
import { useUser } from '../context/UserContext.jsx';
import { useSkillsById, useCategories } from '../lib/skillsApi.js';
import EmptyState from '../components/EmptyState.jsx';
import ScrollReveal from '../components/ScrollReveal.jsx';

export default function Certificates(){
  const { enrolled } = useUser();
  const { getSkillById } = useSkillsById(enrolled.map(e => e.skillId));
  const { categories } = useCategories();
  const completed = enrolled
    .map(e => ({ ...e, skill:getSkillById(e.skillId) }))
    .filter(e => e.skill && e.completedLessons.length >= e.skill.lessons.length && e.skill.lessons.length>0);

  return (
    <DashboardLayout title="Certificates" subtitle="Earned automatically when you finish every lesson in a skill.">
      {completed.length===0 ? (
        <EmptyState
          icon="🎓"
          title="No certificates yet"
          text="Complete every lesson in a skill to earn one automatically."
          ctaLabel="Go to My Learning"
          ctaTo="/my-learning"
        />
      ) : (
        <ScrollReveal as="div" className="cert-grid" stagger>
          {completed.map(e=>{
            const cat = categories.find(c=>c.key===e.skill.category);
            return (
              <Link to={`/certificate/${e.skillId}`} className="cert-card" key={e.skillId}>
                <div className="cert-card-icon">🎓</div>
                <b>{e.skill.title}</b>
                <span>{cat?.label} · Completed {new Date(e.enrolledAt).toLocaleDateString(undefined,{month:'short', year:'numeric'})}</span>
              </Link>
            );
          })}
        </ScrollReveal>
      )}
    </DashboardLayout>
  );
}
