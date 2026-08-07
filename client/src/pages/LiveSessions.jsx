import React from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout.jsx';
import Countdown from '../components/Countdown.jsx';
import { useUser } from '../context/UserContext.jsx';
import { api } from '../lib/api.js';
import { getSocket } from '../lib/socket.js';
import {
  createLiveSession, cancelLiveSession, deleteLiveSession, startLiveSession, endLiveSession,
  myUpcomingLiveSessions, myLiveLiveSessions, myLiveSessionHistory,
  mentorUpcomingLiveSessions, mentorTodayLiveSessions
} from '../lib/liveSessionsApi.js';

const STATUS_LABEL = { scheduled: 'Scheduled', live: 'Live Now', ended: 'Completed', cancelled: 'Cancelled' };

function fmt(dt){ return new Date(dt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }); }

// ---------- Student view ----------

function StudentSessionCard({ session, onJoin }){
  return (
    <div className="learning-row">
      <div className="learning-row-icon">🔴</div>
      <div className="learning-row-info">
        <b>{session.title}</b>
        <span>{session.skillTitle} · {session.mentorName || 'Mentor'} · {fmt(session.startTime)} · {session.durationMinutes}m</span>
        <span className={`status-badge status-${session.status}`}>{STATUS_LABEL[session.status]}</span>
      </div>
      <div style={{display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'6px'}}>
        {session.status !== 'ended' && session.status !== 'cancelled' && (
          <Countdown target={session.startTime} live={session.status === 'live'} />
        )}
        {session.status === 'live' && (
          <button className="btn-primary-lg live-join-btn" onClick={()=>onJoin(session)}>JOIN NOW</button>
        )}
        {session.status === 'scheduled' && (
          <Link to={`/live-sessions/${session.id}`} className="btn-outline">Details</Link>
        )}
        {session.status === 'ended' && session.recordingUrl && (
          <a href={session.recordingUrl} target="_blank" rel="noreferrer" className="btn-outline">Watch Recording</a>
        )}
        {session.status === 'ended' && (
          <Link to={`/live-sessions/${session.id}`} className="btn-ghost-lg">View Details</Link>
        )}
      </div>
    </div>
  );
}

function StudentLiveSessions(){
  const [tab, setTab] = React.useState('upcoming');
  const [upcoming, setUpcoming] = React.useState([]);
  const [live, setLive] = React.useState([]);
  const [history, setHistory] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const loadAll = React.useCallback(() => {
    setLoading(true);
    Promise.all([
      myUpcomingLiveSessions().catch(()=>({ liveSessions: [] })),
      myLiveLiveSessions().catch(()=>({ liveSessions: [] })),
      myLiveSessionHistory().catch(()=>({ liveSessions: [] }))
    ]).then(([u, l, h]) => {
      setUpcoming(u.liveSessions || []);
      setLive(l.liveSessions || []);
      setHistory(h.liveSessions || []);
    }).finally(()=>setLoading(false));
  }, []);

  React.useEffect(()=>{ loadAll(); }, [loadAll]);

  // Real-time: mentor started/scheduled/cancelled/ended a session for a
  // course this student is enrolled in — refresh instead of polling.
  React.useEffect(() => {
    const socket = getSocket();
    if (!socket) return;
    const onUpdate = () => loadAll();
    socket.on('live-session:update', onUpdate);
    return () => socket.off('live-session:update', onUpdate);
  }, [loadAll]);

  const join = async (session) => {
    window.location.assign(`/live-sessions/${session.id}`);
  };

  const scheduled = upcoming.filter(s => s.status === 'scheduled');
  const cancelled = history.filter(s => s.status === 'cancelled');
  const ended = history.filter(s => s.status === 'ended');

  const lists = { upcoming: scheduled, live, completed: ended, cancelled };
  const current = lists[tab] || [];

  return (
    <DashboardLayout title="Live Sessions" subtitle="Live classes hosted by your mentors.">
      <div className="tab-row" style={{marginBottom:'18px'}}>
        {['upcoming','live','completed','cancelled'].map(t => (
          <button key={t} className={`tab-btn ${tab===t?'active':''}`} onClick={()=>setTab(t)}>
            {t[0].toUpperCase()+t.slice(1)}{t==='live' && live.length>0 ? ` (${live.length})` : ''}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="dash-empty">Loading live sessions…</div>
      ) : current.length === 0 ? (
        <div className="dash-empty">No {tab} live sessions right now.</div>
      ) : (
        <div className="my-learning-list">
          {current.map(s => <StudentSessionCard key={s.id} session={s} onJoin={join} />)}
        </div>
      )}
    </DashboardLayout>
  );
}

// ---------- Mentor view ----------

function CreateSessionModal({ skills, onClose, onCreated }){
  const [form, setForm] = React.useState({
    skillId: skills[0]?.id || '', title: '', description: '', date: '', time: '',
    durationMinutes: 60, meetingProvider: 'jitsi', meetingUrl: '', maxParticipants: ''
  });
  const [error, setError] = React.useState('');
  const [saving, setSaving] = React.useState(false);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.skillId || !form.title.trim() || !form.date || !form.time) {
      setError('Please fill in the course, title, date and time.');
      return;
    }
    const startTime = new Date(`${form.date}T${form.time}`);
    setSaving(true);
    setError('');
    try {
      await createLiveSession({
        skillId: form.skillId,
        title: form.title.trim(),
        description: form.description.trim(),
        startTime: startTime.toISOString(),
        durationMinutes: Number(form.durationMinutes) || 60,
        meetingProvider: form.meetingProvider,
        meetingUrl: form.meetingUrl.trim() || undefined,
        maxParticipants: form.maxParticipants ? Number(form.maxParticipants) : undefined
      });
      onCreated();
    } catch (err) {
      setError(err.message || 'Could not create the session.');
    }
    setSaving(false);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={e=>e.stopPropagation()}>
        <h3>Schedule a live session</h3>
        <form onSubmit={submit}>
          <label className="form-label">Course</label>
          <select className="form-input" value={form.skillId} onChange={set('skillId')}>
            {skills.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
          </select>

          <label className="form-label">Session title</label>
          <input className="form-input" value={form.title} onChange={set('title')} placeholder="Live Q&A: React Hooks" />

          <label className="form-label">Description</label>
          <textarea className="form-input" rows={3} value={form.description} onChange={set('description')} />

          <div style={{display:'flex', gap:'12px'}}>
            <div style={{flex:1}}>
              <label className="form-label">Date</label>
              <input type="date" className="form-input" value={form.date} onChange={set('date')} />
            </div>
            <div style={{flex:1}}>
              <label className="form-label">Time</label>
              <input type="time" className="form-input" value={form.time} onChange={set('time')} />
            </div>
          </div>

          <div style={{display:'flex', gap:'12px'}}>
            <div style={{flex:1}}>
              <label className="form-label">Duration (minutes)</label>
              <input type="number" min="5" max="480" className="form-input" value={form.durationMinutes} onChange={set('durationMinutes')} />
            </div>
            <div style={{flex:1}}>
              <label className="form-label">Max participants</label>
              <input type="number" min="1" className="form-input" value={form.maxParticipants} onChange={set('maxParticipants')} placeholder="Unlimited" />
            </div>
          </div>

          <label className="form-label">Meeting provider</label>
          <select className="form-input" value={form.meetingProvider} onChange={set('meetingProvider')}>
            <option value="jitsi">Jitsi (built-in, no link needed)</option>
            <option value="zoom">Zoom</option>
            <option value="google-meet">Google Meet</option>
            <option value="custom">Custom link</option>
          </select>

          {form.meetingProvider !== 'jitsi' && (
            <>
              <label className="form-label">Meeting URL</label>
              <input className="form-input" value={form.meetingUrl} onChange={set('meetingUrl')} placeholder="https://…" />
            </>
          )}

          {error && <div className="field-error" style={{marginTop:'8px'}}>{error}</div>}

          <div style={{display:'flex', gap:'10px', marginTop:'16px'}}>
            <button type="submit" className="btn-primary-lg" disabled={saving}>{saving ? 'Scheduling…' : 'Schedule session'}</button>
            <button type="button" className="btn-ghost-lg" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function MentorSessionRow({ session, onChange }){
  const [busy, setBusy] = React.useState(false);

  const run = async (fn) => {
    setBusy(true);
    try { await fn(); onChange(); } catch (err) { alert(err.message || 'Action failed.'); }
    setBusy(false);
  };

  return (
    <div className="learning-row">
      <div className="learning-row-icon">🔴</div>
      <div className="learning-row-info">
        <b>{session.title}</b>
        <span>{session.skillTitle} · {fmt(session.startTime)} · {session.durationMinutes}m</span>
        <span className={`status-badge status-${session.status}`}>{STATUS_LABEL[session.status]}</span>
      </div>
      <div style={{display:'flex', gap:'8px', flexWrap:'wrap', justifyContent:'flex-end'}}>
        <Link to={`/live-sessions/${session.id}`} className="btn-outline">Details</Link>
        {session.status === 'scheduled' && (
          <>
            <button className="btn-primary-lg" disabled={busy} onClick={()=>run(()=>startLiveSession(session.id))}>Start</button>
            <button className="btn-ghost-lg" disabled={busy} onClick={()=>run(()=>cancelLiveSession(session.id))}>Cancel</button>
            <button className="btn-ghost-lg" disabled={busy} onClick={()=>{ if(confirm('Delete this session?')) run(()=>deleteLiveSession(session.id)); }}>Delete</button>
          </>
        )}
        {session.status === 'live' && (
          <button className="btn-primary-lg" disabled={busy} onClick={()=>run(()=>endLiveSession(session.id))}>End Session</button>
        )}
      </div>
    </div>
  );
}

function MentorLiveSessions(){
  const [today, setToday] = React.useState([]);
  const [upcoming, setUpcoming] = React.useState([]);
  const [skills, setSkills] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [showCreate, setShowCreate] = React.useState(false);

  const load = React.useCallback(() => {
    setLoading(true);
    Promise.all([
      mentorTodayLiveSessions().catch(()=>({ liveSessions: [] })),
      mentorUpcomingLiveSessions().catch(()=>({ liveSessions: [] }))
    ]).then(([t, u]) => {
      setToday(t.liveSessions || []);
      setUpcoming(u.liveSessions || []);
    }).finally(()=>setLoading(false));
  }, []);

  React.useEffect(() => {
    load();
    api.get('/api/skills/mentor/mine').then(d => setSkills(d.results || [])).catch(()=>{});
  }, [load]);

  const studentsJoined = today.reduce((sum, s) => sum + (s.attendance?.length || 0), 0);

  return (
    <DashboardLayout title="Live Sessions" subtitle="Host live classes for the students enrolled in your courses.">
      <div className="dash-stat-row">
        <div className="dash-stat"><b>{today.length}</b><span>Today's sessions</span></div>
        <div className="dash-stat"><b>{upcoming.length}</b><span>Upcoming sessions</span></div>
        <div className="dash-stat"><b>{studentsJoined}</b><span>Students joined today</span></div>
      </div>

      <div style={{display:'flex', justifyContent:'flex-end', marginBottom:'14px'}}>
        <button className="btn-primary-lg" onClick={()=>setShowCreate(true)} disabled={skills.length===0}>
          + Schedule live session
        </button>
      </div>
      {skills.length === 0 && (
        <div className="dash-empty" style={{marginBottom:'14px'}}>
          You need a published course before you can schedule a live session. <Link to="/post-skill">Post a skill</Link>.
        </div>
      )}

      {loading ? (
        <div className="dash-empty">Loading…</div>
      ) : upcoming.length === 0 ? (
        <div className="dash-empty">No upcoming live sessions scheduled.</div>
      ) : (
        <div className="my-learning-list">
          {upcoming.map(s => <MentorSessionRow key={s.id} session={s} onChange={load} />)}
        </div>
      )}

      {showCreate && (
        <CreateSessionModal skills={skills} onClose={()=>setShowCreate(false)} onCreated={()=>{ setShowCreate(false); load(); }} />
      )}
    </DashboardLayout>
  );
}

// ---------- Entry point ----------

export default function LiveSessions(){
  const { profile } = useUser();
  const isMentor = profile.role === 'teach' || profile.role === 'both';
  return isMentor ? <MentorLiveSessions /> : <StudentLiveSessions />;
}
