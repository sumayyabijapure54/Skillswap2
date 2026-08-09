import React from 'react';
import { Link, useParams } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout.jsx';
import Countdown from '../components/Countdown.jsx';
import JitsiEmbed from '../components/JitsiEmbed.jsx';
import ComingSoon from './ComingSoon.jsx';
import { useUser } from '../context/UserContext.jsx';
import { getSocket } from '../lib/socket.js';
import {
  getLiveSession, joinLiveSession, confirmLiveSessionJoin, leaveLiveSession,
  startLiveSession, endLiveSession, attachRecording, cancelLiveSession, getAttendance
} from '../lib/liveSessionsApi.js';

function fmt(dt){ return new Date(dt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }); }

function minsAgo(dt) {
  if (!dt) return '';
  const mins = Math.max(0, Math.round((Date.now() - new Date(dt).getTime()) / 60000));
  if (mins < 1) return 'just now';
  return `${mins} min ago`;
}

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

  // Live participant panel (mentor) + live participant count (student) —
  // fed by the 'live-session:attendance' socket event, which the server
  // only emits from confirmLiveSessionJoin()/leaveLiveSession() i.e. only
  // once Jitsi has actually confirmed someone in/out of the conference
  // (see liveSessionsController.js). Never fed by button clicks alone.
  const [liveParticipants, setLiveParticipants] = React.useState({}); // userId -> { name, joinedAt }
  const [liveCount, setLiveCount] = React.useState(null);

  // Guards against double-firing the confirm/leave REST calls if Jitsi
  // fires its events more than once (reconnects, etc).
  const hasConfirmedRef = React.useRef(false);
  const hasLeftRef = React.useRef(false);

  const load = React.useCallback(() => {
    setLoading(true);
    getLiveSession(id)
      .then(data => setSession(data.liveSession))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  React.useEffect(() => { load(); }, [load]);

  // Safety net: if the student navigates away / closes the tab while still
  // "in call" (e.g. before Jitsi's own videoConferenceLeft fires), make sure
  // their attendance still gets closed out instead of staying open forever.
  const inCallRef = React.useRef(false);
  React.useEffect(() => {
    return () => {
      if (inCallRef.current) markLeft();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    const socket = getSocket();
    if (!socket) return;
    const onUpdate = (payload) => {
      if (payload?.session?.id === id) setSession(payload.session);
    };
    socket.on('live-session:update', onUpdate);
    return () => socket.off('live-session:update', onUpdate);
  }, [id]);

  React.useEffect(() => {
    const socket = getSocket();
    if (!socket) return;
    const onAttendance = (payload) => {
      if (payload?.sessionId !== id) return;
      setLiveCount(payload.liveCount);
      setLiveParticipants((prev) => {
        const next = { ...prev };
        const uid = payload.participant?.userId;
        if (!uid) return prev;
        if (payload.type === 'joined') {
          next[uid] = { name: payload.participant.name, joinedAt: payload.participant.joinedAt };
        } else if (payload.type === 'left') {
          delete next[uid];
        }
        return next;
      });
    };
    socket.on('live-session:attendance', onAttendance);
    return () => socket.off('live-session:attendance', onAttendance);
  }, [id]);

  // isMentor is used by an effect below, so it's derived here (before any
  // early return) — every hook in this component must run on every render,
  // loading/not-found included, per the Rules of Hooks.
  const isMentor = session ? (session.mentor === profile.id || session.mentor?.id === profile.id) : false;
  const sessionStatus = session?.status;

  // Mentor: seed the live participants panel once, from whoever is already
  // confirmed-present, so it's not empty until the next socket event.
  React.useEffect(() => {
    if (!session || !isMentor || sessionStatus !== 'live') return;
    getAttendance(id).then((data) => {
      const map = {};
      for (const a of data.attendance || []) {
        if (a.joinedAt && !a.leftAt && a.confirmedAt) {
          map[a.user?.id || a.user] = { name: a.user?.name || 'Student', joinedAt: a.confirmedAt };
        }
      }
      setLiveParticipants(map);
    }).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, isMentor, sessionStatus, id]);

  // Keeps inCallRef in sync with `inCall` state, for the unmount-safety-net
  // effect above to read without itself depending on `inCall` (which would
  // re-run that cleanup-registering effect on every join/leave). Declared
  // here, before the early returns below, because every hook in this
  // component must run on every render, loading/not-found included, per
  // the Rules of Hooks — this one used to sit after the early returns,
  // which meant it was skipped entirely on the first (loading) render and
  // only started firing once session data loaded, changing the hook count
  // between renders and crashing with "Rendered more hooks than during the
  // previous render."
  React.useEffect(() => { inCallRef.current = inCall; }, [inCall]);

  if (loading) return null;
  if (notFound || !session) return <ComingSoon title="Live session not found" text="We couldn't find that session." />;

  // JOIN NOW — this is "join initiated": gates on enrollment/capacity and
  // fetches the room, but does NOT mark attendance as present. That only
  // happens once Jitsi actually confirms the conference join, below.
  const join = async () => {
    setBusy(true);
    setError('');
    hasConfirmedRef.current = false;
    hasLeftRef.current = false;
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

  const markLeft = () => {
    if (isMentor || hasLeftRef.current) return;
    hasLeftRef.current = true;
    leaveLiveSession(id).catch(() => {});
  };

  const leaveCall = () => {
    setInCall(false);
    markLeft();
  };

  // Fired by JitsiEmbed's videoConferenceJoined — the student is genuinely
  // inside the conference now. This is the ONLY thing that should ever
  // stamp attendance as present.
  const onConferenceJoined = () => {
    if (isMentor || hasConfirmedRef.current) return;
    hasConfirmedRef.current = true;
    confirmLiveSessionJoin(id).catch(() => {});
  };

  const onConferenceLeft = () => {
    markLeft();
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

  const liveParticipantEntries = Object.entries(liveParticipants);

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
              <JitsiEmbed
                room={joinInfo?.jitsiRoom || session.jitsiRoom}
                displayName={profile.name}
                role={isMentor ? 'mentor' : 'student'}
                sessionId={session.id}
                onClose={leaveCall}
                onConferenceJoined={onConferenceJoined}
                onConferenceLeft={onConferenceLeft}
              />
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
          {!isMentor && session.status === 'live' && inCall && liveCount != null && (
            <div className="desc" style={{marginTop:'10px'}}>Participant count: {liveCount} participant{liveCount === 1 ? '' : 's'}</div>
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

          {isMentor && session.status === 'live' && (
            <div className="col-card" style={{marginBottom:'20px'}}>
              <h3>Live participants</h3>
              {liveParticipantEntries.length === 0 ? (
                <div className="desc" style={{marginTop:'8px'}}>No one has joined the call yet.</div>
              ) : (
                <ul style={{listStyle:'none', marginTop:'10px'}}>
                  {liveParticipantEntries.map(([uid, p]) => (
                    <li key={uid} style={{display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid var(--border)', fontSize:'12.5px', color:'var(--muted)'}}>
                      <span style={{color:'var(--text)'}}>🟢 {p.name}</span>
                      <span>Joined {minsAgo(p.joinedAt)}</span>
                    </li>
                  ))}
                </ul>
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
                      <span style={{textTransform:'capitalize'}}>
                        {a.status === 'connecting' ? 'Connecting…' : `${a.status} · ${Math.round((a.totalSeconds||0)/60)}m`}
                      </span>
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
