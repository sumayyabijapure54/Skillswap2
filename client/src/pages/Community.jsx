import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout.jsx';
import { useUser } from '../context/UserContext.jsx';
import { useCategories } from '../lib/skillsApi.js';
import { api } from '../lib/api.js';

const TYPE_FILTERS = [
  { key:'all', label:'All posts' },
  { key:'offer', label:'Offering' },
  { key:'request', label:'Looking for' }
];

function relativeTime(iso){
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs/60000);
  if (mins < 60) return `${Math.max(mins,1)}m ago`;
  const hrs = Math.floor(mins/60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs/24);
  return `${days}d ago`;
}

export default function Community(){
  const { profile } = useUser();
  const navigate = useNavigate();
  const { categories } = useCategories();
  const [posts, setPosts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [type, setType] = React.useState('all');
  const [cat, setCat] = React.useState('all');
  const [query, setQuery] = React.useState('');

  React.useEffect(()=>{
    api.get('/api/community')
      .then(data => setPosts(data.posts || []))
      .catch(()=>{})
      .finally(()=>setLoading(false));
  }, []);

  const toggleLike = async (id) => {
    setPosts(ps => ps.map(p => p.id===id
      ? { ...p, likedByMe: !p.likedByMe, likeCount: p.likeCount + (p.likedByMe ? -1 : 1) }
      : p));
    try{
      const data = await api.post(`/api/community/${id}/like`, {});
      setPosts(ps => ps.map(p => p.id===id ? data.post : p));
    }catch{ /* optimistic — will drift back into sync on next reload */ }
  };

  const filtered = posts.filter(p=>{
    const matchesType = type==='all' || p.type===type;
    const matchesCat = cat==='all' || p.category===cat;
    const q = query.toLowerCase();
    const matchesQuery = !q || (p.title||'').toLowerCase().includes(q) || (p.text||'').toLowerCase().includes(q);
    return matchesType && matchesCat && matchesQuery;
  });

  return (
    <DashboardLayout title="Community Feed" subtitle="See what other members are offering to teach, or hoping to learn.">
      <div className="explore-search" style={{marginBottom:'18px'}}>
        <input type="text" placeholder="Search posts…" value={query} onChange={e=>setQuery(e.target.value)} />
        <span>⌕</span>
      </div>

      <div className="notif-toolbar">
        <div className="tag-pills" style={{marginBottom:0}}>
          {TYPE_FILTERS.map(f=>(
            <span key={f.key} onClick={()=>setType(f.key)} style={type===f.key?{color:'var(--accent)', borderColor:'var(--accent)'}:{}}>{f.label}</span>
          ))}
        </div>
        <select value={cat} onChange={e=>setCat(e.target.value)} style={{background:'var(--panel)', border:'1px solid var(--border)', color:'var(--text)', padding:'9px 14px', borderRadius:'10px', fontSize:'13px'}}>
          <option value="all">All categories</option>
          {categories.map(c=><option value={c.key} key={c.key}>{c.icon} {c.label}</option>)}
        </select>
      </div>

      <div style={{display:'flex', justifyContent:'flex-end', marginBottom:'18px'}}>
        <Link to="/post-skill" className="btn-solid">＋ Post a skill</Link>
      </div>

      {loading ? (
        <div className="dash-empty">Loading posts…</div>
      ) : filtered.length===0 ? (
        <div className="dash-empty">No posts match your filters yet.</div>
      ) : (
        <div className="community-list">
          {filtered.map(p=>{
            const cat2 = categories.find(c=>c.key===p.category);
            const isMine = p.authorId === profile.id;
            return (
              <div className="community-post" key={p.id}>
                <div className="community-post-head">
                  <div className="feed-item" style={{padding:0, borderBottom:'none'}}>
                    <div className="dot">{p.authorInitials}</div>
                    <p><b>{p.authorName}</b><br /><span>{relativeTime(p.createdAt)}</span></p>
                  </div>
                  <span className={`post-type-badge ${p.type}`}>{p.type==='offer' ? '🎓 Offering' : '🔍 Looking for'}</span>
                </div>
                {p.title && <h3>{p.title}</h3>}
                <p className="desc">{p.text}</p>
                <div className="mentor-tags">
                  {cat2 && <span>{cat2.icon} {cat2.label}</span>}
                  {(p.tags||[]).map(t=><span key={t}>{t}</span>)}
                </div>
                <div className="community-post-actions">
                  <button className={`btn-outline ${p.likedByMe?'active':''}`} onClick={()=>toggleLike(p.id)}>
                    {p.likedByMe ? '♥' : '♡'} {p.likeCount || 0}
                  </button>
                  {!isMine && (
                    <button className="btn-outline" onClick={()=>navigate(`/messages?user=${p.authorId}`)}>Connect</button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}
