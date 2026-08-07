import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext.jsx';

// Watches for newly-arrived certificate notifications (pushed in real time
// via socket.io — see server/src/utils/notify.js) and pops a small
// celebratory toast in the corner with a direct "View Certificate" link,
// regardless of which page the learner happens to be on. Purely additive:
// the notification still lands in the normal /notifications list too.
export default function CertificateToast() {
  const { notifications } = useUser();
  const [queue, setQueue] = React.useState([]);
  const seenIds = React.useRef(new Set());

  React.useEffect(() => {
    const fresh = notifications.filter(
      n => n.type === 'system' && n.link?.startsWith('/certificate/') && !seenIds.current.has(n.id)
    );
    if (!fresh.length) return;
    fresh.forEach(n => seenIds.current.add(n.id));
    setQueue(q => [...q, ...fresh]);
  }, [notifications]);

  React.useEffect(() => {
    if (!queue.length) return;
    const timer = setTimeout(() => setQueue(q => q.slice(1)), 7000);
    return () => clearTimeout(timer);
  }, [queue]);

  if (!queue.length) return null;
  const current = queue[0];
  const skillTitle = current.text.replace(/^🎉\s*/, '').replace(/^You earned a certificate for completing "/, '').replace(/"!$/, '');

  return (
    <div
      role="status"
      style={{
        position: 'fixed', bottom: '24px', right: '24px', zIndex: 200,
        background: 'var(--panel, #14231c)', color: 'var(--text, #fff)',
        border: '1px solid var(--accent)', borderRadius: '14px',
        padding: '16px 18px', width: '300px',
        boxShadow: '0 12px 32px rgba(0,0,0,0.35)',
        display: 'flex', flexDirection: 'column', gap: '10px'
      }}
    >
      <div style={{display:'flex', alignItems:'flex-start', gap:'10px'}}>
        <span style={{fontSize:'22px', lineHeight:1}}>🎉</span>
        <div style={{flex:1}}>
          <div style={{fontWeight:700, fontSize:'14px'}}>Congratulations!</div>
          <div style={{fontSize:'13px', color:'var(--muted)', marginTop:'2px'}}>
            You've completed <b style={{color:'var(--text)'}}>{skillTitle}</b>
          </div>
        </div>
        <button
          onClick={() => setQueue(q => q.slice(1))}
          aria-label="Dismiss"
          style={{background:'none', border:'none', color:'var(--muted)', cursor:'pointer', fontSize:'14px'}}
        >✕</button>
      </div>
      <Link
        to={current.link}
        onClick={() => setQueue(q => q.slice(1))}
        className="btn-primary-lg"
        style={{textAlign:'center', padding:'8px 14px', fontSize:'13px'}}
      >
        View Certificate →
      </Link>
    </div>
  );
}
