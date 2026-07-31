import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout.jsx';
import { useCommunity } from '../context/CommunityContext.jsx';
import { useCategories } from '../lib/skillsApi.js';

const TYPE_FILTERS = [
  { key:'all', label:'All posts' },
  { key:'offer', label:'Offering' },
  { key:'request', label:'Looking for' }
];

export default function Community(){
  const { posts, relativeTime } = useCommunity();
  const navigate = useNavigate();
  const { categories } = useCategories();
  const [type, setType] = React.useState('all');
  const [cat, setCat] = React.useState('all');
  const [query, setQuery] = React.useState('');

  const filtered = posts.filter(p=>{
    const matchesType = type==='all' || p.type===type;
    const matchesCat = cat==='all' || p.category===cat;
    const matchesQuery = !query || p.title.toLowerCase().includes(query.toLowerCase()) || p.description.toLowerCase().includes(query.toLowerCase());
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

      {filtered.length===0 ? (
        <div className="dash-empty">No posts match your filters yet.</div>
      ) : (
        <div className="community-list">
          {filtered.map(p=>{
            const cat2 = categories.find(c=>c.key===p.category);
            return (
              <div className="community-post" key={p.id}>
                <div className="community-post-head">
                  <div className="feed-item" style={{padding:0, borderBottom:'none'}}>
                    <div className="dot">{p.author.initials}</div>
                    <p><b>{p.author.name}</b><br /><span>{relativeTime(p.createdAt)}</span></p>
                  </div>
                  <span className={`post-type-badge ${p.type}`}>{p.type==='offer' ? '🎓 Offering' : '🔍 Looking for'}</span>
                </div>
                <h3>{p.title}</h3>
                <p className="desc">{p.description}</p>
                <div className="mentor-tags">
                  <span>{cat2?.icon} {cat2?.label}</span>
                  {p.tags.map(t=><span key={t}>{t}</span>)}
                </div>
                <div className="community-post-actions">
                  <button className="btn-outline" onClick={()=>navigate('/messages')}>Connect</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}
