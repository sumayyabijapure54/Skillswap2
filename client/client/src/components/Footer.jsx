import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext.jsx';

export default function Footer(){
  const { theme, toggleTheme } = useTheme();
  return (
    <footer>
      <div className="foot-grid">
        <div className="foot-brand">
          <Link to="/" className="brand"><div className="mark">S</div><div><div className="name">SkillSwap</div></div></Link>
          <p>A global community for skill sharing and personal growth.</p>
          <div className="foot-socials"><div>𝕏</div><div>in</div><div>◎</div><div>▶</div></div>
        </div>
        <div>
          <h4>Explore</h4>
          <ul>
            <li><Link to="/explore">Browse Skills</Link></li>
            <li><Link to="/explore">Find Mentors</Link></li>
            <li><Link to="/community">Community</Link></li>
            <li><Link to="/#how">How it Works</Link></li>
          </ul>
        </div>
        <div>
          <h4>Company</h4>
          <ul>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/careers">Careers</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/blog">Blog</Link></li>
          </ul>
        </div>
        <div>
          <h4>Support</h4>
          <ul>
            <li><Link to="/help">Help Center</Link></li>
            <li><Link to="/help">Safety Tips</Link></li>
            <li><Link to="/legal">Terms of Service</Link></li>
            <li><Link to="/legal">Privacy Policy</Link></li>
          </ul>
        </div>
        <div>
          <h4>Stay Updated</h4>
          <p style={{fontSize:'12.5px', marginBottom:'10px'}}>Get the latest updates and learning tips.</p>
          <div className="foot-newsletter">
            <input type="text" placeholder="Enter your email" />
            <button>→</button>
          </div>
        </div>
      </div>
      <div className="foot-bottom">
        <span>© 2026 SkillSwap. All rights reserved.</span>
        <button className="foot-theme-toggle" onClick={toggleTheme}>
          {theme === 'dark' ? '🌙 Dark mode' : '☀️ Light mode'}
        </button>
      </div>
    </footer>
  );
}
