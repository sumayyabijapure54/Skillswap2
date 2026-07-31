import React from 'react';
import { Link } from 'react-router-dom';

// Quick actions return raw text that *should* be JSON (quiz/flashcards) or
// markdown-ish plain text (summary/study-plan/hint). History loaded from
// the server only carries `content` (the raw string), not the parsed
// `data` the live response includes — so we defensively re-parse here
// rather than trusting a `data` prop to always be present.
function parseJsonPayload(content) {
  try {
    return JSON.parse(String(content || '').replace(/^```json\s*|\s*```$/g, '').trim());
  } catch {
    return null;
  }
}

// Minimal markdown-lite: headings (#/##/###), bullet lines, bold (**x**),
// and [Title](slug) links to the matching skill page. Deliberately small —
// this is a chat bubble, not a document renderer.
function renderInline(text, key) {
  const parts = [];
  const re = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0, m, i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    if (m[1] !== undefined) {
      parts.push(<b key={`${key}-b${i++}`}>{m[1]}</b>);
    } else {
      const slug = m[3].trim();
      parts.push(<Link key={`${key}-l${i++}`} to={`/skill/${slug}`} className="mentor-inline-link">{m[2]}</Link>);
    }
    last = re.lastIndex;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

function MarkdownLite({ text }) {
  const lines = String(text || '').split('\n');
  const blocks = [];
  let list = null;

  const flushList = () => {
    if (list) { blocks.push(<ul key={`ul-${blocks.length}`} className="mentor-list">{list}</ul>); list = null; }
  };

  lines.forEach((line, i) => {
    const trimmed = line.trim();
    if (!trimmed) { flushList(); return; }

    const heading = trimmed.match(/^(#{1,4})\s+(.*)$/);
    if (heading) {
      flushList();
      const Tag = ['h4', 'h4', 'h5', 'h5'][heading[1].length - 1];
      blocks.push(<Tag key={`h-${i}`} className="mentor-heading">{renderInline(heading[2], `h${i}`)}</Tag>);
      return;
    }

    const bullet = trimmed.match(/^[-*]\s+(.*)$/);
    if (bullet) {
      if (!list) list = [];
      list.push(<li key={`li-${i}`}>{renderInline(bullet[1], `li${i}`)}</li>);
      return;
    }

    flushList();
    blocks.push(<p key={`p-${i}`} className="mentor-para">{renderInline(trimmed, `p${i}`)}</p>);
  });
  flushList();

  return <>{blocks}</>;
}

function MentorQuiz({ data }) {
  const questions = data?.questions || [];
  const [answers, setAnswers] = React.useState(() => Array(questions.length).fill(null));
  const [submitted, setSubmitted] = React.useState(false);

  if (questions.length === 0) return null;

  const score = answers.filter((a, i) => a === questions[i].correctIndex).length;

  return (
    <div className="mentor-quiz">
      {questions.map((q, qi) => (
        <div className="mentor-quiz-q" key={qi}>
          <b>{qi + 1}. {q.question}</b>
          <div className="mentor-quiz-opts">
            {(q.options || []).map((opt, oi) => {
              const selected = answers[qi] === oi;
              const showCorrect = submitted && oi === q.correctIndex;
              const showWrong = submitted && selected && oi !== q.correctIndex;
              return (
                <button
                  key={oi}
                  type="button"
                  disabled={submitted}
                  className={`mentor-quiz-opt ${selected ? 'selected' : ''} ${showCorrect ? 'correct' : ''} ${showWrong ? 'wrong' : ''}`}
                  onClick={() => setAnswers((prev) => prev.map((a, i) => (i === qi ? oi : a)))}
                >
                  {opt}
                </button>
              );
            })}
          </div>
          {submitted && q.explanation && (
            <div className="mentor-quiz-explain">{q.explanation}</div>
          )}
        </div>
      ))}
      {!submitted ? (
        <button
          type="button"
          className="btn-primary-sm"
          disabled={answers.some((a) => a === null)}
          onClick={() => setSubmitted(true)}
        >
          Check answers
        </button>
      ) : (
        <div className="mentor-quiz-score">Scored {score}/{questions.length}</div>
      )}
    </div>
  );
}

function MentorFlashcards({ data }) {
  const cards = data?.cards || [];
  const [flipped, setFlipped] = React.useState(() => new Set());

  if (cards.length === 0) return null;

  const toggle = (i) => setFlipped((prev) => {
    const next = new Set(prev);
    next.has(i) ? next.delete(i) : next.add(i);
    return next;
  });

  return (
    <div className="mentor-flashcards">
      {cards.map((c, i) => (
        <button
          type="button"
          key={i}
          className={`mentor-flashcard ${flipped.has(i) ? 'flipped' : ''}`}
          onClick={() => toggle(i)}
        >
          <span className="mentor-flashcard-face front">{c.front}</span>
          <span className="mentor-flashcard-face back">{c.back}</span>
        </button>
      ))}
      <div className="mentor-flashcard-hint">Tap a card to flip it</div>
    </div>
  );
}

export default function MentorMessage({ message }) {
  const isUser = message.role === 'user';
  const kind = message.kind || 'chat';

  let body;
  if (!isUser && kind === 'quiz') {
    const data = message.data || parseJsonPayload(message.content);
    body = data?.questions?.length ? <MentorQuiz data={data} /> : <MarkdownLite text={message.content} />;
  } else if (!isUser && kind === 'flashcards') {
    const data = message.data || parseJsonPayload(message.content);
    body = data?.cards?.length ? <MentorFlashcards data={data} /> : <MarkdownLite text={message.content} />;
  } else {
    body = <MarkdownLite text={message.content} />;
  }

  return (
    <div className={`mentor-msg-row ${isUser ? 'me' : ''}`}>
      {!isUser && <div className="mentor-avatar">✨</div>}
      <div className={`mentor-bubble ${message.isError ? 'error' : ''} ${kind !== 'chat' ? 'rich' : ''}`}>
        {!isUser && kind !== 'chat' && (
          <div className="mentor-bubble-tag">{kind.replace('-', ' ')}</div>
        )}
        {body}
      </div>
    </div>
  );
}
