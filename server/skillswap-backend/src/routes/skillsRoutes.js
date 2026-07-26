import { Router } from 'express';
import {
  listSkills,
  getSkillById,
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
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// Order matters: /meta/* and /mentor/* must be registered before /:id so
// they aren't treated as a skill id.
router.get('/meta/categories', getCategories);
router.get('/meta/levels', getLevels);
router.get('/mentor/available', requireAuth, listUnclaimedSkills);
router.get('/mentor/mine', requireAuth, listMySkills);

router.get('/', listSkills);
router.post('/', requireAuth, createSkill);
router.get('/:id', getSkillById);
router.patch('/:id', requireAuth, updateSkill);
router.delete('/:id', requireAuth, deleteSkill);
router.patch('/:id/claim', requireAuth, claimSkillMentor);
router.patch('/:id/unclaim', requireAuth, unclaimSkillMentor);

export default router;
