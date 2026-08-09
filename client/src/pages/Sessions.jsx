import React from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout.jsx';
import { api } from '../lib/api.js';
import { SkeletonRow } from '../components/Skeleton.jsx';
import EmptyState from '../components/EmptyState.jsx';
import ScrollReveal from '../components/ScrollReveal.jsx';
import { useToast } from '../context/ToastContext.jsx';

const STATUS_LABEL = { confirmed:'Upcoming', completed:'Awaiting review', cancelled:'Cancelled' };

export default function Sessions(){
  const [bookings, setBookings] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const toast = useToast();

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
      toast.success('Session cancelled.');
    }catch{
      toast.error('Could not cancel this session — please try again.');
    }
  };

  const sorted = [...bookings].sort((a,b)=> new Date(b.scheduledAt) - new Date(a.scheduledAt));

  return (
    <DashboardLayout title="Upcoming Sessions" subtitle="Everything you've booked with mentors.">
      {loading ? (
        <div className="my-learning-list">
          {Array.from({ length: 3 }).map((_, i) => <SkeletonRow key={i} />)}
        </div>
      ) : sorted.length===0 ? (
        <EmptyState
          icon="📅"
          title="No sessions booked yet"
          text="Book time with a mentor to get started."
          ctaLabel="Book a session"
          ctaTo="/book-session"
        />
      ) : (
        <ScrollReveal as="div" className="my-learning-list" stagger>
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
        </ScrollReveal>
      )}
    </DashboardLayout>
  );
}
