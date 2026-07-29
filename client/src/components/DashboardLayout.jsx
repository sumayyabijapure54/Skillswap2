import React from 'react';
import { NavLink } from 'react-router-dom';
import { useUser } from '../context/UserContext.jsx';
import FloatingActionButton from './FloatingActionButton.jsx';

const BASE_NAV = [
  { section:null, items:[ { to:'/dashboard', label:'Overview', icon:'▦' } ] },
  { section:'My Learning', items:[
    { to:'/my-learning', label:'In Progress', icon:'▶' },
    { to:'/learning-history', label:'Learning History', icon:'✓' },
    { to:'/certificates', label:'Certificates', icon:'🎓' },
    { to:'/wishlist', label:'Wishlist', icon:'☆' },
    { to:'/recommendations', label:'AI Recommendations', icon:'✨' },
    { to:'/achievements', label:'Achievements', icon:'🏆' }
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
  { section:'Payments', items:[
    { to:'/wallet', label:'Wallet', icon:'◎' },
    { to:'/payments', label:'Payment History', icon:'🧾' }
  ]},
  { section:'Settings', items:[
    { to:'/profile', label:'Profile', icon:'👤' },
    { to:'/account-settings', label:'Account', icon:'⚙' },
    { to:'/notifications', label:'Notifications', icon:'🔔' }
  ]}
];

const MENTOR_ITEM = { to:'/mentor-dashboard', label:'Mentor Dashboard', icon:'🧑‍🏫' };

export default function DashboardLayout({ title, subtitle, children }){
  const { profile, isAdmin: realIsAdmin, logOut } = useUser();
  const [navOpen, setNavOpen] = React.useState(false);
  const initials = (profile.name || 'U').split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase();
  const isMentor = profile.role === 'teach' || profile.role === 'both';

  // Real backend-granted admins (`isAdmin` from the server) OR the demo
  // toggle on the Profile page (`profile.role === 'admin'`) both count.
  const isAdmin = realIsAdmin || profile.role === 'admin';

  const nav = isMentor
    ? [{ section:null, items:[ BASE_NAV[0].items[0], MENTOR_ITEM ] }, ...BASE_NAV.slice(1)]
    : BASE_NAV;

  const navWithAdmin = isAdmin
    ? [...nav, { section:'Admin', items:[ { to:'/admin', label:'Admin Dashboard', icon:'🛠' } ] }]
    : nav;

  return (
    <div className="dash-shell">
      <button className="dash-mobile-toggle" onClick={()=>setNavOpen(o=>!o)}>
        <span className="ic">☰</span> {title || 'Menu'}
        <span className="chev">{navOpen ? '▲' : '▼'}</span>
      </button>

      <aside className={`dash-sidebar ${navOpen ? 'open' : ''}`}>
        <div className="dash-user">
          <div className="dash-user-av">{initials}</div>
          <div>
            <b>{profile.name || 'Member'}</b>
            <span>{profile.role ? profile.role[0].toUpperCase()+profile.role.slice(1) : 'Learner'}</span>
          </div>
        </div>
        <nav className="dash-nav">
          {navWithAdmin.map((group, gi)=>(
            <div className="dash-nav-group" key={gi}>
              {group.section && <div className="dash-nav-label">{group.section}</div>}
              {group.items.map(item=>(
                <NavLink to={item.to} key={item.to} onClick={()=>setNavOpen(false)} className={({isActive})=>`dash-nav-link ${isActive?'active':''}`}>
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
      <FloatingActionButton />
    </div>
  );
}
