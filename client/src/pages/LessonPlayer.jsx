import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSkill, useSkillsById } from '../lib/skillsApi.js';
import { useUser } from '../context/UserContext.jsx';
import { useAiMentor } from '../context/AiMentorContext.jsx';
import { gsap } from '../lib/gsap.js';
import Quiz from '../components/Quiz.jsx';
import YouTubePlayer from '../components/YouTubePlayer.jsx';
import { PlaylistSkeleton } from '../components/CourseSkeleton.jsx';
import ComingSoon from './ComingSoon.jsx';

const AUTOPLAY_KEY = 'skillswap_autoplay_next';

const FILLER = [
  "Follow along with the video, then try recreating what's shown on your own before moving to the next lesson — that's where most of the learning actually sticks.",
  "Keep an eye on the small details called out on screen; they're the ones that trip people up the first time but become second nature quickly."
];

// Builds the curriculum straight from the course's own lesson list, in the
// mentor's chosen order — one curriculum step per lesson, exactly as the
// mentor authored it. A `type: 'Video'` lesson plays the mentor's own
// YouTube video (`lesson.youtube`); a small number of pre-existing seeded
// courses instead ship a direct sample clip (`lesson.videoUrl`) from
// before per-lesson YouTube videos existed. Either way, there is no
// searching, ranking, or substitution — every video shown here is exactly
// what's stored on the lesson.
function buildCurriculum(skill) {
  return [...(skill.lessons || [])]
    .sort((a, b) => (a.order ?? a.id) - (b.order ?? b.id))
    .map((lesson) => {
      if (lesson.type === 'Quiz') {
        return { kind: 'quiz', id: lesson.id, title: lesson.title, duration: lesson.duration, lesson };
      }
      if (lesson.youtube?.videoId) {
        return {
          kind: 'video', id: lesson.id, title: lesson.title, description: lesson.description,
          duration: lesson.duration, video: lesson.youtube
        };
      }
      return {
        kind: 'legacy-video', id: lesson.id, title: lesson.title, description: lesson.description,
        duration: lesson.duration, videoUrl: lesson.videoUrl
      };
    });
}

export default function LessonPlayer() {
  const { id } = useParams();
  const { skill, loading: skillLoading } = useSkill(id);
  const {
    authed, profile, enrolled, enroll, markLessonComplete,
    recordQuizScore, toggleSavedLesson, isLessonSaved, setLastWatched
  } = useUser();
  const { setPageContext } = useAiMentor();
  const { getSkillById: getOtherSkillById } = useSkillsById(
    enrolled.filter(e => e.skillId !== id).map(e => e.skillId)
  );

  const enrolledEntry = enrolled.find(e => e.skillId === id);
  const [activeIdx, setActiveIdx] = React.useState(0);
  const [guestCompleted, setGuestCompleted] = React.useState(new Set());
  const [autoplayNext, setAutoplayNext] = React.useState(() => {
    try { return localStorage.getItem(AUTOPLAY_KEY) !== 'off'; } catch { return true; }
  });
  const mainRef = React.useRef(null);
  const playerRef = React.useRef(null);

  React.useEffect(() => {
    if (authed && skill) enroll(skill.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed, skill?.id]);

  const curriculum = React.useMemo(() => skill ? buildCurriculum(skill) : [], [skill]);

  React.useEffect(() => {
    setActiveIdx(0);
  }, [skill?.id]);

  React.useLayoutEffect(() => {
    if (skillLoading || !mainRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from('.player-main > *', { opacity: 0, y: 16, duration: 0.5, stagger: 0.06, ease: 'power2.out' });
      gsap.from('.side-lesson', { opacity: 0, x: 12, duration: 0.4, stagger: 0.03, ease: 'power2.out', delay: 0.1 });
    }, mainRef);
    return () => ctx.revert();
  }, [skillLoading, skill?.id]);

  const item = curriculum[activeIdx];

  React.useEffect(() => {
    if (!skill) return undefined;
    setPageContext({ skillId: skill.id, skillTitle: skill.title, lessonTitle: item?.title || null });
    return () => setPageContext(null);
  }, [skill, item?.title, setPageContext]);

  if (skillLoading) {
    return <ComingSoon title="Loading lesson…" text="Just a moment while we fetch this course." />;
  }

  if (!skill) {
    return <ComingSoon title="Lesson not found" text="We couldn't find that course. Head back to Explore to find something to learn." />;
  }

  const completed = authed ? new Set(enrolledEntry?.completedLessons || []) : guestCompleted;
  const progressPct = curriculum.length ? Math.round((completed.size / curriculum.length) * 100) : 0;
  const courseComplete = curriculum.length > 0 && completed.size >= curriculum.length;
  const hasQuizContent = (skill.lessons?.length || 0) > 0;

  const goToIdx = (i) => setActiveIdx(Math.max(0, Math.min(curriculum.length - 1, i)));

  const markDoneAndAdvance = () => {
    if (authed) markLessonComplete(skill.id, item.id);
    else setGuestCompleted(prev => new Set(prev).add(item.id));
    if (item.kind === 'video' && authed) setLastWatched(skill.id, { videoId: item.video.videoId, lessonIndex: activeIdx });
    if (activeIdx < curriculum.length - 1) goToIdx(activeIdx + 1);
  };

  const handleVideoEnded = () => {
    if (autoplayNext && activeIdx < curriculum.length - 1) markDoneAndAdvance();
  };

  const handleProgress = () => {
    if (authed && item.kind === 'video') setLastWatched(skill.id, { videoId: item.video.videoId, lessonIndex: activeIdx });
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
        .map(e => ({ entry: e, s: getOtherSkillById(e.skillId) }))
        .filter(x => x.s && x.entry.completedLessons.length < x.s.lessons.length)
        .slice(0, 3)
    : [];

  const saved = item?.kind === 'video' ? isLessonSaved(skill.id, item.id) : false;

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

        {item?.kind === 'quiz' ? (
          <div className="video-frame glass" style={{ marginBottom: 0 }}>
            <div style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '13px' }}>🎯 Checkpoint — no video for this step</div>
          </div>
        ) : item?.kind === 'video' ? (
          <div className="video-frame glass" style={{ padding: 0 }}>
            <YouTubePlayer
              key={item.video.videoId}
              ref={playerRef}
              videoId={item.video.videoId}
              startSeconds={0}
              autoplay={autoplayNext && activeIdx > 0}
              onEnded={handleVideoEnded}
              onProgress={handleProgress}
            />
          </div>
        ) : (
          <VideoWithFallback key={item?.id} src={item?.videoUrl} />
        )}

        <div className="lesson-toolbar" style={{ marginTop: '18px' }}>
          <div className="left">
            {item?.kind === 'video' && (
              <span className="chan-badge">▶ <b>{item.video.channelTitle}</b></span>
            )}
            <span className="completion-pill">{progressPct}% complete</span>
          </div>
          <label className="switch-label">
            Autoplay next lesson
            <span className="switch">
              <input type="checkbox" checked={autoplayNext} onChange={toggleAutoplay} />
              <span className="track" onClick={toggleAutoplay} />
            </span>
          </label>
        </div>

        <div className="lesson-meta">
          <div>
            <h1>{item?.title || '…'}</h1>
            <div className="sub">{skill.title} · Lesson {activeIdx + 1} of {curriculum.length || '…'} · {item?.duration}</div>
          </div>
          <div className="lesson-actions">
            {item?.kind === 'video' && (
              <button
                className={`icon-btn ${saved ? 'active' : ''}`}
                title="Save for later"
                onClick={() => toggleSavedLesson(skill.id, {
                  chapterId: item.id, videoId: item.video.videoId, startSeconds: 0,
                  title: item.title, thumbnail: item.video.thumbnail, channelTitle: item.video.channelTitle
                })}
              >{saved ? '★' : '☆'}</button>
            )}
            <button className="btn-ghost-lg" onClick={downloadNotes}>📝 Download notes</button>
            {skill.mentorUser && (
              <Link to={`/messages?user=${skill.mentorUser}`} className="btn-outline">💬 Ask mentor</Link>
            )}
          </div>
        </div>

        {item?.kind === 'quiz' ? (
          item.lesson.quiz?.length ? (
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
            {item?.description && <p>{item.description}</p>}
            {FILLER.map((p, i) => <p key={i}>{p}</p>)}
          </div>
        )}

        <div className="lesson-nav">
          <button className="btn-ghost-lg" disabled={activeIdx === 0} style={activeIdx === 0 ? { opacity: 0.4, cursor: 'not-allowed' } : {}} onClick={() => goToIdx(activeIdx - 1)}>← Previous</button>
          {!(item?.kind === 'quiz' && item.lesson.quiz?.length) && (
            <button className="btn-primary-lg" onClick={markDoneAndAdvance}>
              {activeIdx === curriculum.length - 1 ? 'Mark complete ✓' : 'Complete & continue →'}
            </button>
          )}
        </div>

        {courseComplete && authed && hasQuizContent && (
          <div className="notice-banner" style={{ marginTop: '18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
            <span>🎉 Course completed! Pass the AI-generated quiz to earn your certificate.</span>
            <Link to={`/learn/${skill.id}/quiz`} className="btn-primary-lg">Take AI Quiz →</Link>
          </div>
        )}
      </div>

      <aside className="player-side glass">
        <h4>{skill.title}</h4>
        <div className="progress-txt">{completed.size}/{curriculum.length || 0} lessons complete</div>
        <div className="progress-track"><i style={{ width: `${progressPct}%` }}></i></div>

        {curriculum.length === 0 ? (
          <PlaylistSkeleton />
        ) : (
          curriculum.map((c, i) => (
            <div
              key={c.id}
              className={`side-lesson ${i === activeIdx ? 'active' : ''} ${completed.has(c.id) ? 'done' : ''}`}
              onClick={() => goToIdx(i)}
            >
              {c.kind === 'video' && c.video?.thumbnail ? (
                <img className="playlist-thumb" src={c.video.thumbnail} alt="" loading="lazy" />
              ) : (
                <div className="chk">{completed.has(c.id) ? '✓' : i + 1}</div>
              )}
              <div className="txt">
                <b>{c.title}</b>
                <span>{c.kind === 'quiz' ? 'Quiz' : 'Video'} · {c.duration}</span>
              </div>
            </div>
          ))
        )}
      </aside>
    </div>
  );
}

// A dead/unreachable video src (a broken CDN link, a network hiccup) used to
// just render a silent black box with 0:00 — no error was surfaced anywhere,
// so it looked exactly like the player was broken with no way to tell why.
// This surfaces the failure and offers a retry, instead of the video tag
// failing silently.
function VideoWithFallback({ src }) {
  const [failed, setFailed] = React.useState(false);
  const [attempt, setAttempt] = React.useState(0);

  React.useEffect(() => { setFailed(false); }, [src]);

  if (failed) {
    return (
      <div className="video-frame glass" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '40px', color: 'var(--muted)', fontSize: '13px' }}>
        <div>⚠️ This lesson's video source couldn't be loaded.</div>
        <button className="btn-ghost-lg" onClick={() => { setFailed(false); setAttempt(a => a + 1); }}>Try again</button>
      </div>
    );
  }

  return (
    <video
      key={`${src}-${attempt}`}
      className="video-frame"
      src={src}
      controls
      playsInline
      style={{ width: '100%', objectFit: 'cover' }}
      onError={() => setFailed(true)}
    />
  );
}
