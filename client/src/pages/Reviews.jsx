import React from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout.jsx';
import { useUser } from '../context/UserContext.jsx';
import { getMentorById } from '../data/mentors.js';

export default function Reviews(){
  const { reviews } = useUser();
  const sorted = [...reviews].sort((a,b)=> new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <DashboardLayout title="Reviews" subtitle="Reviews you've written for mentors after your sessions.">
      {sorted.length===0 ? (
        <div className="dash-empty">
          No reviews yet — after you <Link to="/sessions">mark a session complete</Link>, you'll be able to leave one.
        </div>
      ) : (
        <div className="my-learning-list">
          {sorted.map(r=>{
            const mentor = getMentorById(r.mentorId);
            return (
              <div className="learning-row" key={r.id} style={{alignItems:'flex-start'}}>
                <div className="learning-row-icon">{mentor?.initials}</div>
                <div className="learning-row-info" style={{flex:1}}>
                  <b>{mentor?.name}</b>
                  <div className="star-picker" style={{margin:'4px 0'}}>
                    {[1,2,3,4,5].map(n=><span key={n} className={n<=r.rating?'on':''}>★</span>)}
                  </div>
                  <span>{r.text}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}
