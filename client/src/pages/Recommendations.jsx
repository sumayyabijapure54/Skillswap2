import React from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout.jsx';
import { useUser } from '../context/UserContext.jsx';
import { useCategories, useSkills } from '../lib/skillsApi.js';
import { getAIRecommendations } from '../lib/aiRecommendations.js';
import { Skeleton } from '../components/Skeleton.jsx';
import EmptyState from '../components/EmptyState.jsx';
import ScrollReveal from '../components/ScrollReveal.jsx';
import TiltCard from '../components/TiltCard.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function Recommendations(){
  const user = useUser();
  const { profile, wishlist, toggleWishlist } = user;
  const { categories } = useCategories();
  const { skills, loading: skillsLoading } = useSkills();
  const toast = useToast();

  const [thinking, setThinking] = React.useState(false);
  const [seed, setSeed] = React.useState(0);

  const recs = React.useMemo(
    () => getAIRecommendations(user, { limit: 6 }, { skills, categories }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user.enrolled, user.wishlist, profile.interests, profile.skillsWanted, seed, skills, categories]
  );

  const regenerate = () => {
    setThinking(true);
    setTimeout(() => {
      setSeed(s => s + 1);
      setThinking(false);
      toast.success('Recommendations refreshed.');
    }, 900);
  };

  const handleWishlist = (id, title, wasWishlisted) => {
    toggleWishlist(id);
    toast.info(wasWishlisted ? `Removed "${title}" from your wishlist` : `Added "${title}" to your wishlist`);
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

      {thinking || skillsLoading ? (
        <div className="continue-grid">
          {Array.from({ length: 3 }).map((_, i) => (
            <div className="continue-card" key={i}>
              <Skeleton height="13px" width="60%" style={{ marginBottom: '14px' }} />
              <Skeleton height="10px" width="80%" style={{ margin: '8px 0 16px' }} />
              <Skeleton height="24px" width="70%" radius="100px" style={{ marginBottom: '16px' }} />
              <Skeleton height="12px" width="100%" />
            </div>
          ))}
        </div>
      ) : recs.length === 0 ? (
        <EmptyState
          icon="✨"
          title="Nothing to recommend yet"
          text="Add a few interests on your profile so we can tailor picks for you."
          ctaLabel="Go to profile"
          ctaTo="/profile"
        />
      ) : (
        <ScrollReveal as="div" className="continue-grid" stagger>
          {recs.map(({ skill, reasons }) => {
            const cat = categories.find(c => c.key === skill.category);
            const wishlisted = wishlist.includes(skill.id);
            return (
              <TiltCard as="div" className="continue-card" key={skill.id}>
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
                  <button className="btn-outline" onClick={() => handleWishlist(skill.id, skill.title, wishlisted)}>
                    {wishlisted ? '★ Wishlisted' : '☆ Wishlist'}
                  </button>
                  <Link to={`/skill/${skill.id}`} className="btn-solid">View skill →</Link>
                </div>
              </TiltCard>
            );
          })}
        </ScrollReveal>
      )}
    </DashboardLayout>
  );
}
