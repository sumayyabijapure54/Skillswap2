import React from 'react';
import { useNavigate } from 'react-router-dom';

const ACTIONS = [
  { to: '/post-skill', label: 'Post a skill', icon: '＋' },
  { to: '/book-session', label: 'Book a session', icon: '📅' },
  { to: '/messages', label: 'Messages', icon: '💬' },
  { to: '/recommendations', label: 'AI Recommendations', icon: '✨' }
];

export default function FloatingActionButton() {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const ref = React.useRef(null);

  React.useEffect(() => {
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const go = (to) => { setOpen(false); navigate(to); };

  return (
    <div className="fab-wrap" ref={ref}>
      {open && (
        <div className="fab-menu">
          {ACTIONS.map(a => (
            <button key={a.to} className="fab-menu-item" onClick={() => go(a.to)}>
              <span>{a.icon}</span>{a.label}
            </button>
          ))}
        </div>
      )}
      <button className={`fab-btn ${open ? 'open' : ''}`} onClick={() => setOpen(o => !o)} aria-label="Quick actions">
        {open ? '×' : '＋'}
      </button>
    </div>
  );
}
