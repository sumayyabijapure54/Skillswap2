import React from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { skills, categories } from '../data/skills.js';
import { mentors } from '../data/mentors.js';
import { useCommunity } from '../context/CommunityContext.jsx';
import SkillIcon3D from '../components/SkillIcon3D.jsx';

const TABS = [
  { key:'all', label:'All' },
  { key:'skills', label:'Skills' },
  { key:'mentors', label:'Mentors' },
  { key:'community', label:'Community' }
];

export default function Search(){
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const { posts } = useCommunity();
  const q = params.get('q') || '';
  const [input, setInput] = React.useState(q);
  const [tab, setTab] = React.useState('all');

  React.useEffect(()=>{ setInput(q); }, [q]);

  const onSubmit = (e)=>{
    e.preventDefault();
    setParams(input ? { q: input } : {});
  };

  const needle = q.trim().toLowerCase();

  const skillResults = needle ? skills.filter(s =>
    s.title.toLowerCase().includes(needle) || s.description.toLowerCase().includes(needle) || s.tags.some(t=>t.toLowerCase().includes(needle))
  ) : [];
  const mentorResults = needle ? mentors.filter(m =>
    m.name.toLowerCase().includes(needle) || m.role.toLowerCase().includes(needle) || m.tags.some(t=>t.toLowerCase().includes(needle))
  ) : [];
  const postResults = needle ? posts.filter(p =>
    p.title.toLowerCase().includes(needle) || p.description.toLowerCase().includes(needle)
  ) : [];

  const totalCount = skillResults.length + mentorResults.length + postResults.length;
  const showSkills = tab==='all' || tab==='skills';
  const showMentors = tab==='all' || tab==='mentors';
  const showPosts = tab==='all' || tab==='community';

  return (
    <div className="page-header">
      <div className="eyebrow">Search</div>
      <h1>Search <span className="g">SkillSwap</span></h1>
      <p>Find skills, mentors, and community posts all in one place.</p>

      <form className="explore-search" style={{maxWidth:'560px', marginTop:'24px', marginBottom:'0'}} onSubmit={onSubmit}>
        <input type="text" autoFocus placeholder="Search for anything…" value={input} onChange={e=>setInput(e.target.value)} />
        <span>⌕</span>
      </form>

      {!needle ? (
        <div className="dash-empty" style={{marginTop:'40px', maxWidth:'560px'}}>Start typing to search skills, mentors, and community posts.</div>
      ) : (
        <>
          <div className="notif-toolbar" style={{marginTop:'34px'}}>
            <div className="tag-pills" style={{marginBottom:0}}>
              {TABS.map(t=>(
                <span key={t.key} onClick={()=>setTab(t.key)} style={tab===t.key?{color:'var(--accent)', borderColor:'var(--accent)'}:{}}>{t.label}</span>
              ))}
            </div>
            <div className="count" style={{color:'var(--muted)', fontSize:'13.5px'}}>{totalCount} result{totalCount!==1?'s':''} for "{q}"</div>
          </div>

          {totalCount===0 ? (
            <div className="dash-empty">No results for "{q}". Try a different search term.</div>
          ) : (
            <>
              {showSkills && skillResults.length>0 && (
                <div style={{marginBottom:'40px'}}>
                  <h3 style={{fontSize:'14px', marginBottom:'14px', color:'var(--muted)'}}>Skills</h3>
                  <div className="explore-grid">
                    {skillResults.map(s=>{
                      const cat = categories.find(c=>c.key===s.category);
                      return (
                        <Link to={`/skill/${s.id}`} className="explore-card" key={s.id}>
                          <SkillIcon3D category={s.category} />
                          <span className="cat">{cat?.label}</span>
                          <h3>{s.title}</h3>
                          <div className="desc">{s.description.slice(0,90)}…</div>
                          <div className="meta"><span>★ <b>{s.rating}</b></span><span><b>{s.students.toLocaleString()}</b> students</span></div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {showMentors && mentorResults.length>0 && (
                <div style={{marginBottom:'40px'}}>
                  <h3 style={{fontSize:'14px', marginBottom:'14px', color:'var(--muted)'}}>Mentors</h3>
                  <div className="mentor-grid">
                    {mentorResults.map(m=>(
                      <Link to={`/mentor/${m.id}`} className="mentor-card" key={m.id} style={{textDecoration:'none', color:'inherit'}}>
                        <div className="mentor-top"><div className="mentor-badge">${m.rate}/session</div><div className="mentor-avatar">{m.avatar ? <img src={m.avatar} alt={m.name} /> : m.initials}</div></div>
                        <div className="mentor-body">
                          <b>{m.name}</b>
                          <div className="role">{m.role}</div>
                          <div className="rating">★ {m.rating} ({m.reviews})</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {showPosts && postResults.length>0 && (
                <div style={{marginBottom:'40px'}}>
                  <h3 style={{fontSize:'14px', marginBottom:'14px', color:'var(--muted)'}}>Community posts</h3>
                  <div className="community-list">
                    {postResults.map(p=>(
                      <div className="community-post" key={p.id}>
                        <div className="community-post-head">
                          <div className="feed-item" style={{padding:0, borderBottom:'none'}}>
                            <div className="dot">{p.author.avatar ? <img src={p.author.avatar} alt={p.author.name} /> : p.author.initials}</div>
                            <p><b>{p.author.name}</b></p>
                          </div>
                          <span className={`post-type-badge ${p.type}`}>{p.type==='offer' ? '🎓 Offering' : '🔍 Looking for'}</span>
                        </div>
                        <h3>{p.title}</h3>
                        <p className="desc">{p.description}</p>
                        <div className="community-post-actions">
                          <button className="btn-outline" onClick={()=>navigate('/community')}>View in feed</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
