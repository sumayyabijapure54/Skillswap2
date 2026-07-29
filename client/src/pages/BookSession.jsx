import React from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout.jsx';
import { mentors } from '../data/mentors.js';

export default function BookSession(){
  return (
    <DashboardLayout title="Book a Session" subtitle="Pick a mentor to see their availability and book time.">
      <div className="mentor-grid">
        {mentors.map(m=>(
          <div className="mentor-card" key={m.id}>
            <div className="mentor-top"><div className="mentor-badge">${m.rate}/session</div><div className="mentor-avatar">{m.initials}</div></div>
            <div className="mentor-body">
              <b>{m.name}</b>
              <div className="role">{m.role}</div>
              <div className="rating">★ {m.rating} ({m.reviews})</div>
              <div className="mentor-tags">{m.tags.slice(0,3).map(t=><span key={t}>{t}</span>)}</div>
              <Link to={`/book/${m.id}`} className="btn-solid" style={{width:'100%', textAlign:'center', display:'block', marginTop:'14px'}}>Book →</Link>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
