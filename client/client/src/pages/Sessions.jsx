import React from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout.jsx';
import { useUser } from '../context/UserContext.jsx';
import { getMentorById } from '../data/mentors.js';

const STATUS_LABEL = { upcoming:'Upcoming', completed:'Awaiting review', reviewed:'Reviewed', cancelled:'Cancelled' };

export default function Sessions(){
  const { bookings, cancelBooking } = useUser();
  const sorted = [...bookings].sort((a,b)=> new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <DashboardLayout title="Upcoming Sessions" subtitle="Everything you've booked with mentors.">
      {sorted.length===0 ? (
        <div className="dash-empty">
          No sessions booked yet. <Link to="/book-session">Book your first session</Link>.
        </div>
      ) : (
        <div className="my-learning-list">
          {sorted.map(b=>{
            const mentor = getMentorById(b.mentorId);
            return (
              <div className="learning-row" key={b.id}>
                <div className="learning-row-icon">{mentor?.initials}</div>
                <div className="learning-row-info">
                  <b>{b.sessionType} with {mentor?.name}</b>
                  <span>{b.day}, {b.time} · <span style={{color: b.status==='cancelled' ? 'var(--danger)' : 'var(--accent)'}}>{STATUS_LABEL[b.status]}</span></span>
                </div>
                <Link to={`/session/${b.id}`} className="btn-outline">View →</Link>
                {b.status==='upcoming' && (
                  <button className="btn-ghost-lg" style={{marginLeft:'8px'}} onClick={()=>cancelBooking(b.id)}>Cancel</button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}
