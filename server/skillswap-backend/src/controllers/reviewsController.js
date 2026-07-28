import Review from '../models/Review.js';
import Booking from '../models/Booking.js';
import Skill from '../models/Skill.js';
import { parsePagination, paginationMeta } from '../utils/pagination.js';

// Mirrors Review's toJSON transform for .lean() results.
export function leanReview(r) {
  const { _id, __v, user, ...rest } = r;
  const out = { id: _id, ...rest };
  if (user && typeof user === 'object' && user.name) {
    out.reviewer = { id: user._id, name: user.name };
  }
  return out;
}

// Recomputes a skill's aggregate rating/review count from its Review
// documents and writes them onto both `skill.rating`/`skill.reviews` and
// the denormalized `skill.mentor.rating`/`skill.mentor.reviews`, so every
// place that already reads those fields (Explore, SkillDetail, mentor
// cards) picks up real numbers instead of the static seed values.
async function recomputeSkillRating(skillId) {
  const [agg] = await Review.aggregate([
    { $match: { skillId } },
    { $group: { _id: '$skillId', avg: { $avg: '$rating' }, count: { $sum: 1 } } }
  ]);

  const rating = agg ? Math.round(agg.avg * 10) / 10 : 0;
  const reviews = agg ? agg.count : 0;

  const skill = await Skill.findOne({ id: skillId });
  if (!skill) return;

  skill.rating = rating;
  skill.mentor.rating = rating;
  skill.mentor.reviews = reviews;
  await skill.save();
}

// POST /api/reviews  { bookingId, rating, comment? }  (protected)
// Only the learner who attended a *completed* session may review it, and
// only once per booking.
export async function createReview(req, res, next) {
  try {
    const { bookingId, rating, comment } = req.body;

    if (!bookingId || rating === undefined) {
      return res.status(400).json({ message: 'bookingId and rating are required' });
    }
    const numericRating = Number(rating);
    if (!Number.isFinite(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ message: 'rating must be a number between 1 and 5' });
    }

    const booking = await Booking.findOne({ _id: bookingId, user: req.user._id });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.status !== 'completed') {
      return res.status(400).json({ message: 'You can only review completed sessions' });
    }

    const existing = await Review.findOne({ booking: booking._id });
    if (existing) return res.status(409).json({ message: "You've already reviewed this session" });

    const skill = await Skill.findOne({ id: booking.skillId });

    const review = await Review.create({
      user: req.user._id,
      skillId: booking.skillId,
      booking: booking._id,
      skillTitle: booking.skillTitle,
      mentorName: booking.mentorName,
      mentorUser: skill?.mentorUser || null,
      rating: numericRating,
      comment: comment || ''
    });

    await recomputeSkillRating(booking.skillId);

    res.status(201).json({ review });
  } catch (err) {
    // Race on the unique(booking) index — same message as the pre-check above.
    if (err.code === 11000) {
      return res.status(409).json({ message: "You've already reviewed this session" });
    }
    next(err);
  }
}

// GET /api/reviews/skill/:skillId?page=&limit=  (public)
export async function listSkillReviews(req, res, next) {
  try {
    const filter = { skillId: req.params.skillId };
    const { limit, page, skip } = parsePagination(req.query, { defaultLimit: 20 });

    const [reviews, total] = await Promise.all([
      Review.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('user', 'name').lean(),
      Review.countDocuments(filter)
    ]);

    res.json({ reviews: reviews.map(leanReview), ...paginationMeta({ page, limit, total }) });
  } catch (err) {
    next(err);
  }
}

// GET /api/reviews/mine?page=&limit=  (protected) — reviews the current user has written
export async function listMyReviews(req, res, next) {
  try {
    const filter = { user: req.user._id };
    const { limit, page, skip } = parsePagination(req.query, { defaultLimit: 20 });

    const [reviews, total] = await Promise.all([
      Review.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Review.countDocuments(filter)
    ]);

    res.json({ reviews: reviews.map(leanReview), ...paginationMeta({ page, limit, total }) });
  } catch (err) {
    next(err);
  }
}

// GET /api/reviews/reviewable  (protected)
// Completed sessions the current user hasn't reviewed yet — powers a
// "Leave a review" prompt without the frontend having to diff two lists.
export async function listReviewableBookings(req, res, next) {
  try {
    const completed = await Booking.find({ user: req.user._id, status: 'completed' }).sort({ scheduledAt: -1 });
    const reviewed = await Review.find({ user: req.user._id }).select('booking');
    const reviewedIds = new Set(reviewed.map((r) => r.booking.toString()));

    const bookings = completed.filter((b) => !reviewedIds.has(b._id.toString()));
    res.json({ bookings });
  } catch (err) {
    next(err);
  }
}
