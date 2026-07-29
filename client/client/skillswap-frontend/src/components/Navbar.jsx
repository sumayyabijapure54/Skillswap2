import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext.jsx';

export default function Navbar(){
  const navigate = useNavigate();
  const { authed, profile, notifications, logOut } = useUser();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const menuRef = React.useRef(null);

  const unread = notifications.filter(n=>!n.read).length;
  const initials = (profile.name || 'U').split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase();

  React.useEffect(()=>{
    const onClick = (e)=>{ if(menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener('mousedown', onClick);
    return ()=>document.removeEventListener('mousedown', onClick);
  }, []);

  const doLogout = ()=>{
    logOut();
    setMenuOpen(false);
    navigate('/');
  };

  return (
    <nav className="topnav">
      <Link to="/" className="brand">
        <div className="mark">S</div>
        <div>
          <div className="name">SkillSwap</div>
          <div className="tag">Learn · Teach · Grow</div>
        </div>
      </Link>

      <ul>
        <li><NavLink to="/" end className={({isActive})=>isActive?'active':''}>Home</NavLink></li>
        <li><NavLink to="/explore" className={({isActive})=>isActive?'active':''}>Explore</NavLink></li>
        {authed && <li><NavLink to="/community" className={({isActive})=>isActive?'active':''}>Community</NavLink></li>}
        <li><NavLink to="/help" className={({isActive})=>isActive?'active':''}>How It Works</NavLink></li>
        {!authed && <li><NavLink to="/pricing" className={({isActive})=>isActive?'active':''}>Pricing</NavLink></li>}
      </ul>

      {authed ? (
        <div className="nav-right">
          <button className="icon-btn" onClick={()=>navigate('/search')} aria-label="Search">⌕</button>
          <Link to="/notifications" className="icon-btn" style={{position:'relative'}} aria-label="Notifications">
            🔔
            {unread>0 && <span className="nav-badge">{unread}</span>}
          </Link>
          <Link to="/messages" className="icon-btn" aria-label="Messages">💬</Link>

          <div className="nav-avatar-wrap" ref={menuRef}>
            <button className="nav-avatar" onClick={()=>setMenuOpen(o=>!o)}>{initials}</button>
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
          <button className="icon-btn" onClick={()=>navigate('/search')} aria-label="Search">⌕</button>
          <Link to="/login" className="btn-outline">Log in</Link>
          <Link to="/signup" className="btn-solid">Join Now</Link>
        </div>
      )}
    </nav>
  );
}
