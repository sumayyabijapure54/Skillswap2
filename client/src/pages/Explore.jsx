import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { categories, levels, skills } from '../data/skills.js';
import SkillIcon3D from '../components/SkillIcon3D.jsx';

export default function Explore(){
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = React.useState(params.get('q') || '');
  const [activeCats, setActiveCats] = React.useState(params.get('cat') ? [params.get('cat')] : []);
  const [activeLevels, setActiveLevels] = React.useState([]);
  const [sort, setSort] = React.useState('popular');

  const toggleCat = (key)=>{
    setActiveCats(prev => prev.includes(key) ? prev.filter(k=>k!==key) : [...prev, key]);
  };
  const toggleLevel = (lvl)=>{
    setActiveLevels(prev => prev.includes(lvl) ? prev.filter(l=>l!==lvl) : [...prev, lvl]);
  };

  const filtered = React.useMemo(()=>{
    let list = skills.filter(s=>{
      const matchesQuery = !query || s.title.toLowerCase().includes(query.toLowerCase()) || s.tags.some(t=>t.toLowerCase().includes(query.toLowerCase()));
      const matchesCat = activeCats.length===0 || activeCats.includes(s.category);
      const matchesLevel = activeLevels.length===0 || activeLevels.includes(s.level);
      return matchesQuery && matchesCat && matchesLevel;
    });
    if(sort==='rating') list = [...list].sort((a,b)=>b.rating-a.rating);
    else if(sort==='students') list = [...list].sort((a,b)=>b.students-a.students);
    else if(sort==='az') list = [...list].sort((a,b)=>a.title.localeCompare(b.title));
    return list;
  }, [query, activeCats, activeLevels, sort]);

  React.useEffect(()=>{
    const next = new URLSearchParams();
    if(query) next.set('q', query);
    if(activeCats.length===1) next.set('cat', activeCats[0]);
    setParams(next, { replace:true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, activeCats]);

  return (
    <>
      <div className="page-header">
        <div className="eyebrow">Discover</div>
        <h1>Explore <span className="g">Skills</span></h1>
        <p>Browse the full catalog of free-to-learn content and mentor-led skills. Filter by category, level, and search for exactly what you want to grow.</p>
      </div>

      <div className="explore-wrap">
        <aside className="filter-panel">
          <div className="filter-group">
            <h4>Category</h4>
            {categories.map(c=>{
              const count = skills.filter(s=>s.category===c.key).length;
              return (
                <label className="filter-option" key={c.key}>
                  <input type="checkbox" checked={activeCats.includes(c.key)} onChange={()=>toggleCat(c.key)} />
                  {c.icon} {c.label}
                  <span className="filter-count">{count}</span>
                </label>
              );
            })}
          </div>
          <div className="filter-group">
            <h4>Level</h4>
            {levels.map(lvl=>(
              <label className="filter-option" key={lvl}>
                <input type="checkbox" checked={activeLevels.includes(lvl)} onChange={()=>toggleLevel(lvl)} />
                {lvl}
              </label>
            ))}
          </div>
          {(activeCats.length>0 || activeLevels.length>0 || query) && (
            <button className="linklike" style={{marginTop:'8px'}} onClick={()=>{ setActiveCats([]); setActiveLevels([]); setQuery(''); }}>
              Clear all filters
            </button>
          )}
        </aside>

        <div>
          <div className="explore-search">
            <input type="text" placeholder="Search skills, tags, or mentors…" value={query} onChange={e=>setQuery(e.target.value)} />
            <span>⌕</span>
          </div>

          <div className="explore-toolbar">
            <div className="count">{filtered.length} skill{filtered.length!==1?'s':''} found</div>
            <select value={sort} onChange={e=>setSort(e.target.value)}>
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="students">Most Students</option>
              <option value="az">A–Z</option>
            </select>
          </div>

          {filtered.length===0 ? (
            <div className="explore-empty">No skills match your filters yet. Try clearing a filter or searching a different term.</div>
          ) : (
            <div className="explore-grid">
              {filtered.map(s=>{
                const cat = categories.find(c=>c.key===s.category);
                return (
                  <Link to={`/skill/${s.id}`} className="explore-card" key={s.id}>
                    <SkillIcon3D category={s.category} />
                    <span className="cat">{cat?.label}</span>
                    <h3>{s.title}</h3>
                    <div className="desc">{s.description.slice(0,90)}…</div>
                    <div className="meta">
                      <span>★ <b>{s.rating}</b></span>
                      <span><b>{s.students.toLocaleString()}</b> students</span>
                      <span><b>{s.level}</b></span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
