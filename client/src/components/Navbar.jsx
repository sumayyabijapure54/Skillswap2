import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext.jsx';
import ThemeToggle from './ThemeToggle.jsx';
import Avatar from './Avatar.jsx';
import Logo from './Logo.jsx';

export default function Navbar(){
  const navigate = useNavigate();
  const { authed, profile, notifications, logOut } = useUser();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const menuRef = React.useRef(null);
  const mobileRef = React.useRef(null);

  const unread = notifications.filter(n=>!n.read).length;

  React.useEffect(()=>{
    const onClick = (e)=>{
      if(menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
      if(mobileRef.current && !mobileRef.current.contains(e.target) && !e.target.closest('.nav-mobile-toggle')) setMobileOpen(false);
    };
    const onKey = (e)=>{ if(e.key === 'Escape'){ setMenuOpen(false); setMobileOpen(false); } };
    const onResize = ()=>{ if(window.innerWidth > 900) setMobileOpen(false); };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return ()=>{
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  // Close the mobile menu on route change (it re-renders since NavLink
  // stays mounted, so this listens to the same click events the links
  // themselves fire rather than needing a route effect).
  const closeMobile = () => setMobileOpen(false);

  const doLogout = ()=>{
    logOut();
    setMenuOpen(false);
    closeMobile();
    navigate('/');
  };

  return (
    <nav className="topnav">
      <Link to="/" className="brand">
        <Logo tagline="Learn. Teach. Trade skills." />
      </Link>

      <ul>
        <li><NavLink to="/" end onClick={closeMobile} className={({isActive})=>isActive?'active':''}>Home</NavLink></li>
        <li><NavLink to="/explore" onClick={closeMobile} className={({isActive})=>isActive?'active':''}>Explore</NavLink></li>
        {authed && <li><NavLink to="/community" onClick={closeMobile} className={({isActive})=>isActive?'active':''}>Community</NavLink></li>}
        <li><NavLink to="/help" onClick={closeMobile} className={({isActive})=>isActive?'active':''}>How It Works</NavLink></li>
        {!authed && <li><NavLink to="/pricing" onClick={closeMobile} className={({isActive})=>isActive?'active':''}>Pricing</NavLink></li>}
      </ul>

      {authed ? (
        <div className="nav-right">
          <ThemeToggle />
          <button className="icon-btn nav-mobile-toggle" onClick={()=>setMobileOpen(o=>!o)} aria-label="Menu" aria-expanded={mobileOpen}>
            {mobileOpen ? '×' : '☰'}
          </button>
          <button className="icon-btn" onClick={()=>navigate('/search')} aria-label="Search">⌕</button>
          <Link to="/notifications" className="icon-btn" style={{position:'relative'}} aria-label="Notifications">
            🔔
            {unread>0 && <span className="nav-badge">{unread}</span>}
          </Link>
          <Link to="/messages" className="icon-btn" aria-label="Messages">💬</Link>

          <div className="nav-avatar-wrap" ref={menuRef}>
            <Avatar
              as="button"
              src={profile.avatar}
              name={profile.name}
              className="nav-avatar"
              onClick={()=>setMenuOpen(o=>!o)}
            />
            {menuOpen && (
              <div className="nav-dropdown">
                <Link to="/dashboard" onClick={()=>setMenuOpen(false)}>▦ Dashboard</Link>
                <Link to="/my-learning" onClick={()=>setMenuOpen(false)}>▶ My Learning</Link>
                <Link to="/wishlist" onClick={()=>setMenuOpen(false)}>☆ Wishlist</Link>
                <Link to="/certificates" onClick={()=>setMenuOpen(false)}>🎓 Certificates</Link>
                <Link to="/wallet" onClick={()=>setMenuOpen(false)}>◎ Wallet</Link>
                <Link to="/profile" onClick={()=>setMenuOpen(false)}>👤 Profile</Link>
                <Link to="/account-settings" onClick={()=>setMenuOpen(false)}>⚙ Settings</Link>
                <div className="nav-dropdown-sep"></div>
                <button onClick={doLogout}>⎋ Log out</button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="nav-right">
          <ThemeToggle />
          <button className="icon-btn nav-mobile-toggle" onClick={()=>setMobileOpen(o=>!o)} aria-label="Menu" aria-expanded={mobileOpen}>
            {mobileOpen ? '×' : '☰'}
          </button>
          <button className="icon-btn" onClick={()=>navigate('/search')} aria-label="Search">⌕</button>
          <Link to="/login" className="btn-outline nav-desktop-only">Log in</Link>
          <Link to="/signup" className="btn-solid nav-desktop-only">Join Now</Link>
        </div>
      )}

      {mobileOpen && (
        <div className="nav-mobile-panel" ref={mobileRef}>
          <NavLink to="/" end onClick={closeMobile} className={({isActive})=>isActive?'active':''}>Home</NavLink>
          <NavLink to="/explore" onClick={closeMobile} className={({isActive})=>isActive?'active':''}>Explore</NavLink>
          {authed && <NavLink to="/community" onClick={closeMobile} className={({isActive})=>isActive?'active':''}>Community</NavLink>}
          <NavLink to="/help" onClick={closeMobile} className={({isActive})=>isActive?'active':''}>How It Works</NavLink>
          <NavLink to="/pricing" onClick={closeMobile} className={({isActive})=>isActive?'active':''}>Pricing</NavLink>
          {authed && <NavLink to="/ai-mentor" onClick={closeMobile} className={({isActive})=>isActive?'active':''}>✨ AI Mentor</NavLink>}
          <div className="nav-mobile-sep"></div>
          {authed ? (
            <button className="nav-mobile-logout" onClick={doLogout}>⎋ Log out</button>
          ) : (
            <div className="nav-mobile-auth">
              <Link to="/login" className="btn-outline" onClick={closeMobile}>Log in</Link>
              <Link to="/signup" className="btn-solid" onClick={closeMobile}>Join Now</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
