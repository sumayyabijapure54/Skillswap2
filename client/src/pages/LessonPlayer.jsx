import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { getSkillById } from '../data/skills.js';
import { useUser } from '../context/UserContext.jsx';
import { fetchCourseVideos } from '../lib/youtubeApi.js';
import { gsap } from '../lib/gsap.js';
import Quiz from '../components/Quiz.jsx';
import YouTubePlayer from '../components/YouTubePlayer.jsx';
import { VideoAreaSkeleton, PlaylistSkeleton } from '../components/CourseSkeleton.jsx';
import ComingSoon from './ComingSoon.jsx';

const AUTOPLAY_KEY = 'skillswap_autoplay_next';

const FILLER = [
  "Follow along with the video, then try recreating what's shown on your own before moving to the next lesson — that's where most of the learning actually sticks.",
  "Keep an eye on the small details called out on screen; they're the ones that trip people up the first time but become second nature quickly."
];

// Combines the fetched YouTube videos with the skill's existing checkpoint
// quiz(zes) into a single ordered curriculum. Quizzes are spread evenly
// through the video list rather than only appearing at the end, so a long
// full-course video doesn't push every checkpoint to the very last step.
function buildCurriculum(skill, ytVideos) {
  const quizLessons = skill.lessons.filter(l => l.type === 'Quiz');
  const videoItems = ytVideos.length > 0
    ? ytVideos.map(v => ({ kind: 'video', id: `yt-${v.id}`, title: v.title, duration: v.duration, video: v }))
    : skill.lessons.filter(l => l.type === 'Video').map(l => ({ kind: 'sample', id: `sample-${l.id}`, title: l.title, duration: l.duration, lesson: l }));

  if (quizLessons.length === 0 || videoItems.length === 0) return videoItems;

  const result = [...videoItems];
  quizLessons.forEach((quiz, qi) => {
    const insertAt = Math.min(result.length, Math.round(((qi + 1) / (quizLessons.length + 1)) * (videoItems.length + quizLessons.length)));
    result.splice(insertAt, 0, { kind: 'quiz', id: `quiz-${quiz.id}-${qi}`, title: quiz.title, duration: quiz.duration, lesson: quiz });
  });
  return result;
}

export default function LessonPlayer() {
  const { id } = useParams();
  const skill = getSkillById(id);
  const {
    authed, enrolled, enroll, markLessonComplete,
    recordQuizScore, toggleSavedLesson, isLessonSaved, setLastWatched
  } = useUser();

  const enrolledEntry = enrolled.find(e => e.skillId === id);
  const [activeIdx, setActiveIdx] = React.useState(0);
  const [guestCompleted, setGuestCompleted] = React.useState(new Set());
  const [autoplayNext, setAutoplayNext] = React.useState(() => {
    try { return localStorage.getItem(AUTOPLAY_KEY) !== 'off'; } catch { return true; }
  });
  const [yt, setYt] = React.useState({ loading: true, videos: [], error: null, quotaExceeded: false });
  const mainRef = React.useRef(null);

  React.useEffect(() => {
    if (authed && skill) enroll(skill.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed, skill?.id]);

  // Fetch a real YouTube course for this skill on mount / whenever the
  // skill changes. Falls back silently to the app's sample lessons if the
  // backend/API isn't reachable — the page never blocks on this.
  React.useEffect(() => {
    if (!skill) return;
    let cancelled = false;
    setYt(s => ({ ...s, loading: true }));
    fetchCourseVideos(skill.title, 8).then(result => {
      if (cancelled) return;
      setYt({ loading: false, videos: result.videos, error: result.error, quotaExceeded: result.quotaExceeded });
    });
    return () => { cancelled = true; };
  }, [skill?.id]);

  const curriculum = React.useMemo(
    () => skill ? buildCurriculum(skill, yt.videos) : [],
    [skill, yt.videos]
  );

  React.useEffect(() => {
    setActiveIdx(0);
  }, [skill?.id, yt.loading]);

  React.useLayoutEffect(() => {
    if (yt.loading || !mainRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from('.player-main > *', { opacity: 0, y: 16, duration: 0.5, stagger: 0.06, ease: 'power2.out' });
      gsap.from('.side-lesson', { opacity: 0, x: 12, duration: 0.4, stagger: 0.03, ease: 'power2.out', delay: 0.1 });
    }, mainRef);
    return () => ctx.revert();
  }, [yt.loading, skill?.id]);

  if (!skill) {
    return <ComingSoon title="Lesson not found" text="We couldn't find that course. Head back to Explore to find something to learn." />;
  }

  const completed = authed ? new Set(enrolledEntry?.completedLessons || []) : guestCompleted;
  const item = curriculum[activeIdx];
  const progressPct = curriculum.length ? Math.round((completed.size / curriculum.length) * 100) : 0;

  const remainingSeconds = curriculum
    .filter((c, i) => i >= activeIdx && c.kind === 'video')
    .reduce((sum, c) => sum + (c.video?.durationSeconds || 0), 0);
  const remainingLabel = remainingSeconds >= 3600
    ? `${Math.floor(remainingSeconds / 3600)}h ${Math.round((remainingSeconds % 3600) / 60)}m left`
    : `${Math.round(remainingSeconds / 60)} min left`;

  const goToIdx = (i) => setActiveIdx(Math.max(0, Math.min(curriculum.length - 1, i)));

  const markDoneAndAdvance = () => {
    if (authed) markLessonComplete(skill.id, item.id);
    else setGuestCompleted(prev => new Set(prev).add(item.id));
    if (item.kind === 'video' && authed) setLastWatched(skill.id, { videoId: item.video.id, lessonIndex: activeIdx });
    if (activeIdx < curriculum.length - 1) goToIdx(activeIdx + 1);
  };

  const handleVideoEnded = () => {
    if (autoplayNext && activeIdx < curriculum.length - 1) markDoneAndAdvance();
  };

  const toggleAutoplay = () => {
    setAutoplayNext(v => {
      const next = !v;
      try { localStorage.setItem(AUTOPLAY_KEY, next ? 'on' : 'off'); } catch { /* ignore */ }
      return next;
    });
  };

  const downloadNotes = () => {
    if (!item) return;
    const lines = [
      `${skill.title} — ${item.title}`,
      item.kind === 'video' ? `Channel: ${item.video.channelTitle}` : '',
      item.kind === 'video' ? `Watch: ${item.video.url}` : '',
      `Duration: ${item.duration}`,
      '',
      'Notes:',
      '- ',
      '- ',
      '- '
    ].filter(Boolean).join('\n');
    const blob = new Blob([lines], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${skill.title.replace(/\s+/g, '-').toLowerCase()}-notes.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  // Other in-progress skills, for the Continue Watching rail.
  const continueWatching = authed
    ? enrolled
        .filter(e => e.skillId !== skill.id)
        .map(e => ({ entry: e, s: getSkillById(e.skillId) }))
        .filter(x => x.s && x.entry.completedLessons.length < x.s.lessons.length)
        .slice(0, 3)
    : [];

  return (
    <div className="player-shell" ref={mainRef}>
      <div className="player-main">
        <div className="crumbs" style={{ marginBottom: '18px' }}>
          <Link to="/">Home</Link><span>/</span>
          <Link to="/explore">Explore</Link><span>/</span>
          <Link to={`/skill/${skill.id}`}>{skill.title}</Link><span>/</span>
          <span style={{ color: 'var(--text)' }}>Lesson {activeIdx + 1}</span>
        </div>

        {!authed && (
          <div className="guest-banner">
            You're browsing as a guest — <Link to="/signup">create a free account</Link> to save your progress and pick up where you left off.
          </div>
        )}

        {yt.error && !yt.loading && (
          <div className="notice-banner warn">
            ⚠️ Couldn't load live YouTube content ({yt.quotaExceeded ? 'API quota reached' : 'backend unavailable'}) — showing sample lesson video instead.
          </div>
        )}

        {continueWatching.length > 0 && (
          <div className="continue-watching">
            <h4>Continue watching</h4>
            <div className="cw-rail">
              {continueWatching.map(({ entry, s }) => (
                <Link key={s.id} to={`/learn/${s.id}`} className="cw-card glass">
                  <div className="icon">{s.category === 'programming' ? '</>' : '🎓'}</div>
                  <b>{s.title}</b>
                  <div className="cw-track"><i style={{ width: `${Math.round((entry.completedLessons.length / s.lessons.length) * 100)}%` }} /></div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {yt.loading ? (
          <VideoAreaSkeleton />
        ) : item?.kind === 'quiz' ? (
          <div className="video-frame glass" style={{ marginBottom: 0 }}>
            <div style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '13px' }}>🎯 Checkpoint — no video for this step</div>
          </div>
        ) : item?.kind === 'video' ? (
          <div className="video-frame glass" style={{ padding: 0 }}>
            <YouTubePlayer
              key={item.video.id}
              videoId={item.video.id}
              autoplay={autoplayNext && activeIdx > 0}
              onEnded={handleVideoEnded}
              onProgress={() => { if (authed) setLastWatched(skill.id, { videoId: item.video.id, lessonIndex: activeIdx }); }}
            />
          </div>
        ) : (
          <video
            key={item?.id}
            className="video-frame"
            src={item?.lesson?.videoUrl}
            controls
            playsInline
            style={{ width: '100%', objectFit: 'cover' }}
          />
        )}

        {!yt.loading && (
          <div className="lesson-toolbar" style={{ marginTop: '18px' }}>
            <div className="left">
              {item?.kind === 'video' && (
                <span className="chan-badge">▶ <b>{item.video.channelTitle}</b></span>
              )}
              <span className="completion-pill">{progressPct}% complete</span>
              {remainingSeconds > 0 && <span style={{ fontSize: '11.5px', color: 'var(--muted)' }}>{remainingLabel}</span>}
            </div>
            <label className="switch-label">
              Autoplay next lesson
              <span className="switch">
                <input type="checkbox" checked={autoplayNext} onChange={toggleAutoplay} />
                <span className="track" onClick={toggleAutoplay} />
              </span>
            </label>
          </div>
        )}

        <div className="lesson-meta">
          <div>
            <h1>{item?.title || '…'}</h1>
            <div className="sub">{skill.title} · Lesson {activeIdx + 1} of {curriculum.length || '…'} · {item?.duration}</div>
          </div>
          <div className="lesson-actions">
            {item?.kind === 'video' && (
              <button
                className={`icon-btn ${isLessonSaved(skill.id, item.video.id) ? 'active' : ''}`}
                title="Save for later"
                onClick={() => toggleSavedLesson(skill.id, item.video)}
              >{isLessonSaved(skill.id, item.video.id) ? '★' : '☆'}</button>
            )}
            <button className="btn-ghost-lg" onClick={downloadNotes}>📝 Download notes</button>
            <Link to={`/messages?mentor=${skill.mentor.id}`} className="btn-outline">💬 Ask mentor</Link>
          </div>
        </div>

        {item?.kind === 'quiz' ? (
          item.lesson.quiz ? (
            <div className="col-card" style={{ marginBottom: '30px' }}>
              <h3 style={{ marginBottom: '4px' }}>Checkpoint quiz</h3>
              <div className="desc" style={{ marginBottom: '18px' }}>Answer all {item.lesson.quiz.length} questions, then submit to see your score.</div>
              <Quiz
                quiz={item.lesson.quiz}
                onComplete={(score, total) => {
                  if (authed) recordQuizScore(skill.id, item.id, score, total);
                  markDoneAndAdvance();
                }}
              />
            </div>
          ) : (
            <div className="col-card" style={{ marginBottom: '30px' }}>
              <h3>Checkpoint quiz</h3>
              <div className="desc">A short quiz to confirm what you've picked up so far. Multiple choice, no time limit.</div>
              <button className="btn-primary-lg" style={{ marginTop: '6px' }} onClick={markDoneAndAdvance}>Start quiz →</button>
            </div>
          )
        ) : (
          <div className="lesson-body">
            {item?.kind === 'video' && item.video.description && (
              <p>{item.video.description.slice(0, 320)}{item.video.description.length > 320 ? '…' : ''}</p>
            )}
            {FILLER.map((p, i) => <p key={i}>{p}</p>)}
          </div>
        )}

        <div className="lesson-nav">
          <button className="btn-ghost-lg" disabled={activeIdx === 0} style={activeIdx === 0 ? { opacity: 0.4, cursor: 'not-allowed' } : {}} onClick={() => goToIdx(activeIdx - 1)}>← Previous</button>
          {!(item?.kind === 'quiz' && item.lesson.quiz) && (
            <button className="btn-primary-lg" onClick={markDoneAndAdvance}>
              {activeIdx === curriculum.length - 1 ? 'Mark complete ✓' : 'Complete & continue →'}
            </button>
          )}
        </div>
      </div>

      <aside className="player-side glass">
        <h4>{skill.title}</h4>
        <div className="progress-txt">{completed.size}/{curriculum.length || 0} lessons complete</div>
        <div className="progress-track"><i style={{ width: `${progressPct}%` }}></i></div>

        {yt.loading ? (
          <PlaylistSkeleton />
        ) : (
          curriculum.map((c, i) => (
            <div
              key={c.id}
              className={`side-lesson ${i === activeIdx ? 'active' : ''} ${completed.has(c.id) ? 'done' : ''}`}
              onClick={() => goToIdx(i)}
            >
              {c.kind === 'video' ? (
                <img className="playlist-thumb" src={c.video.thumbnail} alt="" loading="lazy" />
              ) : (
                <div className="chk">{completed.has(c.id) ? '✓' : i + 1}</div>
              )}
              <div className="txt">
                <b>{c.title}</b>
                <span>{c.kind === 'quiz' ? 'Quiz' : 'Video'} · {c.duration}</span>
                {c.kind === 'video' && <span className="chan">{c.video.channelTitle}</span>}
              </div>
            </div>
          ))
        )}
      </aside>
    </div>
  );
}
