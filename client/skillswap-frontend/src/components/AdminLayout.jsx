import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useUser } from '../context/UserContext.jsx';

const NAV = [
  { to: '/admin', label: 'Overview', icon: '▦', end: true },
  { to: '/admin/users', label: 'Users', icon: '👥' },
  { to: '/admin/mentor-applications', label: 'Mentor Applications', icon: '🧑‍🏫' },
  { to: '/admin/reports', label: 'Reports & Moderation', icon: '🚩' }
];

export default function AdminLayout({ title, subtitle, children }) {
  const { profile, logOut } = useUser();
  const initials = (profile.name || 'A').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  const [navOpen, setNavOpen] = React.useState(false);

  return (
    <div className="dash-shell">
      <button className="dash-mobile-toggle" onClick={()=>setNavOpen(o=>!o)}>
        <span className="ic">☰</span> {title || 'Admin Menu'}
        <span className="chev">{navOpen ? '▲' : '▼'}</span>
      </button>

      <aside className={`dash-sidebar ${navOpen ? 'open' : ''}`}>
        <div className="dash-user">
          <div className="dash-user-av">{initials}</div>
          <div>
            <b>{profile.name || 'Admin'}</b>
            <span>Administrator</span>
          </div>
        </div>
        <nav className="dash-nav">
          <div className="dash-nav-group">
            <div className="dash-nav-label">Admin</div>
            {NAV.map(item => (
              <NavLink to={item.to} key={item.to} end={item.end} onClick={()=>setNavOpen(false)} className={({ isActive }) => `dash-nav-link ${isActive ? 'active' : ''}`}>
                <span className="ic">{item.icon}</span>{item.label}
              </NavLink>
            ))}
          </div>
          <div className="dash-nav-group">
            <div className="dash-nav-label">Member view</div>
            <Link to="/dashboard" className="dash-nav-link" onClick={()=>setNavOpen(false)}><span className="ic">↩</span>Back to app</Link>
          </div>
        </nav>
        <button className="dash-logout" onClick={logOut}>⎋ Log out</button>
      </aside>

      <main className="dash-main">
        {(title || subtitle) && (
          <div className="dash-header">
            {title && <h1>{title}</h1>}
            {subtitle && <p>{subtitle}</p>}
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
