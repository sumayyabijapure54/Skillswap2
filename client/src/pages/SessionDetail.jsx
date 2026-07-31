import React from 'react';
import { Link, useParams } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout.jsx';
import { useUser } from '../context/UserContext.jsx';
import { getMentorById } from '../data/mentors.js';
import ComingSoon from './ComingSoon.jsx';
import VideoCall from '../components/VideoCall.jsx';

export default function SessionDetail(){
  const { id } = useParams();
  const { bookings, updateBookingNotes, markBookingCompleted, addReview, reviews } = useUser();
  const booking = bookings.find(b=>b.id===id);

  const [notes, setNotes] = React.useState(booking?.notes || '');
  const [rating, setRating] = React.useState(5);
  const [reviewText, setReviewText] = React.useState('');
  const [inCall, setInCall] = React.useState(false);

  if(!booking){
    return <ComingSoon title="Session not found" text="We couldn't find that session." />;
  }

  const mentor = getMentorById(booking.mentorId);
  const existingReview = reviews.find(r=>r.bookingId===booking.id);

  const saveNotes = ()=> updateBookingNotes(booking.id, notes);

  const submitReview = (e)=>{
    e.preventDefault();
    if(!reviewText.trim()) return;
    addReview({ mentorId: booking.mentorId, skillId: booking.skillId, bookingId: booking.id, rating, text: reviewText.trim() });
  };

  return (
    <DashboardLayout>
      <div className="crumbs" style={{marginBottom:'18px'}}>
        <Link to="/sessions">Sessions</Link><span>/</span>
        <span style={{color:'var(--text)'}}>{booking.sessionType} with {mentor?.name}</span>
      </div>

      <div className="two-col-dash" style={{alignItems:'flex-start'}}>
        <div>
          {inCall ? (
            <div style={{marginBottom:'20px'}}>
              <VideoCall mentorName={mentor?.name || 'your mentor'} bookingId={booking.id} onEnd={()=>setInCall(false)} />
            </div>
          ) : (
            <div className="video-frame" style={{marginBottom:'20px'}} onClick={()=>setInCall(true)}>
              <div className="playbtn">🎥</div>
            </div>
          )}

          <div className="col-card" style={{marginBottom:'20px'}}>
            <h3>Session details</h3>
            <ul style={{listStyle:'none', marginTop:'10px'}}>
              <li style={{display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid var(--border)', fontSize:'12.5px', color:'var(--muted)'}}>Mentor <b style={{color:'var(--text)'}}>{mentor?.name}</b></li>
              <li style={{display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid var(--border)', fontSize:'12.5px', color:'var(--muted)'}}>Type <b style={{color:'var(--text)'}}>{booking.sessionType}</b></li>
              <li style={{display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid var(--border)', fontSize:'12.5px', color:'var(--muted)'}}>When <b style={{color:'var(--text)'}}>{booking.day}, {booking.time}</b></li>
              <li style={{display:'flex', justifyContent:'space-between', padding:'8px 0', fontSize:'12.5px', color:'var(--muted)'}}>Status <b style={{color:'var(--accent)'}}>{booking.status}</b></li>
            </ul>
          </div>

          <div className="col-card">
            <h3>Your private notes</h3>
            <div className="desc">Only you can see this — jot down questions or what you covered.</div>
            <textarea className="form-input" rows={5} value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Notes for this session…" />
            <button className="btn-outline" style={{marginTop:'12px'}} onClick={saveNotes}>Save notes</button>
          </div>
        </div>

        <div>
          {mentor && (
            <div className="col-card" style={{marginBottom:'20px'}}>
              <h3>{mentor.name}</h3>
              <div className="desc">{mentor.role}</div>
              <Link to={`/mentor/${mentor.id}`} className="btn-outline" style={{marginTop:'10px', display:'inline-block'}}>View profile</Link>
            </div>
          )}

          {booking.status==='upcoming' && (
            <div className="col-card">
              <h3>Wrap up this session</h3>
              <div className="desc">Once your call is done, mark it complete to leave a review.</div>
              <button className="btn-solid" onClick={()=>markBookingCompleted(booking.id)}>Mark as completed</button>
            </div>
          )}

          {(booking.status==='completed') && !existingReview && (
            <div className="col-card">
              <h3>Leave a review</h3>
              <form onSubmit={submitReview}>
                <div className="star-picker">
                  {[1,2,3,4,5].map(n=>(
                    <span key={n} className={n<=rating ? 'on':''} onClick={()=>setRating(n)}>★</span>
                  ))}
                </div>
                <textarea className="form-input" rows={4} placeholder="How did the session go?" value={reviewText} onChange={e=>setReviewText(e.target.value)} style={{marginTop:'10px'}} />
                <button type="submit" className="btn-primary-lg" style={{marginTop:'12px'}}>Submit review →</button>
              </form>
            </div>
          )}

          {(booking.status==='reviewed' || existingReview) && (
            <div className="col-card">
              <h3>Your review</h3>
              <div className="star-picker" style={{marginBottom:'8px'}}>
                {[1,2,3,4,5].map(n=><span key={n} className={n<=(existingReview?.rating||0)?'on':''}>★</span>)}
              </div>
              <p className="desc">{existingReview?.text}</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
