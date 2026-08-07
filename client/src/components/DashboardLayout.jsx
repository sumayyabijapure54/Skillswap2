import React from 'react';
import { NavLink } from 'react-router-dom';
import { useUser } from '../context/UserContext.jsx';
import FloatingActionButton from './FloatingActionButton.jsx';
import Avatar from './Avatar.jsx';

const BASE_NAV = [
  { section:null, items:[
    { to:'/dashboard', label:'Overview', icon:'▦' },
    { to:'/ai-mentor', label:'AI Learning Mentor', icon:'✨' }
  ] },
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
    { to:'/live-sessions', label:'Live Sessions', icon:'🔴' },
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

const MENTOR_ITEMS = [
  { to:'/mentor-dashboard', label:'Mentor Dashboard', icon:'🧑‍🏫' },
  { to:'/mentor-courses', label:'My Courses', icon:'📚' },
  { to:'/mentor-students', label:'Students', icon:'🧑‍🎓' },
  { to:'/mentor-analytics', label:'Analytics', icon:'📊' }
];

// Label overrides applied per nav item `to` when viewing as a mentor.
// Same route/page — wording only, so it reads correctly for a mentor audience.
const MENTOR_LABEL_OVERRIDES = {
  '/sessions': 'Upcoming Teaching Sessions',
  '/live-sessions': 'Live Sessions (Host)',
  '/achievements': 'Mentor Achievements',
  '/certificates': 'Certificates Issued',
  '/reviews': 'Reviews Received',
  '/wallet': 'Earnings / Wallet',
  '/payments': 'Earnings History'
};

export default function DashboardLayout({ title, subtitle, children }){
  const { profile, isAdmin, logOut } = useUser();
  const [navOpen, setNavOpen] = React.useState(false);
  const isMentor = profile.role === 'teach' || profile.role === 'both';
  // "Pure" mentor (teach-only) vs a dual-role user who is also still a learner.
  const isMentorOnly = profile.role === 'teach';

  const applyMentorLabels = (items) => items.map(item => (
    MENTOR_LABEL_OVERRIDES[item.to] ? { ...item, label: MENTOR_LABEL_OVERRIDES[item.to] } : item
  ));

  const nav = isMentor
    ? [
        { section:null, items: BASE_NAV[0].items },
        { section:'Teaching', items: MENTOR_ITEMS },
        // Mentor-only users don't need the learner "My Learning" group (My Courses
        // above already covers it) or "Book a Session" (they don't book themselves —
        // "Students" in Teaching covers who's booked with them). Dual-role "both"
        // users still learn too, so they keep the full learner section.
        ...BASE_NAV.slice(1).map(group => {
          if (isMentorOnly && group.section === 'My Learning') return null;
          if (group.section === 'Sessions') {
            const items = isMentorOnly ? group.items.filter(i => i.to !== '/book-session') : group.items;
            return { ...group, items: applyMentorLabels(items) };
          }
          if (group.section === 'My Learning' || group.section === 'Payments') {
            return { ...group, items: applyMentorLabels(group.items) };
          }
          return group;
        }).filter(Boolean)
      ]
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
          <Avatar src={profile.avatar} name={profile.name} className="dash-user-av" />
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
