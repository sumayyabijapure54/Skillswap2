import React from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout.jsx';
import { useUser } from '../context/UserContext.jsx';
import { categories } from '../data/skills.js';
import { getAIRecommendations } from '../lib/aiRecommendations.js';

export default function Recommendations(){
  const user = useUser();
  const { profile, wishlist, toggleWishlist } = user;

  const [thinking, setThinking] = React.useState(false);
  const [seed, setSeed] = React.useState(0);

  const recs = React.useMemo(
    () => getAIRecommendations(user, { limit: 6 }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user.enrolled, user.wishlist, profile.interests, profile.skillsWanted, seed]
  );

  const regenerate = () => {
    setThinking(true);
    setTimeout(() => {
      setSeed(s => s + 1);
      setThinking(false);
    }, 900);
  };

  return (
    <DashboardLayout
      title="AI Recommendations"
      subtitle="Personalized picks based on your interests, wishlist, and what you're already learning."
    >
      <div className="col-card" style={{marginBottom:'26px', display:'flex', justifyContent:'space-between', alignItems:'center', gap:'16px', flexWrap:'wrap'}}>
        <div>
          <h3>How this works</h3>
          <div className="desc" style={{marginBottom:0}}>
            The recommendation engine scores every skill in the catalog against your profile —
            stated interests, skills you want to learn, what pairs well with what you're already
            studying, wishlist activity, and how other learners rated it — then ranks the results.
          </div>
        </div>
        <button className="btn-solid" onClick={regenerate} disabled={thinking}>
          {thinking ? 'Re-analyzing…' : '✨ Refresh recommendations'}
        </button>
      </div>

      {thinking ? (
        <div className="dash-empty">Analyzing your profile and learning history…</div>
      ) : recs.length === 0 ? (
        <div className="dash-empty">
          Add a few interests on your <Link to="/profile">profile</Link> so we can tailor picks for you.
        </div>
      ) : (
        <div className="continue-grid">
          {recs.map(({ skill, reasons }) => {
            const cat = categories.find(c => c.key === skill.category);
            const wishlisted = wishlist.includes(skill.id);
            return (
              <div className="continue-card" key={skill.id}>
                <div className="cat">{cat?.icon} {skill.title}</div>
                <div style={{fontSize:'12px', color:'var(--muted)', margin:'8px 0 12px'}}>
                  ★ {skill.rating} · {skill.students.toLocaleString()} students · {skill.level}
                </div>
                <div style={{display:'flex', flexDirection:'column', gap:'6px', marginBottom:'16px'}}>
                  {reasons.map((r, i) => (
                    <span key={i} className="badge" style={{margin:0, width:'fit-content', fontSize:'11px', padding:'6px 12px'}}>
                      {r}
                    </span>
                  ))}
                </div>
                <div className="continue-meta">
                  <button className="btn-outline" onClick={() => toggleWishlist(skill.id)}>
                    {wishlisted ? '★ Wishlisted' : '☆ Wishlist'}
                  </button>
                  <Link to={`/skill/${skill.id}`} className="btn-solid">View skill →</Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}
