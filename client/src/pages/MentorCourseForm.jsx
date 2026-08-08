import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout.jsx';
import { api } from '../lib/api.js';
import { useCategories, useLevels } from '../lib/skillsApi.js';

// Categories/levels come from the live API (useCategories/useLevels) rather
// than any static list, so this form can never offer a category or level
// that fails to save against the backend's Skill schema.

const EMPTY_FORM = {
  title: '', category: 'programming', level: 'Beginner', description: '',
  duration: '', mentorRole: '', prerequisites: '', tags: ''
};

let nextClientId = 1;
function newLessonDraft() {
  return { clientId: nextClientId++, title: '', description: '', ytUrl: '', youtube: null, fetching: false, error: null };
}

// Turns a saved skill.lessons entry (server shape) back into an editable
// draft row. Quiz lessons aren't editable in this builder yet, so they're
// carried through untouched and re-sent as-is on save.
function draftFromLesson(lesson) {
  return {
    clientId: nextClientId++,
    title: lesson.title || '',
    description: lesson.description || '',
    ytUrl: '',
    youtube: lesson.youtube || null,
    fetching: false,
    error: null
  };
}

export default function MentorCourseForm(){
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [form, setForm] = React.useState(EMPTY_FORM);
  const [errors, setErrors] = React.useState({});
  const [loading, setLoading] = React.useState(isEdit);
  const [saving, setSaving] = React.useState(false);
  const [saveError, setSaveError] = React.useState('');
  const { categories } = useCategories();
  const { levels } = useLevels();

  // Every lesson the mentor is building/editing. Each lesson owns its own
  // YouTube URL — there is no course-level video and no automatic search;
  // a lesson's video is exactly whatever the mentor pastes here.
  const [lessons, setLessons] = React.useState([newLessonDraft()]);

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: null })); };

  React.useEffect(() => {
    if (!isEdit) return;
    api.get(`/api/skills/${id}`)
      .then(skill => {
        setForm({
          title: skill.title || '',
          category: skill.category || 'programming',
          level: skill.level || 'Beginner',
          description: skill.description || '',
          duration: skill.duration || '',
          mentorRole: skill.mentor?.role || '',
          prerequisites: (skill.prerequisites || []).join(', '),
          tags: (skill.tags || []).join(', ')
        });
        const videoLessons = (skill.lessons || []).filter(l => l.type !== 'Quiz');
        setLessons(videoLessons.length ? videoLessons.map(draftFromLesson) : [newLessonDraft()]);
      })
      .catch(err => setSaveError(err.message || 'Could not load this course.'))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const updateLesson = (clientId, patch) => {
    setLessons(ls => ls.map(l => l.clientId === clientId ? { ...l, ...patch } : l));
  };

  const addLesson = () => setLessons(ls => [...ls, newLessonDraft()]);

  const removeLesson = (clientId) => setLessons(ls => ls.length > 1 ? ls.filter(l => l.clientId !== clientId) : ls);

  const moveLesson = (clientId, direction) => {
    setLessons(ls => {
      const idx = ls.findIndex(l => l.clientId === clientId);
      const swapWith = idx + direction;
      if (idx === -1 || swapWith < 0 || swapWith >= ls.length) return ls;
      const next = [...ls];
      [next[idx], next[swapWith]] = [next[swapWith], next[idx]];
      return next;
    });
  };

  // Validates the pasted URL, extracts the video id server-side, and pulls
  // in title/thumbnail/duration/chapters for exactly that video — never a
  // substitute. The result is stored on this one lesson only.
  const fetchLessonVideo = async (clientId) => {
    const lesson = lessons.find(l => l.clientId === clientId);
    if (!lesson || !lesson.ytUrl.trim()) return;
    updateLesson(clientId, { fetching: true, error: null });
    try {
      const data = await api.get(`/api/youtube/video?url=${encodeURIComponent(lesson.ytUrl.trim())}`);
      const v = data.video;
      updateLesson(clientId, {
        fetching: false,
        ytUrl: '',
        youtube: {
          videoId: v.id,
          title: v.title,
          url: v.url,
          embedUrl: `https://www.youtube.com/embed/${v.id}`,
          thumbnail: v.thumbnail || '',
          channelTitle: v.channelTitle || '',
          duration: v.duration || '',
          durationSeconds: v.durationSeconds || 0,
          chapters: data.chapters || []
        }
      });
    } catch (err) {
      updateLesson(clientId, { fetching: false, error: err.message || 'Could not fetch that video.' });
    }
  };

  const removeLessonVideo = (clientId) => updateLesson(clientId, { youtube: null });

  const onSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.title.trim()) errs.title = 'Give your course a title.';
    if (!form.description.trim() || form.description.trim().length < 20) errs.description = 'Add a bit more detail (20+ characters).';

    const usableLessons = lessons.filter(l => l.title.trim() || l.youtube);
    if (usableLessons.length === 0) {
      errs.lessons = 'Add at least one lesson.';
    } else if (usableLessons.some(l => !l.title.trim())) {
      errs.lessons = 'Every lesson needs a title.';
    } else if (usableLessons.some(l => !l.youtube)) {
      errs.lessons = 'Every lesson needs a YouTube video — paste a link and fetch it before publishing.';
    }
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setSaving(true);
    setSaveError('');

    const lessonsPayload = usableLessons.map((l, i) => ({
      title: l.title.trim(),
      description: l.description.trim(),
      order: i + 1,
      type: 'Video',
      duration: l.youtube.duration || undefined,
      youtube: l.youtube
    }));

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      duration: form.duration.trim() || undefined,
      prerequisites: form.prerequisites.split(',').map(s => s.trim()).filter(Boolean),
      tags: form.tags.split(',').map(s => s.trim()).filter(Boolean),
      lessons: lessonsPayload
    };

    try {
      if (isEdit) {
        await api.patch(`/api/skills/${id}`, payload);
      } else {
        await api.post('/api/skills', {
          ...payload,
          category: form.category,
          level: form.level,
          mentorRole: form.mentorRole.trim() || undefined
        });
      }
      navigate('/mentor-courses');
    } catch (err) {
      setSaveError(err.message || 'Could not save this course.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title={isEdit ? 'Edit Course' : 'New Course'}>
        <div className="dash-empty">Loading course…</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title={isEdit ? 'Edit Course' : 'Create a New Course'}
      subtitle={isEdit ? 'Update your course details or its lesson videos.' : 'Fill in the details below and add your lesson videos to publish a new course.'}
    >
      <form className="col-card" onSubmit={onSubmit} style={{ maxWidth: '680px' }}>
        <div className="form-group">
          <label className="form-label">Course title</label>
          <input className={`form-input ${errors.title ? 'err' : ''}`} type="text" placeholder="e.g. React Fundamentals" value={form.title} onChange={e => set('title', e.target.value)} />
          {errors.title && <div className="form-error">{errors.title}</div>}
        </div>

        {!isEdit && (
          <div className="form-input-row">
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Category</label>
              <select className="form-input" value={form.category} onChange={e => set('category', e.target.value)}>
                {categories.map(c => <option value={c.key} key={c.key}>{c.icon} {c.label}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Level</label>
              <select className="form-input" value={form.level} onChange={e => set('level', e.target.value)}>
                {levels.map(l => <option value={l} key={l}>{l}</option>)}
              </select>
            </div>
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea className={`form-input ${errors.description ? 'err' : ''}`} rows={5} placeholder="What will students learn in this course?" value={form.description} onChange={e => set('description', e.target.value)} />
          {errors.description && <div className="form-error">{errors.description}</div>}
        </div>

        <div className="form-input-row">
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Duration</label>
            <input className="form-input" type="text" placeholder="e.g. 6h 40m" value={form.duration} onChange={e => set('duration', e.target.value)} />
          </div>
          {!isEdit && (
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Your title (optional)</label>
              <input className="form-input" type="text" placeholder="e.g. Full Stack Developer" value={form.mentorRole} onChange={e => set('mentorRole', e.target.value)} />
            </div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Prerequisites</label>
          <input className="form-input" type="text" placeholder="Comma-separated, e.g. Basic HTML, JavaScript basics" value={form.prerequisites} onChange={e => set('prerequisites', e.target.value)} />
        </div>

        <div className="form-group">
          <label className="form-label">Tags</label>
          <input className="form-input" type="text" placeholder="Comma-separated, e.g. React, Frontend" value={form.tags} onChange={e => set('tags', e.target.value)} />
        </div>

        <div className="form-group">
          <label className="form-label">Lessons</label>
          <div className="form-hint" style={{ marginBottom: '10px' }}>
            Add each lesson in the order students should watch them. Every lesson needs its own YouTube video —
            paste a link and we'll pull in the title, thumbnail, duration, and chapters automatically. Students
            only ever see the video you attach here.
          </div>

          {errors.lessons && <div className="form-error" style={{ marginBottom: '10px' }}>{errors.lessons}</div>}

          {lessons.map((lesson, i) => (
            <div key={lesson.clientId} className="col-card" style={{ marginBottom: '14px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <b style={{ fontSize: '13px' }}>Lesson {i + 1}</b>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button type="button" className="btn-ghost-lg" style={{ padding: '4px 10px' }} disabled={i === 0} onClick={() => moveLesson(lesson.clientId, -1)}>↑</button>
                  <button type="button" className="btn-ghost-lg" style={{ padding: '4px 10px' }} disabled={i === lessons.length - 1} onClick={() => moveLesson(lesson.clientId, 1)}>↓</button>
                  <button type="button" className="btn-ghost-lg" style={{ padding: '4px 10px', color: 'var(--danger)' }} disabled={lessons.length === 1} onClick={() => removeLesson(lesson.clientId)}>Remove</button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Lesson title</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="e.g. JSX and rendering elements"
                  value={lesson.title}
                  onChange={e => updateLesson(lesson.clientId, { title: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Lesson description (optional)</label>
                <textarea
                  className="form-input"
                  rows={2}
                  placeholder="A short note about what this lesson covers"
                  value={lesson.description}
                  onChange={e => updateLesson(lesson.clientId, { description: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">YouTube URL</label>
                <div className="form-input-row">
                  <input
                    className="form-input"
                    type="text"
                    placeholder="Paste this lesson's YouTube video URL"
                    value={lesson.ytUrl}
                    onChange={e => updateLesson(lesson.clientId, { ytUrl: e.target.value })}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); fetchLessonVideo(lesson.clientId); } }}
                  />
                  <button type="button" className="btn-outline" disabled={lesson.fetching || !lesson.ytUrl.trim()} onClick={() => fetchLessonVideo(lesson.clientId)}>
                    {lesson.fetching ? 'Fetching…' : 'Fetch video'}
                  </button>
                </div>
                {lesson.error && <div className="form-error">{lesson.error}</div>}

                {lesson.youtube && (
                  <div className="yt-preview-card">
                    {lesson.youtube.thumbnail && <img src={lesson.youtube.thumbnail} alt={lesson.youtube.title} />}
                    <div className="yt-preview-info">
                      <b>{lesson.youtube.title}</b>
                      <span>{lesson.youtube.channelTitle}{lesson.youtube.duration ? ` · ${lesson.youtube.duration}` : ''}</span>
                      <button type="button" style={{ marginTop: '6px', color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '11.5px', fontWeight: 600, padding: 0 }} onClick={() => removeLessonVideo(lesson.clientId)}>Remove video</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          <button type="button" className="btn-outline" onClick={addLesson}>＋ Add another lesson</button>
        </div>

        {saveError && <div className="form-error" style={{ marginBottom: '14px' }}>{saveError}</div>}

        <button type="submit" className="btn-primary-lg" disabled={saving}>
          {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Publish course →'}
        </button>
      </form>
    </DashboardLayout>
  );
}
