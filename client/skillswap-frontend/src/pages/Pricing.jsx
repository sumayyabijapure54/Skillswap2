import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext.jsx';

const PLANS = [
  {
    key:'free', name:'Free', price:0, tagline:'Learn and swap skills at no cost.',
    features:['Unlimited free-to-learn courses', 'Post skill offers & requests', 'Community feed & messaging', 'Basic AI matching', '1 mentor session credit / month'],
    cta:'Get started', highlight:false
  },
  {
    key:'plus', name:'Plus', price:12, tagline:'For consistent learners who book regularly.',
    features:['Everything in Free', 'Unlimited mentor sessions (pay-per-session pricing)', 'Priority AI matching & recommendations', 'Certificates on every completed skill', 'Priority support'],
    cta:'Upgrade to Plus', highlight:true
  },
  {
    key:'mentor-pro', name:'Mentor Pro', price:19, tagline:'For mentors who teach regularly and want lower fees.',
    features:['Everything in Plus', 'Reduced marketplace fee on paid sessions', 'Mentor Dashboard analytics', 'Featured placement in Explore & Search', 'Early access to new features'],
    cta:'Upgrade to Mentor Pro', highlight:false
  }
];

const FAQ = [
  { q:'Is SkillSwap really free to use?', a:'Yes — browsing, learning free content, posting skill exchanges, and messaging are all free forever on the Free plan. Paid mentor sessions are billed per session regardless of plan.' },
  { q:'What are session credits?', a:'Each month, Free plan members get 1 mentor session credit that covers the cost of a typical Quick Chat session. Unused credits don\'t roll over.' },
  { q:'Can I cancel anytime?', a:'Yes, plans are month-to-month with no lock-in — cancel anytime from Account Settings and you\'ll keep access until the end of your billing period.' }
];

export default function Pricing(){
  const { authed } = useUser();

  return (
    <>
      <div className="page-header" style={{textAlign:'center', margin:'0 auto'}}>
        <div className="eyebrow" style={{textAlign:'center'}}>Pricing</div>
        <h1>Simple, <span className="g">honest</span> pricing</h1>
        <p style={{margin:'0 auto'}}>Learn for free, forever. Upgrade only if you want unlimited mentor sessions or lower fees as a mentor.</p>
      </div>

      <section style={{paddingTop:0}}>
        <div className="pricing-grid">
          {PLANS.map(p=>(
            <div className={`pricing-card ${p.highlight?'highlight':''}`} key={p.key}>
              {p.highlight && <div className="pricing-badge">Most popular</div>}
              <h3>{p.name}</h3>
              <div className="pricing-amount"><span>$</span>{p.price}<small>/mo</small></div>
              <p className="desc">{p.tagline}</p>
              <ul className="pricing-features">
                {p.features.map(f=><li key={f}>✓ {f}</li>)}
              </ul>
              <Link to={authed ? '/wallet' : '/signup'} className={p.highlight ? 'btn-primary-lg' : 'btn-ghost-lg'} style={{width:'100%', textAlign:'center', display:'block'}}>{p.cta}</Link>
            </div>
          ))}
        </div>
      </section>

      <section style={{paddingTop:0}}>
        <div className="section-head" style={{justifyContent:'center'}}><h2>Pricing <span className="g">FAQ</span></h2></div>
        <div className="faq-wrap" style={{padding:0, maxWidth:'760px'}}>
          {FAQ.map((f,i)=>(
            <FaqRow key={i} q={f.q} a={f.a} />
          ))}
        </div>
      </section>
    </>
  );
}

function FaqRow({ q, a }){
  const [open, setOpen] = React.useState(false);
  return (
    <div className={`faq-item ${open?'open':''}`}>
      <div className="faq-q" onClick={()=>setOpen(o=>!o)}>{q}<span className="chev">▾</span></div>
      <div className="faq-a"><p>{a}</p></div>
    </div>
  );
}
