import { Router } from 'express';
import {
  createReview,
  listSkillReviews,
  listMyReviews,
  listMentorReviews,
  listReviewableBookings
} from '../controllers/reviewsController.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createReviewSchema } from '../validation/schemas.js';

const router = Router();

// Order matters: these static paths must be registered before /skill/:skillId
// isn't ambiguous with them, but keep /mine and /reviewable above it anyway
// for consistency with the rest of the routers.
router.get('/mine', requireAuth, listMyReviews);
router.get('/mentor', requireAuth, listMentorReviews);
router.get('/reviewable', requireAuth, listReviewableBookings);
router.get('/skill/:skillId', listSkillReviews);
router.post('/', requireAuth, validate(createReviewSchema), createReview);

export default router;
