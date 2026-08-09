import React from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout.jsx';
import { useUser } from '../context/UserContext.jsx';
import { useSkillsById, useCategories } from '../lib/skillsApi.js';
import SkillIcon3D from '../components/SkillIcon3D.jsx';
import { SkeletonSkillCard } from '../components/Skeleton.jsx';
import EmptyState from '../components/EmptyState.jsx';
import ScrollReveal from '../components/ScrollReveal.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function Wishlist(){
  const { wishlist, toggleWishlist } = useUser();
  const { getSkillById, loading } = useSkillsById(wishlist);
  const { categories } = useCategories();
  const toast = useToast();

  const wishlisted = wishlist.map(id => getSkillById(id)).filter(Boolean);

  const handleRemove = (e, id, title) => {
    e.preventDefault(); e.stopPropagation();
    toggleWishlist(id);
    toast.info(`Removed "${title}" from your wishlist`);
  };

  return (
    <DashboardLayout title="Wishlist" subtitle="Skills you've saved to come back to later.">
      {loading ? (
        <div className="explore-grid">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonSkillCard key={i} />)}
        </div>
      ) : wishlisted.length === 0 ? (
        <EmptyState
          icon="☆"
          title="Nothing saved yet"
          text="Browse skills and tap the star on anything that catches your eye — it'll show up here."
          ctaLabel="Browse skills"
          ctaTo="/explore"
        />
      ) : (
        <ScrollReveal as="div" className="explore-grid" stagger>
          {wishlisted.map(s => {
            const cat = categories.find(c => c.key === s.category);
            return (
              <div className="explore-card" key={s.id} style={{ position: 'relative' }}>
                <button
                  className="icon-btn active"
                  title="Remove from wishlist"
                  onClick={(e) => handleRemove(e, s.id, s.title)}
                  style={{ position: 'absolute', top: '14px', right: '14px', zIndex: 1 }}
                >★</button>
                <Link to={`/skill/${s.id}`} style={{ display: 'contents' }}>
                  <SkillIcon3D category={s.category} />
                  <span className="cat">{cat?.label}</span>
                  <h3>{s.title}</h3>
                  <div className="desc">{s.description.slice(0, 90)}…</div>
                  <div className="meta">
                    <span>★ <b>{s.rating}</b></span>
                    <span><b>{s.students.toLocaleString()}</b> students</span>
                    <span><b>{s.level}</b></span>
                  </div>
                </Link>
              </div>
            );
          })}
        </ScrollReveal>
      )}
    </DashboardLayout>
  );
}
