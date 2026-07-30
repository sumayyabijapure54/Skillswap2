import Skill from '../models/Skill.js';
import Booking from '../models/Booking.js';
import Progress from '../models/Progress.js';
import Review from '../models/Review.js';
import User from '../models/User.js';
import { categories, levels } from '../data/skillsSeedData.js';
import { parsePagination, paginationMeta } from '../utils/pagination.js';
import { leanReview } from './reviewsController.js';

const SORTS = {
  popular: { students: -1 },
  rating: { rating: -1 },
  students: { students: -1 },
  az: { title: 1 }
};

// Mirrors Skill's toJSON transform (strip _id/__v) for .lean() results,
// which skip the schema-level transform since they're plain objects, not
// Mongoose documents.
function leanSkill(s) {
  const { _id, __v, ...rest } = s;
  return rest;
}

// GET /api/skills?q=&cat=programming&cat=design&level=Beginner&level=Advanced&sort=rating&page=&limit=
export async function listSkills(req, res, next) {
  try {
    const { q, sort } = req.query;

    // support both repeated params (?cat=a&cat=b) and comma-separated (?cat=a,b)
    const toArray = (val) => {
      if (!val) return [];
      return Array.isArray(val) ? val : String(val).split(',').filter(Boolean);
    };
    const cats = toArray(req.query.cat);
    const lvls = toArray(req.query.level);

    const filter = {};
    if (cats.length) filter.category = { $in: cats };
    if (lvls.length) filter.level = { $in: lvls };
    if (q) filter.$text = { $search: q };

    const sortSpec = SORTS[sort] || SORTS.popular;
    // Generous default — the frontend doesn't send page/limit yet and
    // expects the full catalog back; this just caps a single request from
    // being able to pull an unbounded result set once the catalog grows.
    const { limit, page, skip } = parsePagination(req.query, { defaultLimit: 100, maxLimit: 200 });

    const [results, total] = await Promise.all([
      Skill.find(filter).sort(sortSpec).skip(skip).limit(limit).lean(),
      Skill.countDocuments(filter)
    ]);

    res.json({ count: total, results: results.map(leanSkill), ...paginationMeta({ page, limit, total }) });
  } catch (err) {
    next(err);
  }
}

// GET /api/skills/:id  (id is the slug, e.g. "react-fundamentals")
export async function getSkillById(req, res, next) {
  try {
    const skill = await Skill.findOne({ id: req.params.id }).lean();
    if (!skill) {
      return res.status(404).json({ message: `No skill found with id "${req.params.id}"` });
    }
    res.json(leanSkill(skill));
  } catch (err) {
    next(err);
  }
}

// GET /api/skills/:id/full  (optionalAuth — public, personalized if logged in)
// Everything a skill detail page needs in one round trip: the skill, its
// most recent reviews, and — if the requester is logged in — the earliest
// completed session of theirs that's still waiting on a review, so the
// frontend can show a "leave a review" prompt without a second request.
export async function getSkillFull(req, res, next) {
  try {
    const skill = await Skill.findOne({ id: req.params.id }).lean();
    if (!skill) {
      return res.status(404).json({ message: `No skill found with id "${req.params.id}"` });
    }

    const [reviews, reviewsTotal] = await Promise.all([
      Review.find({ skillId: skill.id }).sort({ createdAt: -1 }).limit(10).populate('user', 'name').lean(),
      Review.countDocuments({ skillId: skill.id })
    ]);

    let reviewableBooking = null;
    if (req.user) {
      const completed = await Booking.find({
        user: req.user._id,
        skillId: skill.id,
        status: 'completed'
      }).sort({ scheduledAt: -1 });

      if (completed.length) {
        const reviewed = await Review.find({
          user: req.user._id,
          booking: { $in: completed.map((b) => b._id) }
        }).select('booking');
        const reviewedIds = new Set(reviewed.map((r) => r.booking.toString()));
        const match = completed.find((b) => !reviewedIds.has(b._id.toString()));
        reviewableBooking = match ? match.toJSON() : null;
      }
    }

    res.json({
      skill: leanSkill(skill),
      reviews: reviews.map(leanReview),
      reviewsTotal,
      reviewableBooking
    });
  } catch (err) {
    next(err);
  }
}


// Returns the static category list plus a live count per category, matching
// the counts shown next to each checkbox in Explore.jsx's filter panel.
export async function getCategories(_req, res, next) {
  try {
    const counts = await Skill.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]);
    const countMap = Object.fromEntries(counts.map((c) => [c._id, c.count]));
    const withCounts = categories.map((c) => ({ ...c, count: countMap[c.key] || 0 }));
    res.json(withCounts);
  } catch (err) {
    next(err);
  }
}

// GET /api/skills/meta/levels
export function getLevels(_req, res) {
  res.json(levels);
}

// GET /api/skills/mentor/available  (protected)
// Skills not yet linked to a real mentor account — candidates to claim.
export async function listUnclaimedSkills(req, res, next) {
  try {
    const { limit, page, skip } = parsePagination(req.query, { defaultLimit: 100, maxLimit: 200 });
    const filter = { mentorUser: null };

    const [results, total] = await Promise.all([
      Skill.find(filter).skip(skip).limit(limit).lean(),
      Skill.countDocuments(filter)
    ]);

    res.json({ count: total, results: results.map(leanSkill), ...paginationMeta({ page, limit, total }) });
  } catch (err) {
    next(err);
  }
}

// GET /api/skills/mentor/mine  (protected) — skills the current user mentors
export async function listMySkills(req, res, next) {
  try {
    const results = await Skill.find({ mentorUser: req.user._id }).lean();
    res.json({ count: results.length, results: results.map(leanSkill) });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/skills/:id/claim  (protected)
// Links this skill's mentor slot to the current user and refreshes the
// denormalized display fields (name/initials/title) from their profile.
export async function claimSkillMentor(req, res, next) {
  try {
    const skill = await Skill.findOne({ id: req.params.id });
    if (!skill) return res.status(404).json({ message: `No skill found with id "${req.params.id}"` });

    if (skill.mentorUser && skill.mentorUser.toString() !== req.user._id.toString()) {
      return res.status(409).json({ message: 'This skill already has a mentor' });
    }

    const initials = req.user.name
      .split(' ')
      .map(w => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

    skill.mentorUser = req.user._id;
    skill.mentor.name = req.user.name;
    skill.mentor.initials = initials || skill.mentor.initials;
    // Keep the existing mentor.role (professional title) and rating/reviews
    // as-is — those are about the mentoring track record, not account info.

    await skill.save();
    res.json({ skill });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/skills/:id/unclaim  (protected) — only the current mentor can release it
export async function unclaimSkillMentor(req, res, next) {
  try {
    const skill = await Skill.findOne({ id: req.params.id });
    if (!skill) return res.status(404).json({ message: `No skill found with id "${req.params.id}"` });

    if (!skill.mentorUser || skill.mentorUser.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You're not the mentor for this skill" });
    }

    skill.mentorUser = null;
    await skill.save();
    res.json({ skill });
  } catch (err) {
    next(err);
  }
}

function slugify(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function uniqueSlug(title) {
  const base = slugify(title) || 'skill';
  let slug = base;
  let n = 2;
  // eslint-disable-next-line no-await-in-loop
  while (await Skill.exists({ id: slug })) {
    slug = `${base}-${n}`;
    n += 1;
  }
  return slug;
}

// POST /api/skills  { title, category, level, description, duration?, mentorRole?, prerequisites?, tags?, lessons? }  (protected)
// A member posts a brand-new skill and becomes its mentor immediately —
// distinct from /skills/:id/claim, which attaches to an existing seeded skill.
export async function createSkill(req, res, next) {
  try {
    const { title, category, level, description, duration, mentorRole, prerequisites, tags, lessons, youtubeVideo } = req.body;

    if (!title || !category || !level || !description) {
      return res.status(400).json({ message: 'title, category, level, and description are required' });
    }
    if (!categories.some((c) => c.key === category)) {
      return res.status(400).json({ message: `category must be one of: ${categories.map((c) => c.key).join(', ')}` });
    }
    if (!levels.includes(level)) {
      return res.status(400).json({ message: `level must be one of: ${levels.join(', ')}` });
    }

    const id = await uniqueSlug(title);
    const initials = req.user.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();

    const cleanLessons = Array.isArray(lessons)
      ? lessons
          .filter((l) => l && l.title)
          .map((l, i) => ({
            id: i + 1,
            title: l.title,
            duration: l.duration || '10 min',
            type: l.type === 'Quiz' ? 'Quiz' : 'Video'
          }))
      : [];

    const skill = await Skill.create({
      id,
      title: title.trim(),
      category,
      level,
      rating: 0,
      students: 0,
      duration: duration || 'Self-paced',
      description,
      mentor: {
        name: req.user.name,
        initials: initials || 'ME',
        role: mentorRole || 'Community Mentor',
        rating: 0,
        reviews: 0
      },
      mentorUser: req.user._id,
      prerequisites: Array.isArray(prerequisites) ? prerequisites.filter(Boolean) : [],
      tags: Array.isArray(tags) ? tags.filter(Boolean) : [],
      lessons: cleanLessons,
      youtubeVideo: youtubeVideo || null
    });

    res.status(201).json({ skill });
  } catch (err) {
    next(err);
  }
}

const EDITABLE_SKILL_FIELDS = ['title', 'description', 'duration', 'prerequisites', 'tags', 'lessons', 'youtubeVideo'];

// PATCH /api/skills/:id  (protected — only the mentor who posted it)
// category/level are intentionally not editable here to keep Explore's
// counts and filters from drifting silently; unclaim + repost covers that.
export async function updateSkill(req, res, next) {
  try {
    const skill = await Skill.findOne({ id: req.params.id });
    if (!skill) return res.status(404).json({ message: `No skill found with id "${req.params.id}"` });
    if (!skill.mentorUser || skill.mentorUser.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You're not the mentor for this skill" });
    }

    for (const field of EDITABLE_SKILL_FIELDS) {
      if (req.body[field] !== undefined) skill[field] = req.body[field];
    }

    await skill.save();
    res.json({ skill });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/skills/:id  (protected — only the mentor who posted it)
// Cancels any of its future confirmed bookings, clears learner progress and
// wishlists for it, and removes its reviews, then deletes the skill itself.
export async function deleteSkill(req, res, next) {
  try {
    const skill = await Skill.findOne({ id: req.params.id });
    if (!skill) return res.status(404).json({ message: `No skill found with id "${req.params.id}"` });
    if (!skill.mentorUser || skill.mentorUser.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You're not the mentor for this skill" });
    }

    const skillId = skill.id;

    await Promise.all([
      Booking.updateMany(
        { skillId, status: 'confirmed', scheduledAt: { $gte: new Date() } },
        { status: 'cancelled' }
      ),
      Progress.deleteMany({ skillId }),
      Review.deleteMany({ skillId }),
      User.updateMany({ wishlist: skillId }, { $pull: { wishlist: skillId } })
    ]);

    await skill.deleteOne();
    res.json({ message: 'Skill deleted' });
  } catch (err) {
    next(err);
  }
}
