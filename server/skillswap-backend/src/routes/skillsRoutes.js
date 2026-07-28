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
import { createSkillSchema, updateSkillSchema } from '../validation/schemas.js';

const router = Router();

// Order matters: /meta/* and /mentor/* must be registered before /:id so
// they aren't treated as a skill id.
router.get('/meta/categories', getCategories);
router.get('/meta/levels', getLevels);
router.get('/mentor/available', requireAuth, listUnclaimedSkills);
router.get('/mentor/mine', requireAuth, listMySkills);

router.get('/', listSkills);
router.post('/', requireAuth, validate(createSkillSchema), createSkill);
router.get('/:id/full', optionalAuth, getSkillFull);
router.get('/:id', getSkillById);
router.patch('/:id', requireAuth, validate(updateSkillSchema), updateSkill);
router.delete('/:id', requireAuth, deleteSkill);
router.patch('/:id/claim', requireAuth, claimSkillMentor);
router.patch('/:id/unclaim', requireAuth, unclaimSkillMentor);

export default router;
