import React from 'react';

const HELP_CATS = [
  { icon:'🎓', title:'Learning', desc:'Lessons, progress, certificates' },
  { icon:'🧑‍🏫', title:'Mentors & Booking', desc:'Sessions, scheduling, cancellations' },
  { icon:'💳', title:'Payments', desc:'Billing, refunds, wallet credits' },
  { icon:'👤', title:'Account', desc:'Profile, security, notifications' }
];

const FAQS = [
  { q:'How do I start learning for free?', a:'Just open any Skill Detail page and press play on the first lesson — no account needed. You only need to sign up when you want to save progress, book a mentor, or post your own skill.' },
  { q:'How does the skill exchange work?', a:"Post a skill you can teach and one you want to learn on the Post a Skill page. SkillSwap matches you with members who want what you're offering, and you arrange a swap instead of, or alongside, paid sessions." },
  { q:'What happens if my mentor doesn\'t show up?', a:'You\'re refunded automatically in full — no request needed. See the Refund Policy on the Legal page for the full breakdown.' },
  { q:'Can I switch between learning and mentoring?', a:'Yes. Learner and Mentor dashboards share the same account and navigation shell, so you can opt into mentoring at any time once you\'ve built up some completed courses or reviews.' },
  { q:'Is there a mobile app?', a:'Not yet in this MVP phase — the web app is fully responsive and works well on mobile browsers in the meantime.' }
];

export default function Help(){
  const [query, setQuery] = React.useState('');
  const [openIdx, setOpenIdx] = React.useState(0);

  const filtered = FAQS.filter(f => !query || f.q.toLowerCase().includes(query.toLowerCase()) || f.a.toLowerCase().includes(query.toLowerCase()));

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
          <div className="help-cat-card" key={c.title}>
            <div className="ic">{c.icon}</div>
            <b>{c.title}</b>
            <span>{c.desc}</span>
          </div>
        ))}
      </div>

      <div className="faq-wrap">
        <div className="section-head"><h2>Frequently asked <span className="g">questions</span></h2></div>
        {filtered.length===0 ? (
          <div className="explore-empty">No results for "{query}". Try a different search term.</div>
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
