import React from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout.jsx';
import { useUser } from '../context/UserContext.jsx';
import { getSkillById, categories } from '../data/skills.js';

export default function Wishlist(){
  const { wishlist, toggleWishlist } = useUser();
  const saved = wishlist.map(getSkillById).filter(Boolean);

  return (
    <DashboardLayout title="Wishlist" subtitle="Skills you've saved to come back to later.">
      {saved.length===0 ? (
        <div className="dash-empty">
          Nothing saved yet. Tap the ☆ on any <Link to="/explore">skill</Link> to add it here.
        </div>
      ) : (
        <div className="explore-grid">
          {saved.map(s=>{
            const cat = categories.find(c=>c.key===s.category);
            return (
              <div className="explore-card" key={s.id} style={{position:'relative'}}>
                <button
                  onClick={()=>toggleWishlist(s.id)}
                  title="Remove from wishlist"
                  style={{position:'absolute', top:'18px', right:'18px', background:'none', border:'none', color:'var(--accent)', fontSize:'16px', cursor:'pointer'}}
                >★</button>
                <span className="cat">{cat?.icon} {cat?.label}</span>
                <h3>{s.title}</h3>
                <div className="desc">{s.description.slice(0,90)}…</div>
                <div className="meta" style={{marginBottom:'14px'}}>
                  <span>★ <b>{s.rating}</b></span>
                  <span><b>{s.students.toLocaleString()}</b> students</span>
                  <span><b>{s.level}</b></span>
                </div>
                <Link to={`/skill/${s.id}`} className="btn-solid" style={{width:'100%', textAlign:'center', display:'block'}}>View skill →</Link>
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}
