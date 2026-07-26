import React from 'react';
import { NavLink } from 'react-router-dom';
import { useUser } from '../context/UserContext.jsx';

const NAV = [
  { section:null, items:[ { to:'/dashboard', label:'Overview', icon:'▦' } ] },
  { section:'My Learning', items:[
    { to:'/my-learning', label:'In Progress', icon:'▶' },
    { to:'/learning-history', label:'Learning History', icon:'✓' },
    { to:'/certificates', label:'Certificates', icon:'🎓' },
    { to:'/wishlist', label:'Wishlist', icon:'☆' }
  ]},
  { section:'Community', items:[
    { to:'/post-skill', label:'Post a Skill', icon:'＋' },
    { to:'/community', label:'Community Feed', icon:'◈' },
    { to:'/messages', label:'Messages', icon:'💬' }
  ]},
  { section:'Sessions', items:[
    { to:'/book-session', label:'Book a Session', icon:'📅' },
    { to:'/sessions', label:'Upcoming Sessions', icon:'⏱' },
    { to:'/reviews', label:'Reviews', icon:'★' }
  ]},
  { section:'Settings', items:[
    { to:'/profile', label:'Profile', icon:'👤' },
    { to:'/account-settings', label:'Account', icon:'⚙' },
    { to:'/notifications', label:'Notifications', icon:'🔔' }
  ]}
];

export default function DashboardLayout({ title, subtitle, children }){
  const { profile, logOut } = useUser();
  const initials = (profile.name || 'U').split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase();

  return (
    <div className="dash-shell">
      <aside className="dash-sidebar">
        <div className="dash-user">
          <div className="dash-user-av">{initials}</div>
          <div>
            <b>{profile.name || 'Member'}</b>
            <span>{profile.role ? profile.role[0].toUpperCase()+profile.role.slice(1) : 'Learner'}</span>
          </div>
        </div>
        <nav className="dash-nav">
          {NAV.map((group, gi)=>(
            <div className="dash-nav-group" key={gi}>
              {group.section && <div className="dash-nav-label">{group.section}</div>}
              {group.items.map(item=>(
                <NavLink to={item.to} key={item.to} className={({isActive})=>`dash-nav-link ${isActive?'active':''}`}>
                  <span className="ic">{item.icon}</span>{item.label}
                </NavLink>
              ))}
            </div>
          ))}
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
