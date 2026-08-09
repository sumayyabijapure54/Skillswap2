import MentorApplication from '../models/MentorApplication.js';
import User from '../models/User.js';
import { notifyUser } from '../utils/notify.js';
import { parsePagination, paginationMeta } from '../utils/pagination.js';

// Mirrors MentorApplication's schema-level toJSON transform, which .lean()
// results skip — same pattern as leanSkill/leanReview/leanReport elsewhere.
function leanApplication(a) {
  const { _id, __v, user, skillTitle, ...rest } = a;
  return { id: _id, skill: skillTitle, submittedAt: a.createdAt, ...rest };
}

// POST /api/mentor-applications  { skillTitle, category, bio }  (protected)
export async function submitApplication(req, res, next) {
  try {
    const { skillTitle, category, bio } = req.body;

    const existing = await MentorApplication.findOne({ user: req.user._id, status: 'pending' });
    if (existing) {
      return res.status(409).json({ message: 'You already have a pending mentor application' });
    }

    const application = await MentorApplication.create({
      user: req.user._id,
      name: req.user.name,
      email: req.user.email,
      skillTitle,
      category,
      bio
    });

    res.status(201).json({ application });
  } catch (err) {
    next(err);
  }
}

// GET /api/mentor-applications?status=&page=&limit=  (admin)
export async function listApplications(req, res, next) {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const { limit, page, skip } = parsePagination(req.query, { defaultLimit: 50 });

    const [applications, total] = await Promise.all([
      MentorApplication.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      MentorApplication.countDocuments(filter)
    ]);

    res.json({ applications: applications.map(leanApplication), ...paginationMeta({ page, limit, total }) });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/mentor-applications/:id/approve  (admin)
// Grants teaching capability without discarding existing learner status —
// doesn't auto-post the skill they described, that's still a separate
// "Post a Skill" action for them to take once approved.
export async function approveApplication(req, res, next) {
  try {
    const application = await MentorApplication.findById(req.params.id);
    if (!application) return res.status(404).json({ message: 'Application not found' });
    if (application.status !== 'pending') {
      return res.status(400).json({ message: 'Application has already been reviewed' });
    }

    application.status = 'approved';
    application.reviewedAt = new Date();
    await application.save();

    const user = await User.findById(application.user);
    if (user) {
      if (!user.role) user.role = 'teach';
      else if (user.role === 'learn') user.role = 'both';
      // already 'teach' or 'both' — nothing to change
      await user.save();

      await notifyUser({
        user: user._id,
        type: 'system',
        text: `Your mentor application for "${application.skillTitle}" was approved! You can now post that skill.`
      });
    }

    res.json({ application });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/mentor-applications/:id/reject  (admin)
export async function rejectApplication(req, res, next) {
  try {
    const application = await MentorApplication.findById(req.params.id);
    if (!application) return res.status(404).json({ message: 'Application not found' });
    if (application.status !== 'pending') {
      return res.status(400).json({ message: 'Application has already been reviewed' });
    }

    application.status = 'rejected';
    application.reviewedAt = new Date();
    await application.save();

    await notifyUser({
      user: application.user,
      type: 'system',
      text: `Your mentor application for "${application.skillTitle}" wasn't approved this time.`
    });

    res.json({ application });
  } catch (err) {
    next(err);
  }
}
