import React from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout.jsx';
import { api } from '../lib/api.js';

function initialsOf(name){
  return (name || '').split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase();
}

export default function Reviews(){
  const [reviews, setReviews] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(()=>{
    api.get('/api/reviews/mine')
      .then(data => setReviews(data.reviews || []))
      .catch(()=>{})
      .finally(()=>setLoading(false));
  }, []);

  const sorted = [...reviews].sort((a,b)=> new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <DashboardLayout title="Reviews" subtitle="Reviews you've written for mentors after your sessions.">
      {loading ? (
        <div className="dash-empty">Loading reviews…</div>
      ) : sorted.length===0 ? (
        <div className="dash-empty">
          No reviews yet — after a mentor <Link to="/sessions">marks a session complete</Link>, you'll be able to leave one.
        </div>
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
