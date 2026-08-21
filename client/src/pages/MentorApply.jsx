import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout.jsx';
import { useCategories } from '../lib/skillsApi.js';
import { api } from '../lib/api.js';
import { useToast } from '../context/ToastContext.jsx';

// Frontend for the mentor application flow. The backend side of this
// already existed (submitApplication / MentorApplication model / admin
// review at /admin/mentor-applications) — this page just wires the missing
// user-facing form up to it. Fields match submitMentorApplicationSchema
// exactly (skillTitle, category, bio) — nothing invented beyond that.
export default function MentorApply() {
  const navigate = useNavigate();
  const { categories } = useCategories();
  const toast = useToast();

  const [form, setForm] = React.useState({ skillTitle: '', category: 'programming', bio: '' });
  const [errors, setErrors] = React.useState({});
  const [submitting, setSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  const set = (k, v) => { setForm((f) => ({ ...f, [k]: v })); setErrors((e) => ({ ...e, [k]: null })); };

  const onSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.skillTitle.trim()) errs.skillTitle = 'Tell us the skill you want to teach.';
    if (!form.bio.trim() || form.bio.trim().length < 20) errs.bio = 'Add a bit more detail about your experience (20+ characters).';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setSubmitting(true);
    try {
      await api.post('/api/mentor-applications', {
        skillTitle: form.skillTitle.trim(),
        category: form.category,
        bio: form.bio.trim()
      });
      setSubmitted(true);
    } catch (err) {
      if (err.status === 409) {
        // Duplicate-pending-application protection, already enforced
        // server-side — surface it clearly instead of a generic error.
        setErrors({ form: err.message });
        toast.error(err.message);
      } else {
        setErrors({ form: err.message || 'Something went wrong — please try again.' });
        toast.error('Could not submit your application — please try again.');
      }
    }
    setSubmitting(false);
  };

  if (submitted) {
    return (
      <DashboardLayout>
        <div className="success-box" style={{ maxWidth: '480px', margin: '60px auto 0' }}>
          <div className="tick">✓</div>
          <h1>Application submitted</h1>
          <p>Thanks for applying to mentor on SkillSwap! Your application is now awaiting admin review — we'll notify you here once it's been decided.</p>
          <button className="btn-primary-lg btn-full" onClick={() => navigate('/dashboard')}>Back to Dashboard →</button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Become a Mentor" subtitle="Tell us what you'd like to teach — an admin will review your application before it goes live.">
      <form className="col-card" onSubmit={onSubmit} style={{ maxWidth: '640px' }}>
        <div className="form-group">
          <label className="form-label">Skill you want to teach</label>
          <input
            className={`form-input ${errors.skillTitle ? 'err' : ''}`}
            type="text"
            placeholder="e.g. React Fundamentals, Conversational Spanish, Watercolor Painting"
            value={form.skillTitle}
            onChange={(e) => set('skillTitle', e.target.value)}
          />
          {errors.skillTitle && <div className="form-error">{errors.skillTitle}</div>}
        </div>

        <div className="form-group">
          <label className="form-label">Category</label>
          <select className="form-input" value={form.category} onChange={(e) => set('category', e.target.value)}>
            {categories.map((c) => <option value={c.key} key={c.key}>{c.icon} {c.label}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Bio &amp; relevant experience</label>
          <textarea
            className={`form-input ${errors.bio ? 'err' : ''}`}
            rows={6}
            placeholder="Share your background with this skill, any teaching or mentoring experience, and what students can expect from you."
            value={form.bio}
            onChange={(e) => set('bio', e.target.value)}
          />
          {errors.bio && <div className="form-error">{errors.bio}</div>}
          <div className="form-hint">Up to 1000 characters.</div>
        </div>

        {errors.form && <div className="form-error">{errors.form}</div>}
        <button type="submit" className="btn-primary-lg" disabled={submitting}>
          {submitting ? 'Submitting…' : 'Submit Application →'}
        </button>
      </form>
    </DashboardLayout>
  );
}
