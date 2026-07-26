import { Router } from 'express';
import { listProgress, enroll, completeLesson } from '../controllers/progressController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAuth, listProgress);
router.post('/:skillId/enroll', requireAuth, enroll);
router.post('/:skillId/lessons/:lessonId/complete', requireAuth, completeLesson);

export default router;
