import { Router } from 'express';
import {
  listSkills,
  getSkillById,
  getSkillFull,
  getCategories,
  getLevels,
  listUnclaimedSkills,
  listMySkills,
  claimSkillMentor,
  unclaimSkillMentor,
  createSkill,
  updateSkill,
  deleteSkill
} from '../controllers/skillsController.js';
import { requireAuth, optionalAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { cacheControl } from '../middleware/cacheControl.js';
import { createSkillSchema, updateSkillSchema } from '../validation/schemas.js';

const router = Router();

// Order matters: /meta/* and /mentor/* must be registered before /:id so
// they aren't treated as a skill id.
//
// Cache-Control added only on responses that are identical for every
// requester (no auth state, no personalization):
//  - /meta/categories and /meta/levels are static in-memory lists (see
//    src/data/skillsSeedData.js) that only change on a deploy, so a long
//    TTL is safe.
//  - listSkills/getSkillById are public catalog data that mentors can
//    edit, so a short TTL keeps edits visible quickly while still saving
//    a full round trip on rapid repeat requests (e.g. filter tweaking).
// getSkillFull is intentionally left uncached — it's optionalAuth and
// personalizes the response ("have you reviewed this?") for logged-in
// users, so caching it could serve one user's personalization to another.
router.get('/meta/categories', cacheControl(3600), getCategories);
router.get('/meta/levels', cacheControl(3600), getLevels);
router.get('/mentor/available', requireAuth, listUnclaimedSkills);
router.get('/mentor/mine', requireAuth, listMySkills);

router.get('/', cacheControl(60), listSkills);
router.post('/', requireAuth, validate(createSkillSchema), createSkill);
router.get('/:id/full', optionalAuth, getSkillFull);
router.get('/:id', cacheControl(60), getSkillById);
router.patch('/:id', requireAuth, validate(updateSkillSchema), updateSkill);
router.delete('/:id', requireAuth, deleteSkill);
router.patch('/:id/claim', requireAuth, claimSkillMentor);
router.patch('/:id/unclaim', requireAuth, unclaimSkillMentor);

export default router;
