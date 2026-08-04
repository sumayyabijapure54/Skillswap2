import React from 'react';
import { Link, useParams } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout.jsx';
import { api } from '../lib/api.js';
import ComingSoon from './ComingSoon.jsx';
import VideoCall from '../components/VideoCall.jsx';

export default function SessionDetail(){
  const { id } = useParams();
  const [booking, setBooking] = React.useState(null);
  const [existingReview, setExistingReview] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [notFound, setNotFound] = React.useState(false);

  const [notes, setNotes] = React.useState('');
  const [savingNotes, setSavingNotes] = React.useState(false);
  const [rating, setRating] = React.useState(5);
  const [reviewText, setReviewText] = React.useState('');
  const [submittingReview, setSubmittingReview] = React.useState(false);
  const [reviewError, setReviewError] = React.useState('');
  const [inCall, setInCall] = React.useState(false);

  const load = React.useCallback(() => {
    setLoading(true);
    Promise.all([
      api.get(`/api/bookings/${id}`),
      api.get('/api/reviews/mine').catch(() => ({ reviews: [] }))
    ])
      .then(([bookingData, reviewsData]) => {
        setBooking(bookingData.booking);
        setNotes(bookingData.booking.notes || '');
        setExistingReview((reviewsData.reviews || []).find(r => r.booking === bookingData.booking.id) || null);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  React.useEffect(()=>{ load(); }, [load]);

  if (loading) return null;
  if (notFound || !booking){
    return <ComingSoon title="Session not found" text="We couldn't find that session." />;
  }

  const saveNotes = async () => {
    setSavingNotes(true);
    try{
      await api.patch(`/api/bookings/${booking.id}/notes`, { notes });
    }catch{ /* best-effort */ }
    setSavingNotes(false);
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if(!reviewText.trim()) return;
    setSubmittingReview(true);
    setReviewError('');
    try{
      const data = await api.post('/api/reviews', { bookingId: booking.id, rating, comment: reviewText.trim() });
      setExistingReview(data.review);
    }catch(err){
      setReviewError(err.message);
    }
    setSubmittingReview(false);
  };

  return (
    <DashboardLayout>
      <div className="crumbs" style={{marginBottom:'18px'}}>
        <Link to="/sessions">Sessions</Link><span>/</span>
        <span style={{color:'var(--text)'}}>{booking.sessionType} with {booking.mentorName}</span>
      </div>

      <div className="two-col-dash" style={{alignItems:'flex-start'}}>
        <div>
          {inCall ? (
            <div style={{marginBottom:'20px'}}>
              <VideoCall mentorName={booking.mentorName} bookingId={booking.id} onEnd={()=>setInCall(false)} />
            </div>
          ) : (
            <div className="video-frame" style={{marginBottom:'20px'}} onClick={()=>setInCall(true)}>
              <div className="playbtn">🎥</div>
            </div>
          )}

          <div className="col-card" style={{marginBottom:'20px'}}>
            <h3>Session details</h3>
            <ul style={{listStyle:'none', marginTop:'10px'}}>
              <li style={{display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid var(--border)', fontSize:'12.5px', color:'var(--muted)'}}>Mentor <b style={{color:'var(--text)'}}>{booking.mentorName}</b></li>
              <li style={{display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid var(--border)', fontSize:'12.5px', color:'var(--muted)'}}>Type <b style={{color:'var(--text)'}}>{booking.sessionType}</b></li>
              <li style={{display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid var(--border)', fontSize:'12.5px', color:'var(--muted)'}}>When <b style={{color:'var(--text)'}}>{new Date(booking.scheduledAt).toLocaleString(undefined, { dateStyle:'medium', timeStyle:'short' })}</b></li>
              <li style={{display:'flex', justifyContent:'space-between', padding:'8px 0', fontSize:'12.5px', color:'var(--muted)'}}>Status <b style={{color:'var(--accent)', textTransform:'capitalize'}}>{booking.status}</b></li>
            </ul>
          </div>

          <div className="col-card">
            <h3>Your private notes</h3>
            <div className="desc">Only you can see this — jot down questions or what you covered.</div>
            <textarea className="form-input" rows={5} value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Notes for this session…" />
            <button className="btn-outline" style={{marginTop:'12px'}} onClick={saveNotes} disabled={savingNotes}>{savingNotes ? 'Saving…' : 'Save notes'}</button>
          </div>
        </div>

        <div>
          <div className="col-card" style={{marginBottom:'20px'}}>
            <h3>{booking.mentorName}</h3>
            {booking.mentorUser
              ? <Link to={`/mentor/${booking.skillId}`} className="btn-outline" style={{marginTop:'10px', display:'inline-block'}}>View profile</Link>
              : <div className="desc" style={{marginTop:'6px'}}>Booked via {booking.skillTitle}.</div>}
          </div>

          {booking.status==='confirmed' && (
            <div className="col-card">
              <h3>Session status</h3>
              <div className="desc">Your mentor marks the session complete once it's done — you'll be able to leave a review right after.</div>
            </div>
          )}

          {booking.status==='completed' && !existingReview && (
            <div className="col-card">
              <h3>Leave a review</h3>
              <form onSubmit={submitReview}>
                <div className="star-picker">
                  {[1,2,3,4,5].map(n=>(
                    <span key={n} className={n<=rating ? 'on':''} onClick={()=>setRating(n)}>★</span>
                  ))}
                </div>
                <textarea className="form-input" rows={4} placeholder="How did the session go?" value={reviewText} onChange={e=>setReviewText(e.target.value)} style={{marginTop:'10px'}} />
                {reviewError && <div className="field-error" style={{marginTop:'8px'}}>{reviewError}</div>}
                <button type="submit" className="btn-primary-lg" style={{marginTop:'12px'}} disabled={submittingReview}>{submittingReview ? 'Submitting…' : 'Submit review →'}</button>
              </form>
            </div>
          )}

          {existingReview && (
            <div className="col-card">
              <h3>Your review</h3>
              <div className="star-picker" style={{marginBottom:'8px'}}>
                {[1,2,3,4,5].map(n=><span key={n} className={n<=(existingReview.rating||0)?'on':''}>★</span>)}
              </div>
              <p className="desc">{existingReview.comment}</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
