import { Router } from 'express';
import { listUsers, suspendUser, reinstateUser, makeAdmin, revokeAdmin } from '../controllers/adminController.js';
import {
  listMentorsForAdmin,
  listFeaturedForAdmin,
  featureMentor,
  unfeatureMentor,
  reorderTopMentors
} from '../controllers/topMentorsController.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth, requireAdmin);

router.get('/users', listUsers);
router.patch('/users/:id/suspend', suspendUser);
router.patch('/users/:id/reinstate', reinstateUser);
router.patch('/users/:id/make-admin', makeAdmin);
router.patch('/users/:id/revoke-admin', revokeAdmin);

// Top Mentors management — see topMentorsController.js for how "mentor"
// is derived from Skill.mentorUser.
router.get('/mentors', listMentorsForAdmin);
router.get('/mentors/top', listFeaturedForAdmin);
router.put('/mentors/:id/feature', featureMentor);
router.put('/mentors/:id/unfeature', unfeatureMentor);
router.put('/mentors/top/order', reorderTopMentors);

export default router;
