import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSkill, useSkillsById } from '../lib/skillsApi.js';
import { useUser } from '../context/UserContext.jsx';
import { useAiMentor } from '../context/AiMentorContext.jsx';
import { fetchCourseVideo } from '../lib/youtubeApi.js';
import { getOverridesForSkill, setVideoOverride, clearVideoOverride, parseVideoInput } from '../lib/videoOverrides.js';
import { gsap } from '../lib/gsap.js';
import Quiz from '../components/Quiz.jsx';
import YouTubePlayer from '../components/YouTubePlayer.jsx';
import { VideoAreaSkeleton, PlaylistSkeleton } from '../components/CourseSkeleton.jsx';
import ComingSoon from './ComingSoon.jsx';

const AUTOPLAY_KEY = 'skillswap_autoplay_next';
const CHAPTER_END_BUFFER_SECONDS = 1;

const FILLER = [
  "Follow along with the video, then try recreating what's shown on your own before moving to the next lesson — that's where most of the learning actually sticks.",
  "Keep an eye on the small details called out on screen; they're the ones that trip people up the first time but become second nature quickly."
];

// Combines the chapters of ONE chosen YouTube video with the skill's
// existing checkpoint quiz(zes) into a single ordered curriculum. Every
// "video" step here is a chapter (start/end timestamp) inside the *same*
// video — never a different video — so a curriculum topic always maps to
// exactly one place to seek to, not a separate piece of content. Quizzes
// are spread evenly through the list rather than only appearing at the end.
function buildCurriculum(skill, video, chapters, overrides) {
  const quizLessons = skill.lessons.filter(l => l.type === 'Quiz');
  const chapterItems = video && chapters.length > 0
    ? chapters.map(c => ({
        kind: 'chapter', id: c.id, title: c.title, duration: c.duration,
        startSeconds: c.startSeconds, endSeconds: c.endSeconds
      }))
    : skill.lessons.filter(l => l.type === 'Video').map(l => ({
        kind: 'sample', id: `sample-${l.id}`, title: l.title, duration: l.duration, lesson: l,
        override: overrides?.[l.id] || null
      }));

  if (quizLessons.length === 0 || chapterItems.length === 0) return chapterItems;

  const result = [...chapterItems];
  quizLessons.forEach((quiz, qi) => {
    const insertAt = Math.min(result.length, Math.round(((qi + 1) / (quizLessons.length + 1)) * (chapterItems.length + quizLessons.length)));
    result.splice(insertAt, 0, { kind: 'quiz', id: `quiz-${quiz.id}-${qi}`, title: quiz.title, duration: quiz.duration, lesson: quiz });
  });
  return result;
}

export default function LessonPlayer() {
  const { id } = useParams();
  const { skill, loading: skillLoading } = useSkill(id);
  const {
    authed, isAdmin, profile, enrolled, enroll, markLessonComplete,
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
  const [yt, setYt] = React.useState({ loading: true, video: null, chapters: [], error: null, quotaExceeded: false });

  // Mentor/admin-provided custom videos (YouTube link or direct video URL)
  // per lesson — see lib/videoOverrides.js. Kept separate from `yt` so
  // saving one doesn't need to touch the YouTube-fetch state directly.
  const [overrides, setOverridesState] = React.useState(() => getOverridesForSkill(id));
  const [showVideoManager, setShowVideoManager] = React.useState(false);
  const [videoDrafts, setVideoDrafts] = React.useState({});
  const [videoErrors, setVideoErrors] = React.useState({});
  const hasAnyOverride = Object.keys(overrides).length > 0;
  const canManageVideos = authed && (isAdmin || profile?.role === 'teach' || profile?.role === 'both');

  React.useEffect(() => {
    setOverridesState(getOverridesForSkill(id));
    setShowVideoManager(false);
  }, [id]);
  const mainRef = React.useRef(null);
  const playerRef = React.useRef(null);
  const lastSeekRef = React.useRef({ videoId: null, chapterId: null });
  const advancedForChapterRef = React.useRef(null);

  React.useEffect(() => {
    if (authed && skill) enroll(skill.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed, skill?.id]);

  // Fetch ONE real YouTube course video (+ its chapters) for this skill on
  // mount / whenever the skill changes. Falls back silently to the app's
  // own sample lessons if the backend/API isn't reachable — the page never
  // blocks on this.
  React.useEffect(() => {
    if (!skill) return;
    // Once a mentor/admin has set at least one custom lesson video for
    // this skill, treat it as manually curated: skip the auto YouTube
    // search entirely and go straight to the per-lesson (sample/override)
    // list below, so their choice isn't second-guessed by a fresh search.
    if (hasAnyOverride) {
      setYt({ loading: false, video: null, chapters: [], error: null, quotaExceeded: false });
      return;
    }
    let cancelled = false;
    setYt(s => ({ ...s, loading: true }));
    fetchCourseVideo(skill.title).then(result => {
      if (cancelled) return;
      setYt({ loading: false, video: result.video, chapters: result.chapters, error: result.error, quotaExceeded: result.quotaExceeded });
    });
    return () => { cancelled = true; };
  }, [skill?.id, hasAnyOverride]);

  const curriculum = React.useMemo(
    () => skill ? buildCurriculum(skill, yt.video, yt.chapters, overrides) : [],
    [skill, yt.video, yt.chapters, overrides]
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

  const item = curriculum[activeIdx];

  React.useEffect(() => {
    if (!skill) return undefined;
    setPageContext({ skillId: skill.id, skillTitle: skill.title, lessonTitle: item?.title || null });
    return () => setPageContext(null);
  }, [skill, item?.title, setPageContext]);

  // Navigating between chapters of the SAME video doesn't remount the
  // player (there's nothing to remount — it's the same iframe/video), so
  // moving the playhead is done imperatively via seekTo() here instead.
  React.useEffect(() => {
    if (item?.kind !== 'chapter' || !yt.video) return;
    const sameVideo = lastSeekRef.current.videoId === yt.video.id;
    const newChapter = lastSeekRef.current.chapterId !== item.id;
    if (sameVideo && newChapter && playerRef.current) {
      playerRef.current.seekTo(item.startSeconds, { play: true });
    }
    lastSeekRef.current = { videoId: yt.video.id, chapterId: item.id };
    advancedForChapterRef.current = null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item?.id, yt.video?.id]);

  if (skillLoading) {
    return <ComingSoon title="Loading lesson…" text="Just a moment while we fetch this course." />;
  }

  if (!skill) {
    return <ComingSoon title="Lesson not found" text="We couldn't find that course. Head back to Explore to find something to learn." />;
  }

  const completed = authed ? new Set(enrolledEntry?.completedLessons || []) : guestCompleted;
  const progressPct = curriculum.length ? Math.round((completed.size / curriculum.length) * 100) : 0;

  const remainingSeconds = curriculum
    .filter((c, i) => i >= activeIdx && c.kind === 'chapter')
    .reduce((sum, c) => sum + Math.max(0, (c.endSeconds || 0) - (c.startSeconds || 0)), 0);
  const remainingLabel = remainingSeconds >= 3600
    ? `${Math.floor(remainingSeconds / 3600)}h ${Math.round((remainingSeconds % 3600) / 60)}m left`
    : `${Math.round(remainingSeconds / 60)} min left`;

  const goToIdx = (i) => setActiveIdx(Math.max(0, Math.min(curriculum.length - 1, i)));

  const markDoneAndAdvance = () => {
    if (authed) markLessonComplete(skill.id, item.id);
    else setGuestCompleted(prev => new Set(prev).add(item.id));
    if (item.kind === 'chapter' && authed && yt.video) setLastWatched(skill.id, { videoId: yt.video.id, lessonIndex: activeIdx });
    if (activeIdx < curriculum.length - 1) goToIdx(activeIdx + 1);
  };

  // Fires when the underlying video truly ends (only reachable from the
  // last chapter, since every other chapter is followed by more of the
  // same video).
  const handleVideoEnded = () => {
    if (autoplayNext && activeIdx < curriculum.length - 1) markDoneAndAdvance();
  };

  // Fires every ~2s while playing. Used to detect "reached the end of this
  // chapter" so autoplay can advance to the next curriculum topic even
  // though it's all one continuous video underneath.
  const handleProgress = (currentTime) => {
    if (authed && yt.video) setLastWatched(skill.id, { videoId: yt.video.id, lessonIndex: activeIdx });
    if (
      item?.kind === 'chapter' && item.endSeconds && autoplayNext &&
      advancedForChapterRef.current !== item.id &&
      activeIdx < curriculum.length - 1 &&
      currentTime >= item.endSeconds - CHAPTER_END_BUFFER_SECONDS
    ) {
      advancedForChapterRef.current = item.id;
      markDoneAndAdvance();
    }
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
      item.kind === 'chapter' && yt.video ? `Channel: ${yt.video.channelTitle}` : '',
      item.kind === 'chapter' && yt.video ? `Watch: ${yt.video.url}&t=${Math.floor(item.startSeconds)}s` : '',
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

  const videoLessons = skill.lessons.filter(l => l.type === 'Video');

  const openVideoManager = () => {
    const drafts = {};
    videoLessons.forEach(l => { drafts[l.id] = overrides[l.id]?.url || ''; });
    setVideoDrafts(drafts);
    setVideoErrors({});
    setShowVideoManager(true);
  };

  const saveVideoForLesson = (lessonId) => {
    const raw = videoDrafts[lessonId] || '';
    if (!raw.trim()) {
      setOverridesState(clearVideoOverride(skill.id, lessonId));
      setVideoErrors(e => ({ ...e, [lessonId]: null }));
      return;
    }
    const parsed = parseVideoInput(raw);
    if (!parsed) {
      setVideoErrors(e => ({ ...e, [lessonId]: 'Enter a valid YouTube link or direct video URL' }));
      return;
    }
    setOverridesState(setVideoOverride(skill.id, lessonId, parsed));
    setVideoErrors(e => ({ ...e, [lessonId]: null }));
  };

  // Other in-progress skills, for the Continue Watching rail.
  const continueWatching = authed
    ? enrolled
        .filter(e => e.skillId !== skill.id)
        .map(e => ({ entry: e, s: getOtherSkillById(e.skillId) }))
        .filter(x => x.s && x.entry.completedLessons.length < x.s.lessons.length)
        .slice(0, 3)
    : [];

  const chapterId = item?.kind === 'chapter' ? item.id : null;
  const saved = chapterId && yt.video ? isLessonSaved(skill.id, chapterId) : false;

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

        {canManageVideos && (
          <div style={{ marginBottom: '18px' }}>
            <button
              className="btn-outline"
              onClick={() => (showVideoManager ? setShowVideoManager(false) : openVideoManager())}
            >
              🎬 {showVideoManager ? 'Close video manager' : 'Manage course videos'}
            </button>

            {showVideoManager && (
              <div className="col-card" style={{ marginTop: '12px' }}>
                <h3 style={{ marginBottom: '4px' }}>Course videos</h3>
                <div className="desc" style={{ marginBottom: '16px' }}>
                  Paste a YouTube link or a direct video file URL for any lesson below, then save.
                  Leave a field blank and save to remove a custom video and fall back to the default.
                  This applies for every learner viewing this course, not just you.
                </div>
                {videoLessons.map(l => (
                  <div key={l.id} style={{ marginBottom: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px', gap: '8px' }}>
                      <b style={{ fontSize: '13px' }}>{l.title}</b>
                      <span style={{ fontSize: '11.5px', color: 'var(--muted)', whiteSpace: 'nowrap' }}>
                        {overrides[l.id]
                          ? (overrides[l.id].type === 'youtube' ? 'Custom YouTube video' : 'Custom video URL')
                          : 'Default sample video'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        className={`form-input ${videoErrors[l.id] ? 'err' : ''}`}
                        style={{ flex: 1 }}
                        placeholder="https://youtube.com/watch?v=... or https://your-cdn.com/video.mp4"
                        value={videoDrafts[l.id] ?? ''}
                        onChange={e => setVideoDrafts(d => ({ ...d, [l.id]: e.target.value }))}
                      />
                      <button className="btn-primary-lg" style={{ padding: '0 18px' }} onClick={() => saveVideoForLesson(l.id)}>
                        Save
                      </button>
                    </div>
                    {videoErrors[l.id] && (
                      <div style={{ color: 'var(--danger)', fontSize: '11.5px', marginTop: '4px' }}>{videoErrors[l.id]}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
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
        ) : item?.kind === 'chapter' ? (
          <div className="video-frame glass" style={{ padding: 0 }}>
            <YouTubePlayer
              key={yt.video.id}
              ref={playerRef}
              videoId={yt.video.id}
              startSeconds={item.startSeconds}
              autoplay={autoplayNext && activeIdx > 0}
              onEnded={handleVideoEnded}
              onProgress={handleProgress}
            />
          </div>
        ) : item?.override?.type === 'youtube' ? (
          <div className="video-frame glass" style={{ padding: 0 }}>
            <iframe
              key={item.id}
              src={`https://www.youtube.com/embed/${item.override.youtubeId}`}
              title={item.title}
              style={{ width: '100%', height: '100%', border: 'none' }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <VideoWithFallback key={item?.id} src={item?.override?.url || item?.lesson?.videoUrl} />
        )}

        {!yt.loading && (
          <div className="lesson-toolbar" style={{ marginTop: '18px' }}>
            <div className="left">
              {item?.kind === 'chapter' && yt.video && (
                <span className="chan-badge">▶ <b>{yt.video.channelTitle}</b></span>
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
            {item?.kind === 'chapter' && yt.video && (
              <button
                className={`icon-btn ${saved ? 'active' : ''}`}
                title="Save for later"
                onClick={() => toggleSavedLesson(skill.id, {
                  chapterId: item.id, videoId: yt.video.id, startSeconds: item.startSeconds,
                  title: item.title, thumbnail: yt.video.thumbnail, channelTitle: yt.video.channelTitle
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
            {item?.kind === 'chapter' && yt.video?.description && (
              <p>{yt.video.description.slice(0, 320)}{yt.video.description.length > 320 ? '…' : ''}</p>
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
              {c.kind === 'chapter' && yt.video ? (
                <img className="playlist-thumb" src={yt.video.thumbnail} alt="" loading="lazy" />
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
