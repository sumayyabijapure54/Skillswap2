import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OrbitalOrb from '../components/OrbitalOrb.jsx';
import Counter from '../components/Counter.jsx';
import TiltCard from '../components/TiltCard.jsx';
import ScrollReveal from '../components/ScrollReveal.jsx';
import SplitTextReveal from '../components/SplitTextReveal.jsx';
import Marquee from '../components/Marquee.jsx';
import TestimonialCarousel from '../components/TestimonialCarousel.jsx';
import useParallax from '../hooks/useParallax.js';
import { useCategories, useSkills } from '../lib/skillsApi.js';

const communityTestimonials = [
  { author: 'Rohan Mehta', rating: 5, text: 'SkillSwap helped me learn React in just 2 weeks! The community is amazing and so supportive.' },
  { author: 'Priya Sharma', rating: 5, text: 'I love teaching on SkillSwap. It feels great to share knowledge and learn new things in return.' },
  { author: 'Daniela Ruiz', rating: 5, text: 'Found a mentor for Figma within a day. The whole match-and-book flow just works.' },
  { author: 'James Okoye', rating: 4, text: 'Teaching JavaScript here pushed me to explain things clearly — I learned as much as my students did.' }
];

export default function Home(){
  const navigate = useNavigate();
  const { categories } = useCategories();
  const { skills } = useSkills();

  const topMentors = React.useMemo(() => {
    const seen = new Set();
    const out = [];
    for (const s of [...skills].sort((a,b)=> (b.mentor?.rating||0) - (a.mentor?.rating||0))){
      const m = s.mentor;
      if (!m?.id || seen.has(m.id)) continue;
      seen.add(m.id);
      out.push({ ...m, skillId: s.id });
      if (out.length >= 4) break;
    }
    return out;
  }, [skills]);
  const [query, setQuery] = React.useState('');
  const orbParallaxRef = useParallax(0.08);

  const onSearch = (e)=>{
    e.preventDefault();
    navigate(query ? `/explore?q=${encodeURIComponent(query)}` : '/explore');
  };

  return (
    <>
      <div className="hero">
        <div className="hero-left">
          <div className="badge">✦ Join our global community</div>
          <SplitTextReveal as="h1" type="chars">
            Exchange Skills.<br /><span className="g">Grow Together.</span>
          </SplitTextReveal>
          <p className="sub">Teach what you know. Learn what you love. Build connections that last a lifetime.</p>

          <form className="search-box" onSubmit={onSearch}>
            <input type="text" placeholder="What do you want to learn?" value={query} onChange={e=>setQuery(e.target.value)} />
            <select><option>All Categories</option>{categories.map(c=><option key={c.key}>{c.label}</option>)}</select>
            <button type="submit">Search</button>
          </form>

          <div className="tag-pills">
            {['Web Development','Design','Languages','Marketing'].map(t=>
              <span key={t} onClick={()=>navigate(`/explore?q=${encodeURIComponent(t)}`)}>{t}</span>
            )}
          </div>

          <div className="cta-row">
            <Link to="/explore" className="btn-primary-lg">Start Learning →</Link>
            <Link to="/help" className="btn-ghost-lg">Become a Mentor</Link>
          </div>

          <div className="avatars-row">
            <div className="avatar-stack"><div>A</div><div>M</div><div>J</div><div>P</div></div>
            <div className="txt"><b>25K+</b>Active community members</div>
          </div>
        </div>

        <div className="hero-right" ref={orbParallaxRef}>
          <OrbitalOrb />
        </div>
      </div>

      <ScrollReveal className="stats-bar" as="div">
        <div className="stat-item"><div className="ic">👥</div><div><div className="num"><Counter target={25000} /></div><div className="lbl">Active learners</div></div></div>
        <div className="stat-item"><div className="ic">▦</div><div><div className="num"><Counter target={1200} /></div><div className="lbl">Skills available</div></div></div>
        <div className="stat-item"><div className="ic">⇄</div><div><div className="num"><Counter target={15000} /></div><div className="lbl">Successful swaps</div></div></div>
        <div className="stat-item"><div className="ic">🌐</div><div><div className="num"><Counter target={85} /></div><div className="lbl">Countries</div></div></div>
        <div className="stat-item"><div className="ic">★</div><div><div className="num">4.9</div><div className="lbl">User rating (12K reviews)</div></div></div>
      </ScrollReveal>

      <Marquee items={categories.map(c=>`${c.icon} ${c.label}`)} />

      <section id="skills">
        <div className="section-head"><h2>Explore <span className="g">Popular</span> Skills</h2><Link to="/explore">View all categories →</Link></div>
        <ScrollReveal className="skills-grid" as="div" stagger>
          {categories.map(c=>(
            <TiltCard as={Link} to={`/explore?cat=${c.key}`} className="skill-tile" key={c.key}>
              <div className="ic">{c.icon}</div>
              <b>{c.label}</b>
              <span>{c.count}+ Skills</span>
            </TiltCard>
          ))}
        </ScrollReveal>
      </section>

      <section id="mentors">
        <div className="section-head"><h2>Top Rated Mentors</h2><Link to="/explore">View all mentors →</Link></div>
        <ScrollReveal className="mentor-grid" as="div" stagger>
          {topMentors.map(m=>(
            <TiltCard as={Link} to={`/mentor/${m.skillId}`} className="mentor-card" key={m.id} style={{textDecoration:'none', color:'inherit'}}>
              <div className="mentor-top"><div className="mentor-badge">Top Mentor</div><div className="mentor-avatar">{m.initials}</div></div>
              <div className="mentor-body">
                <b>{m.name}</b>
                <div className="role">{m.role}</div>
                <div className="rating">★ {m.rating} ({m.reviews})</div>
                <div className="mentor-avail">Available</div>
              </div>
            </TiltCard>
          ))}
        </ScrollReveal>
      </section>

      <section id="how">
        <div className="section-head" style={{justifyContent:'center'}}><h2>How <span className="g">SkillSwap</span> Works</h2></div>
        <ScrollReveal className="steps" as="div">
          <div className="step"><div className="num-circle">1</div><b>Create Profile</b><span>Tell us your skills and what you want to learn.</span></div>
          <div className="step"><div className="num-circle">2</div><b>Find &amp; Connect</b><span>Discover people with complementary skills and connect.</span></div>
          <div className="step"><div className="num-circle">3</div><b>Start Learning</b><span>Exchange knowledge, schedule sessions, and learn together.</span></div>
          <div className="step"><div className="num-circle">4</div><b>Grow Together</b><span>Build strong relationships and grow your expertise.</span></div>
        </ScrollReveal>
      </section>

      <section>
        <div className="ai-panel">
          <div className="ai-left">
            <div className="badge">✦ AI powered</div>
            <h2>Smart Matches.<br />Better Learning.</h2>
            <p>Our AI helps you find the perfect skill partners and learning opportunities.</p>
            <Link to="/explore" className="btn-primary-lg">Explore AI Matching</Link>
            <div className="ai-feature-grid">
              <div className="ai-feature"><div className="ic">◈</div><div><b>Smart Matching</b><span>95% match accuracy</span></div></div>
              <div className="ai-feature"><div className="ic">↗</div><div><b>Learning Path</b><span>AI powered roadmap</span></div></div>
              <div className="ai-feature"><div className="ic">★</div><div><b>Recommendations</b><span>Personalized for you</span></div></div>
              <div className="ai-feature"><div className="ic">💬</div><div><b>Chat Assistant</b><span>Get help anytime</span></div></div>
            </div>
          </div>
          <div className="ai-right">
            <div className="bot-platform">
              <div className="bot">
                <div className="antenna"></div>
                <div className="head"><div className="eye l"></div><div className="eye r"></div></div>
                <div className="body-b"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="community">
        <ScrollReveal className="three-col" as="div">
          <div className="col-card">
            <h3>Active Community</h3><div className="desc">See what's happening</div>
            <div className="feed-item"><div className="dot">M</div><p><b>Maria</b> learned Figma from Alex<br /><span>2 hours ago</span></p></div>
            <div className="feed-item"><div className="dot">J</div><p><b>James</b> taught JavaScript to Priya<br /><span>5 hours ago</span></p></div>
            <div className="feed-item"><div className="dot">S</div><p><b>Sophia &amp; Daniel</b> are learning Photoshop together<br /><span>1 day ago</span></p></div>
          </div>
          <div className="col-card">
            <h3>What Our Community Says</h3><div className="desc">Real stories, real growth</div>
            <TestimonialCarousel testimonials={communityTestimonials} />
          </div>
          <div className="col-card">
            <h3>Upcoming Sessions</h3><div className="desc">Join live sessions and workshops</div>
            <div className="session-item"><div className="session-date">24<br />MAY</div><div className="session-info"><b>Mastering Python Basics</b><span>John Doe · 7:00 PM IST</span></div><button>Join</button></div>
            <div className="session-item"><div className="session-date">25<br />MAY</div><div className="session-info"><b>UI/UX Design Workshop</b><span>Sarah Williams · 8:00 PM IST</span></div><button>Join</button></div>
            <div className="session-item"><div className="session-date">26<br />MAY</div><div className="session-info"><b>Advanced Excel Tips</b><span>Daniel Smith · 8:00 PM IST</span></div><button>Join</button></div>
          </div>
        </ScrollReveal>
      </section>

      <section>
        <ScrollReveal className="final-cta" as="div">
          <div><h2>Start your learning journey today!</h2><p>Join thousands of learners and mentors worldwide and start exchanging skills.</p></div>
          <ul><li>Unlimited skill exchanges</li><li>Priority mentor support</li><li>Advanced AI matching</li><li>Certificates &amp; badges</li></ul>
          <Link to="/explore" className="btn-white">Join Now — It's Free →</Link>
        </ScrollReveal>
      </section>
    </>
  );
}
