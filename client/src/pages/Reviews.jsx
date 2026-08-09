import React from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout.jsx';
import { api } from '../lib/api.js';
import { SkeletonRow } from '../components/Skeleton.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { useToast } from '../context/ToastContext.jsx';

function initialsOf(name){
  return (name || '').split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase();
}

export default function Reviews(){
  const [reviews, setReviews] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const toast = useToast();

  React.useEffect(()=>{
    api.get('/api/reviews/mine')
      .then(data => setReviews(data.reviews || []))
      .catch(()=>{ toast.error('Could not load your reviews — please refresh to try again.'); })
      .finally(()=>setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sorted = [...reviews].sort((a,b)=> new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <DashboardLayout title="Reviews" subtitle="Reviews you've written for mentors after your sessions.">
      {loading ? (
        <div className="my-learning-list">
          {Array.from({ length: 3 }).map((_, i) => <SkeletonRow key={i} />)}
        </div>
      ) : sorted.length===0 ? (
        <EmptyState
          icon="★"
          title="No reviews yet"
          text="After a mentor marks a session complete, you'll be able to leave one."
          ctaLabel="View sessions"
          ctaTo="/sessions"
        />
      ) : (
        <div className="my-learning-list">
          {sorted.map(r=>(
            <div className="learning-row" key={r.id} style={{alignItems:'flex-start'}}>
              <div className="learning-row-icon">{initialsOf(r.mentorName)}</div>
              <div className="learning-row-info" style={{flex:1}}>
                <b>{r.mentorName}</b>
                <div style={{fontSize:'11.5px', color:'var(--muted)'}}>{r.skillTitle}</div>
                <div className="star-picker" style={{margin:'4px 0'}}>
                  {[1,2,3,4,5].map(n=><span key={n} className={n<=r.rating?'on':''}>★</span>)}
                </div>
                <span>{r.comment}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
