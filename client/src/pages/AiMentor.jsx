import React from 'react';
import DashboardLayout from '../components/DashboardLayout.jsx';
import MentorMessage from '../components/MentorMessage.jsx';
import { useAiMentor } from '../context/AiMentorContext.jsx';

const QUICK_ACTIONS = [
  { type: 'quiz', label: 'Quiz me on this', icon: '📝', hint: 'Generates a 5-question multiple-choice check' },
  { type: 'flashcards', label: 'Make flashcards', icon: '🗂', hint: '8 flip-cards covering the key points' },
  { type: 'summary', label: 'Summarize', icon: '≡', hint: 'Quick bullet-point recap' },
  { type: 'study-plan', label: 'Build a study plan', icon: '🗓', hint: 'Personalized week-by-week plan' },
  { type: 'hint', label: "I'm stuck — hint me", icon: '💡', hint: 'A nudge, not the full answer' }
];

const STARTERS = [
  'What should I learn next based on my progress?',
  'Explain what I just watched in simpler terms',
  'How do I book a session with a mentor?',
  'How does the wallet and certificate system work?'
];

export default function AiMentor() {
  const { messages, sending, send, quickAction, clear, pageContext } = useAiMentor();
  const [draft, setDraft] = React.useState('');
  const listRef = React.useRef(null);

  React.useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, sending]);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!draft.trim() || sending) return;
    send(draft);
    setDraft('');
  };

  return (
    <DashboardLayout
      title="AI Learning Mentor"
      subtitle={pageContext?.lessonTitle
        ? `Currently grounded in: ${pageContext.lessonTitle}`
        : 'Your personal tutor — ask questions, get recommendations, and generate study tools.'}
    >
      <div className="mentor-page">
        <aside className="mentor-page-sidebar">
          <div className="mentor-page-card">
            <h3>Quick actions</h3>
            <p className="mentor-page-card-sub">Generated from your current context {pageContext?.skillTitle ? `(${pageContext.skillTitle})` : 'or this conversation'}.</p>
            <div className="mentor-page-actions">
              {QUICK_ACTIONS.map((a) => (
                <button
                  key={a.type}
                  type="button"
                  className="mentor-page-action"
                  disabled={sending}
                  onClick={() => quickAction(a.type)}
                >
                  <span className="mentor-page-action-icon">{a.icon}</span>
                  <span>
                    <b>{a.label}</b>
                    <small>{a.hint}</small>
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="mentor-page-card">
            <h3>Try asking</h3>
            <div className="mentor-page-starters">
              {STARTERS.map((s) => (
                <button key={s} type="button" className="mentor-page-starter" disabled={sending} onClick={() => send(s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <button type="button" className="mentor-page-clear" onClick={clear}>
            Clear conversation
          </button>
        </aside>

        <div className="mentor-page-chat">
          <div className="mentor-messages mentor-messages-page" ref={listRef}>
            {messages.length === 0 && (
              <div className="mentor-empty">
                <div className="mentor-empty-icon">✨</div>
                <p>Hi, I'm your AI Learning Mentor. Ask me about a lesson, get recommendations tailored to your goals, or use a quick action on the left to generate a quiz, flashcards, or a study plan.</p>
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

          <form className="mentor-input-row mentor-input-row-page" onSubmit={onSubmit}>
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Ask your mentor anything…"
              disabled={sending}
            />
            <button type="submit" className="btn-primary-sm" disabled={sending || !draft.trim()}>Send</button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
