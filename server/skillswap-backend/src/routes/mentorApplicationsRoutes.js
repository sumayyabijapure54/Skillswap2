import { Router } from 'express';
import {
  submitApplication,
  listApplications,
  approveApplication,
  rejectApplication
} from '../controllers/mentorApplicationsController.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { submitMentorApplicationSchema } from '../validation/schemas.js';

const router = Router();

router.post('/', requireAuth, validate(submitMentorApplicationSchema), submitApplication);
router.get('/', requireAuth, requireAdmin, listApplications);
router.patch('/:id/approve', requireAuth, requireAdmin, approveApplication);
router.patch('/:id/reject', requireAuth, requireAdmin, rejectApplication);

export default router;
