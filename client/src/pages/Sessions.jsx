import React from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout.jsx';
import { api } from '../lib/api.js';

const STATUS_LABEL = { confirmed:'Upcoming', completed:'Awaiting review', cancelled:'Cancelled' };

export default function Sessions(){
  const [bookings, setBookings] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const load = React.useCallback(() => {
    setLoading(true);
    api.get('/api/bookings')
      .then(data => setBookings(data.bookings || []))
      .catch(()=>{})
      .finally(()=>setLoading(false));
  }, []);

  React.useEffect(()=>{ load(); }, [load]);

  const cancel = async (id) => {
    try{
      await api.patch(`/api/bookings/${id}/cancel`, {});
      load();
    }catch{ /* best-effort — the row just won't update if this fails */ }
  };

  const sorted = [...bookings].sort((a,b)=> new Date(b.scheduledAt) - new Date(a.scheduledAt));

  return (
    <DashboardLayout title="Upcoming Sessions" subtitle="Everything you've booked with mentors.">
      {loading ? (
        <div className="dash-empty">Loading sessions…</div>
      ) : sorted.length===0 ? (
        <div className="dash-empty">
          No sessions booked yet. <Link to="/book-session">Book your first session</Link>.
        </div>
      ) : (
        <div className="my-learning-list">
          {sorted.map(b=>(
            <div className="learning-row" key={b.id}>
              <div className="learning-row-icon">{b.mentorInitials}</div>
              <div className="learning-row-info">
                <b>{b.sessionType} with {b.mentorName}</b>
                <span>{new Date(b.scheduledAt).toLocaleString(undefined, { dateStyle:'medium', timeStyle:'short' })} · <span style={{color: b.status==='cancelled' ? 'var(--danger)' : 'var(--accent)'}}>{STATUS_LABEL[b.status] || b.status}</span></span>
              </div>
              <Link to={`/session/${b.id}`} className="btn-outline">View →</Link>
              {b.status==='confirmed' && (
                <button className="btn-ghost-lg" style={{marginLeft:'8px'}} onClick={()=>cancel(b.id)}>Cancel</button>
              )}
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
