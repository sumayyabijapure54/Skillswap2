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

  const [ytUrl, setYtUrl] = React.useState('');
  const [ytVideo, setYtVideo] = React.useState(null);
  const [ytFetching, setYtFetching] = React.useState(false);
  const [ytError, setYtError] = React.useState('');

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
        if (skill.youtubeVideo) setYtVideo(skill.youtubeVideo);
      })
      .catch(err => setSaveError(err.message || 'Could not load this course.'))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const fetchYoutubeVideo = async () => {
    if (!ytUrl.trim()) return;
    setYtFetching(true);
    setYtError('');
    try {
      const data = await api.get(`/api/youtube/video?url=${encodeURIComponent(ytUrl.trim())}`);
      const v = data.video;
      setYtVideo({
        videoId: v.id,
        title: v.title,
        url: v.url,
        embedUrl: `https://www.youtube.com/embed/${v.id}`,
        thumbnail: v.thumbnail || '',
        channelTitle: v.channelTitle || '',
        duration: v.duration || '',
        durationSeconds: v.durationSeconds || 0
      });
      setYtUrl('');
    } catch (err) {
      setYtError(err.message || 'Could not fetch that video.');
    } finally {
      setYtFetching(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.title.trim()) errs.title = 'Give your course a title.';
    if (!form.description.trim() || form.description.trim().length < 20) errs.description = 'Add a bit more detail (20+ characters).';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setSaving(true);
    setSaveError('');

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      duration: form.duration.trim() || undefined,
      prerequisites: form.prerequisites.split(',').map(s => s.trim()).filter(Boolean),
      tags: form.tags.split(',').map(s => s.trim()).filter(Boolean),
      youtubeVideo: ytVideo || null
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
      subtitle={isEdit ? 'Update your course details or swap out its video.' : 'Fill in the details below to publish a new course.'}
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
          <label className="form-label">Upload YouTube course</label>
          <div className="form-input-row">
            <input
              className="form-input"
              type="text"
              placeholder="Paste a YouTube video URL"
              value={ytUrl}
              onChange={e => setYtUrl(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); fetchYoutubeVideo(); } }}
            />
            <button type="button" className="btn-outline" disabled={ytFetching || !ytUrl.trim()} onClick={fetchYoutubeVideo}>
              {ytFetching ? 'Fetching…' : 'Fetch video'}
            </button>
          </div>
          <div className="form-hint">Paste a link and we'll pull in the title, thumbnail, and duration automatically.</div>
          {ytError && <div className="form-error">{ytError}</div>}

          {ytVideo && (
            <div className="yt-preview-card">
              {ytVideo.thumbnail && <img src={ytVideo.thumbnail} alt={ytVideo.title} />}
              <div className="yt-preview-info">
                <b>{ytVideo.title}</b>
                <span>{ytVideo.channelTitle}{ytVideo.duration ? ` · ${ytVideo.duration}` : ''}</span>
                <button type="button" style={{ marginTop: '6px', color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '11.5px', fontWeight: 600, padding: 0 }} onClick={() => setYtVideo(null)}>Remove video</button>
              </div>
            </div>
          )}
        </div>

        {saveError && <div className="form-error" style={{ marginBottom: '14px' }}>{saveError}</div>}

        <button type="submit" className="btn-primary-lg" disabled={saving}>
          {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Publish course →'}
        </button>
      </form>
    </DashboardLayout>
  );
}
