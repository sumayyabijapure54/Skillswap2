import React from 'react';

const HELP_CATS = [
  { icon:'🎓', title:'Learning', desc:'Lessons, progress, certificates' },
  { icon:'🧑‍🏫', title:'Mentors & Booking', desc:'Sessions, scheduling, cancellations' },
  { icon:'💳', title:'Payments', desc:'Billing, refunds, wallet credits' },
  { icon:'👤', title:'Account', desc:'Profile, security, notifications' }
];

// Each FAQ is tagged with the HELP_CATS.title it belongs to, so clicking a
// category card filters this same list instead of duplicating it elsewhere.
const FAQS = [
  { q:'How do I start learning for free?', a:'Just open any Skill Detail page and press play on the first lesson — no account needed. You only need to sign up when you want to save progress, book a mentor, or post your own skill.', cat:'Learning' },
  { q:'How does the skill exchange work?', a:"Post a skill you can teach and one you want to learn on the Post a Skill page. SkillSwap matches you with members who want what you're offering, and you arrange a swap instead of, or alongside, paid sessions.", cat:'Learning' },
  { q:'What happens if my mentor doesn\'t show up?', a:'You\'re refunded automatically in full — no request needed. See the Refund Policy on the Legal page for the full breakdown.', cat:'Mentors & Booking' },
  { q:'Can I switch between learning and mentoring?', a:'Yes. Learner and Mentor dashboards share the same account and navigation shell, so you can opt into mentoring at any time once you\'ve built up some completed courses or reviews.', cat:'Mentors & Booking' },
  { q:'Is there a mobile app?', a:'Not yet in this MVP phase — the web app is fully responsive and works well on mobile browsers in the meantime.', cat:'Account' }
];

export default function Help(){
  const [query, setQuery] = React.useState('');
  const [openIdx, setOpenIdx] = React.useState(0);
  const [activeCat, setActiveCat] = React.useState(null);
  const faqRef = React.useRef(null);

  const filtered = FAQS.filter(f =>
    (!activeCat || f.cat === activeCat) &&
    (!query || f.q.toLowerCase().includes(query.toLowerCase()) || f.a.toLowerCase().includes(query.toLowerCase()))
  );

  const onCategoryClick = (title) => {
    setActiveCat(prev => prev === title ? null : title);
    setOpenIdx(0);
    // Scroll the FAQ list into view so the filtered/selected category is
    // visible without the user having to manually scroll down themselves —
    // works the same on desktop, tablet, and mobile since it's just the
    // browser's own scroll behavior.
    requestAnimationFrame(() => faqRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };

  return (
    <>
      <div className="page-header" style={{textAlign:'center', margin:'0 auto'}}>
        <div className="eyebrow" style={{textAlign:'center'}}>Support</div>
        <h1>How can we <span className="g">help?</span></h1>
        <p style={{margin:'0 auto'}}>Search the help center, browse a category, or check the FAQ below.</p>
      </div>

      <form className="help-search" onSubmit={e=>e.preventDefault()}>
        <input type="text" placeholder="Search for answers…" value={query} onChange={e=>setQuery(e.target.value)} />
        <button type="submit">Search</button>
      </form>

      <div className="help-categories">
        {HELP_CATS.map(c=>(
          <div
            className={`help-cat-card ${activeCat===c.title ? 'active' : ''}`}
            key={c.title}
            role="button"
            tabIndex={0}
            onClick={()=>onCategoryClick(c.title)}
            onKeyDown={(e)=>{ if(e.key==='Enter' || e.key===' ') { e.preventDefault(); onCategoryClick(c.title); } }}
          >
            <div className="ic">{c.icon}</div>
            <b>{c.title}</b>
            <span>{c.desc}</span>
          </div>
        ))}
      </div>

      <div className="faq-wrap" ref={faqRef}>
        <div className="section-head">
          <h2>Frequently asked <span className="g">questions</span></h2>
          {activeCat && (
            <button type="button" className="btn-outline" style={{padding:'6px 14px', fontSize:'12px'}} onClick={()=>setActiveCat(null)}>
              Clear filter: {activeCat} ✕
            </button>
          )}
        </div>
        {filtered.length===0 ? (
          <div className="explore-empty">
            {activeCat && query
              ? `No results for "${query}" in ${activeCat}. Try a different search term or category.`
              : activeCat
                ? `No FAQs in ${activeCat} yet.`
                : `No results for "${query}". Try a different search term.`}
          </div>
        ) : filtered.map((f, i)=>(
          <div className={`faq-item ${openIdx===i?'open':''}`} key={f.q}>
            <div className="faq-q" onClick={()=>setOpenIdx(openIdx===i?-1:i)}>
              {f.q}<span className="chev">▾</span>
            </div>
            <div className="faq-a"><p>{f.a}</p></div>
          </div>
        ))}
      </div>
    </>
  );
}
