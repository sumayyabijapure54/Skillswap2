import React from 'react';
import { Link } from 'react-router-dom';
import { useAiMentor } from '../context/AiMentorContext.jsx';
import MentorMessage from './MentorMessage.jsx';

const QUICK_ACTIONS = [
  { type: 'quiz', label: 'Quiz me', icon: '📝' },
  { type: 'flashcards', label: 'Flashcards', icon: '🗂' },
  { type: 'summary', label: 'Summarize', icon: '≡' },
  { type: 'study-plan', label: 'Study plan', icon: '🗓' }
];

export default function AiMentorWidget() {
  const { messages, sending, open, setOpen, unread, send, quickAction, pageContext } = useAiMentor();
  const [draft, setDraft] = React.useState('');
  const listRef = React.useRef(null);

  React.useEffect(() => {
    if (!open) return;
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, open, sending]);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!draft.trim() || sending) return;
    send(draft);
    setDraft('');
  };

  return (
    <div className="mentor-widget-wrap">
      {open && (
        <div className="mentor-panel" role="dialog" aria-label="AI Learning Mentor">
          <div className="mentor-panel-head">
            <div className="mentor-panel-title">
              <span className="mentor-panel-glow">✨</span>
              <div>
                <b>AI Learning Mentor</b>
                <span className="mentor-panel-sub">
                  {pageContext?.lessonTitle || pageContext?.skillTitle || 'Ask me anything about SkillSwap'}
                </span>
              </div>
            </div>
            <div className="mentor-panel-actions">
              <Link to="/ai-mentor" className="mentor-expand-btn" title="Open full page" onClick={() => setOpen(false)}>⤢</Link>
              <button type="button" className="mentor-close-btn" onClick={() => setOpen(false)} aria-label="Close">×</button>
            </div>
          </div>

          <div className="mentor-quick-row">
            {QUICK_ACTIONS.map((a) => (
              <button
                key={a.type}
                type="button"
                className="mentor-quick-chip"
                disabled={sending}
                onClick={() => quickAction(a.type)}
              >
                <span>{a.icon}</span>{a.label}
              </button>
            ))}
          </div>

          <div className="mentor-messages" ref={listRef}>
            {messages.length === 0 && (
              <div className="mentor-empty">
                <div className="mentor-empty-icon">✨</div>
                <p>Hi! I'm your AI Learning Mentor. I can explain your current lesson, recommend what to learn next, quiz you, build flashcards, or just answer questions about SkillSwap.</p>
              </div>
            )}
            {messages.map((m) => <MentorMessage key={m._localId || m.createdAt + m.role} message={m} />)}
            {sending && (
              <div className="mentor-msg-row">
                <div className="mentor-avatar">✨</div>
                <div className="mentor-bubble mentor-typing"><span></span><span></span><span></span></div>
              </div>
            )}
          </div>

          <form className="mentor-input-row" onSubmit={onSubmit}>
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Ask your mentor anything…"
              disabled={sending}
            />
            <button type="submit" className="mentor-send-btn" disabled={sending || !draft.trim()} aria-label="Send">➤</button>
          </form>
        </div>
      )}

      <button
        type="button"
        className={`mentor-fab ${open ? 'open' : ''}`}
        onClick={() => setOpen(!open)}
        aria-label="AI Learning Mentor"
      >
        {open ? '×' : '✨'}
        {!open && unread > 0 && <span className="mentor-fab-badge">{unread}</span>}
      </button>
    </div>
  );
}
