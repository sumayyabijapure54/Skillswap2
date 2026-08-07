import React from 'react';
import { Link, useParams } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout.jsx';
import Countdown from '../components/Countdown.jsx';
import JitsiEmbed from '../components/JitsiEmbed.jsx';
import ComingSoon from './ComingSoon.jsx';
import { useUser } from '../context/UserContext.jsx';
import { getSocket } from '../lib/socket.js';
import {
  getLiveSession, joinLiveSession, leaveLiveSession, startLiveSession, endLiveSession,
  attachRecording, cancelLiveSession, getAttendance
} from '../lib/liveSessionsApi.js';

function fmt(dt){ return new Date(dt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }); }

export default function LiveSessionDetail(){
  const { id } = useParams();
  const { profile } = useUser();
  const [session, setSession] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [notFound, setNotFound] = React.useState(false);
  const [inCall, setInCall] = React.useState(false);
  const [joinInfo, setJoinInfo] = React.useState(null);
  const [attendance, setAttendance] = React.useState(null);
  const [recordingUrl, setRecordingUrl] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState('');

  const load = React.useCallback(() => {
    setLoading(true);
    getLiveSession(id)
      .then(data => setSession(data.liveSession))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  React.useEffect(() => { load(); }, [load]);

  React.useEffect(() => {
    const socket = getSocket();
    if (!socket) return;
    const onUpdate = (payload) => {
      if (payload?.session?.id === id) setSession(payload.session);
    };
    socket.on('live-session:update', onUpdate);
    return () => socket.off('live-session:update', onUpdate);
  }, [id]);

  if (loading) return null;
  if (notFound || !session) return <ComingSoon title="Live session not found" text="We couldn't find that session." />;

  const isMentor = session.mentor === profile.id || session.mentor?.id === profile.id;

  const join = async () => {
    setBusy(true);
    setError('');
    try {
      const data = await joinLiveSession(id);
      setSession(data.liveSession);
      setJoinInfo(data);
      if (data.meetingUrl) window.open(data.meetingUrl, '_blank', 'noreferrer');
      else setInCall(true);
    } catch (err) {
      setError(err.message || 'Could not join the session.');
    }
    setBusy(false);
  };

  const leaveCall = () => {
    setInCall(false);
    leaveLiveSession(id).catch(()=>{});
  };

  const runMentorAction = async (fn) => {
    setBusy(true);
    setError('');
    try { const data = await fn(); if (data?.liveSession) setSession(data.liveSession); }
    catch (err) { setError(err.message || 'Action failed.'); }
    setBusy(false);
  };

  const loadAttendance = async () => {
    try { const data = await getAttendance(id); setAttendance(data.attendance); } catch {}
  };

  return (
    <DashboardLayout>
      <div className="crumbs" style={{marginBottom:'18px'}}>
        <Link to="/live-sessions">Live Sessions</Link><span>/</span>
        <span style={{color:'var(--text)'}}>{session.title}</span>
      </div>

      <div className="two-col-dash" style={{alignItems:'flex-start'}}>
        <div>
          {inCall ? (
            <div style={{marginBottom:'20px'}}>
              <JitsiEmbed room={joinInfo?.jitsiRoom || session.jitsiRoom} displayName={profile.name} onClose={leaveCall} />
            </div>
          ) : (
            <div className="video-frame" style={{marginBottom:'20px'}}>
              <div className="playbtn">{session.status === 'live' ? '🔴' : '🎥'}</div>
            </div>
          )}

          <div className="col-card" style={{marginBottom:'20px'}}>
            <h3>{session.title}</h3>
            <p className="desc">{session.description}</p>
            <ul style={{listStyle:'none', marginTop:'10px'}}>
              <li style={{display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid var(--border)', fontSize:'12.5px', color:'var(--muted)'}}>Course <b style={{color:'var(--text)'}}>{session.skillTitle}</b></li>
              <li style={{display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid var(--border)', fontSize:'12.5px', color:'var(--muted)'}}>Starts <b style={{color:'var(--text)'}}>{fmt(session.startTime)}</b></li>
              <li style={{display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid var(--border)', fontSize:'12.5px', color:'var(--muted)'}}>Duration <b style={{color:'var(--text)'}}>{session.durationMinutes} min</b></li>
              <li style={{display:'flex', justifyContent:'space-between', padding:'8px 0', fontSize:'12.5px', color:'var(--muted)'}}>Status <b style={{color:'var(--accent)', textTransform:'capitalize'}}>{session.status}</b></li>
            </ul>
          </div>

          {error && <div className="field-error" style={{marginBottom:'12px'}}>{error}</div>}

          {!isMentor && session.status === 'scheduled' && (
            <div className="col-card">
              <Countdown target={session.startTime} live={false} />
            </div>
          )}
          {!isMentor && session.status === 'live' && !inCall && (
            <button className="btn-primary-lg live-join-btn" disabled={busy} onClick={join}>JOIN NOW</button>
          )}
          {!isMentor && session.status === 'ended' && session.recordingUrl && (
            <a href={session.recordingUrl} target="_blank" rel="noreferrer" className="btn-primary-lg">Watch Recording</a>
          )}
        </div>

        <div>
          {isMentor && (
            <div className="col-card" style={{marginBottom:'20px'}}>
              <h3>Host controls</h3>
              {session.status === 'scheduled' && (
                <div style={{display:'flex', gap:'10px', marginTop:'10px', flexWrap:'wrap'}}>
                  <button className="btn-primary-lg" disabled={busy} onClick={()=>runMentorAction(()=>startLiveSession(id))}>Start Session</button>
                  <button className="btn-ghost-lg" disabled={busy} onClick={()=>runMentorAction(()=>cancelLiveSession(id))}>Cancel</button>
                </div>
              )}
              {session.status === 'live' && (
                <>
                  <button className="btn-outline" style={{marginTop:'10px'}} onClick={()=>setInCall(true)}>Open meeting room</button>
                  <button className="btn-primary-lg" style={{marginTop:'10px', marginLeft:'10px'}} disabled={busy} onClick={()=>runMentorAction(()=>endLiveSession(id))}>End Session</button>
                </>
              )}
              {session.status === 'ended' && !session.recordingUrl && (
                <div style={{marginTop:'10px'}}>
                  <label className="form-label">Recording URL</label>
                  <input className="form-input" value={recordingUrl} onChange={e=>setRecordingUrl(e.target.value)} placeholder="https://…" />
                  <button className="btn-outline" style={{marginTop:'8px'}} disabled={busy || !recordingUrl.trim()} onClick={()=>runMentorAction(()=>attachRecording(id, recordingUrl.trim()))}>Attach recording</button>
                </div>
              )}
            </div>
          )}

          {isMentor && (
            <div className="col-card">
              <h3>Attendance</h3>
              {!attendance ? (
                <button className="btn-outline" style={{marginTop:'8px'}} onClick={loadAttendance}>Load attendance</button>
              ) : attendance.length === 0 ? (
                <div className="desc" style={{marginTop:'8px'}}>No one has joined yet.</div>
              ) : (
                <ul style={{listStyle:'none', marginTop:'10px'}}>
                  {attendance.map((a, i) => (
                    <li key={i} style={{display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid var(--border)', fontSize:'12.5px', color:'var(--muted)'}}>
                      <span style={{color:'var(--text)'}}>{a.user?.name || 'Student'}</span>
                      <span style={{textTransform:'capitalize'}}>{a.status} · {Math.round((a.totalSeconds||0)/60)}m</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
