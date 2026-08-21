import User from '../models/User.js';
import Skill from '../models/Skill.js';

// A "mentor" in this codebase isn't its own collection — it's any User who
// is the real, claimed mentorUser on at least one Skill (see
// server/src/models/Skill.js). This file is the single place that turns
// that relationship into mentor cards for both the admin management screen
// and the public homepage "Top Mentors" section, so the two can never
// drift out of sync with each other.

// Collapses a mentor's skills into the display fields a mentor card needs.
// `mentor.rating`/`mentor.reviews` are stored per-skill (denormalized —
// see Skill's MentorSchema), so a mentor teaching several skills gets a
// reviews-weighted average rating and a total review count across all of
// them, and the skill with the most reviews (ties broken by rating) is
// used as the "main skill" / profile link.
function summarizeMentorSkills(skills) {
  const bySkill = [...skills].sort((a, b) => {
    const reviewDiff = (b.mentor?.reviews || 0) - (a.mentor?.reviews || 0);
    if (reviewDiff !== 0) return reviewDiff;
    return (b.mentor?.rating || 0) - (a.mentor?.rating || 0);
  });
  const main = bySkill[0];

  const totalReviews = skills.reduce((sum, s) => sum + (s.mentor?.reviews || 0), 0);
  const weightedRating = totalReviews > 0
    ? skills.reduce((sum, s) => sum + (s.mentor?.rating || 0) * (s.mentor?.reviews || 0), 0) / totalReviews
    : (main?.mentor?.rating || 0);

  return {
    mainSkill: main?.title || null,
    skillId: main?.id || null,
    rating: Math.round(weightedRating * 10) / 10,
    reviews: totalReviews
  };
}

function buildMentorCard(user, skills) {
  const summary = summarizeMentorSkills(skills);
  const initials = (user.name || '')
    .split(' ')
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return {
    id: user._id?.toString?.() || user.id,
    name: user.name,
    initials,
    avatar: user.avatar || '',
    role: skills[0]?.mentor?.role || '',
    ...summary,
    skillCount: skills.length,
    isTopMentor: !!user.isTopMentor,
    topMentorOrder: user.topMentorOrder ?? null
  };
}

// Shared by listMentorsForAdmin/listFeaturedForAdmin/getPublicTopMentors —
// groups every claimed skill by its real mentorUser.
async function loadMentorCards({ onlyFeatured = false } = {}) {
  const skills = await Skill.find({ mentorUser: { $ne: null } }).lean();
  const skillsByMentor = new Map();
  for (const skill of skills) {
    const key = skill.mentorUser.toString();
    if (!skillsByMentor.has(key)) skillsByMentor.set(key, []);
    skillsByMentor.get(key).push(skill);
  }

  const mentorIds = [...skillsByMentor.keys()];
  if (mentorIds.length === 0) return [];

  const userFilter = { _id: { $in: mentorIds } };
  if (onlyFeatured) userFilter.isTopMentor = true;

  const users = await User.find(userFilter).lean();
  return users.map((u) => buildMentorCard(u, skillsByMentor.get(u._id.toString()) || []));
}

// GET /api/admin/mentors  (admin) — every real registered mentor, featured or not.
export async function listMentorsForAdmin(req, res, next) {
  try {
    const mentors = await loadMentorCards();
    mentors.sort((a, b) => {
      if (a.isTopMentor !== b.isTopMentor) return a.isTopMentor ? -1 : 1;
      if (a.isTopMentor) return (a.topMentorOrder || 0) - (b.topMentorOrder || 0);
      return (b.rating || 0) - (a.rating || 0);
    });
    res.json({ mentors });
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/mentors/top  (admin) — just the currently-featured slice,
// already in display order. Equivalent to filtering listMentorsForAdmin's
// response client-side, provided as its own endpoint per the spec.
export async function listFeaturedForAdmin(req, res, next) {
  try {
    const mentors = await loadMentorCards({ onlyFeatured: true });
    mentors.sort((a, b) => (a.topMentorOrder || 0) - (b.topMentorOrder || 0));
    res.json({ mentors });
  } catch (err) {
    next(err);
  }
}

// PUT /api/admin/mentors/:id/feature  (admin)
// The server — never the client — decides the resulting order, so a
// mentor can't manipulate the request to jump the queue: new features
// always land at the end.
export async function featureMentor(req, res, next) {
  try {
    const mentor = await User.findById(req.params.id);
    if (!mentor) return res.status(404).json({ message: 'Mentor not found' });

    if (!mentor.isTopMentor) {
      const highest = await User.findOne({ isTopMentor: true }).sort({ topMentorOrder: -1 });
      mentor.isTopMentor = true;
      mentor.topMentorOrder = (highest?.topMentorOrder || 0) + 1;
      await mentor.save();
    }

    res.json({ mentor: buildMentorCard(mentor, await Skill.find({ mentorUser: mentor._id }).lean()) });
  } catch (err) {
    next(err);
  }
}

// PUT /api/admin/mentors/:id/unfeature  (admin)
export async function unfeatureMentor(req, res, next) {
  try {
    const mentor = await User.findById(req.params.id);
    if (!mentor) return res.status(404).json({ message: 'Mentor not found' });

    mentor.isTopMentor = false;
    mentor.topMentorOrder = null;
    await mentor.save();

    res.json({ mentor: buildMentorCard(mentor, await Skill.find({ mentorUser: mentor._id }).lean()) });
  } catch (err) {
    next(err);
  }
}

// PUT /api/admin/mentors/top/order  (admin)  { order: [userId, userId, ...] }
// Re-sequences the featured list to exactly the order given. Only ids that
// are already featured are accepted — this endpoint changes display order,
// not who's featured (use feature/unfeature for that).
export async function reorderTopMentors(req, res, next) {
  try {
    const { order } = req.body;
    if (!Array.isArray(order) || order.length === 0) {
      return res.status(400).json({ message: 'order must be a non-empty array of mentor ids' });
    }

    const featured = await User.find({ isTopMentor: true }).select('_id');
    const featuredIds = new Set(featured.map((u) => u._id.toString()));

    const unknown = order.find((id) => !featuredIds.has(String(id)));
    if (unknown) {
      return res.status(400).json({ message: `Mentor ${unknown} is not currently featured` });
    }
    if (order.length !== featuredIds.size) {
      return res.status(400).json({ message: 'order must include every currently featured mentor exactly once' });
    }

    await Promise.all(
      order.map((id, index) => User.findByIdAndUpdate(id, { topMentorOrder: index + 1 }))
    );

    const mentors = await loadMentorCards({ onlyFeatured: true });
    mentors.sort((a, b) => (a.topMentorOrder || 0) - (b.topMentorOrder || 0));
    res.json({ mentors });
  } catch (err) {
    next(err);
  }
}

// GET /api/mentors/top  (public) — only isTopMentor:true, sorted by
// topMentorOrder ASC. This is the homepage's only source of truth for the
// Top Mentors section; no rating-based fallback or auto-selection here.
export async function getPublicTopMentors(req, res, next) {
  try {
    const mentors = await loadMentorCards({ onlyFeatured: true });
    mentors.sort((a, b) => (a.topMentorOrder || 0) - (b.topMentorOrder || 0));
    // Public data only — nothing admin-only (like raw ids-as-admin-controls)
    // beyond what the mentor card needs to render/link.
    res.json({ mentors });
  } catch (err) {
    next(err);
  }
}
