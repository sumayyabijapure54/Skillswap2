import React from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout.jsx';
import { useUser } from '../context/UserContext.jsx';
import { useSkillsById, useCategories } from '../lib/skillsApi.js';
import SkillIcon3D from '../components/SkillIcon3D.jsx';

export default function Wishlist(){
  const { wishlist, toggleWishlist } = useUser();
  const { getSkillById, loading } = useSkillsById(wishlist);
  const { categories } = useCategories();

  const wishlisted = wishlist.map(id => getSkillById(id)).filter(Boolean);

  return (
    <DashboardLayout title="Wishlist" subtitle="Skills you've saved to come back to later.">
      {loading ? (
        <div className="dash-empty">Loading your wishlist…</div>
      ) : wishlisted.length === 0 ? (
        <div className="dash-empty">
          Nothing saved yet. <Link to="/explore">Browse skills</Link> and tap ☆ Wishlist on anything that catches your eye.
        </div>
      ) : (
        <div className="explore-grid">
          {wishlisted.map(s => {
            const cat = categories.find(c => c.key === s.category);
            return (
              <div className="explore-card" key={s.id} style={{ position: 'relative' }}>
                <button
                  className="icon-btn active"
                  title="Remove from wishlist"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(s.id); }}
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
        </div>
      )}
    </DashboardLayout>
  );
}
