import { Router } from 'express';
import { listProgress, enroll, completeLesson, recordQuizScore } from '../controllers/progressController.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { recordQuizScoreSchema } from '../validation/schemas.js';

const router = Router();

router.get('/', requireAuth, listProgress);
router.post('/:skillId/enroll', requireAuth, enroll);
router.post('/:skillId/lessons/:lessonId/complete', requireAuth, completeLesson);
router.post('/:skillId/lessons/:lessonId/quiz', requireAuth, validate(recordQuizScoreSchema), recordQuizScore);

export default router;
