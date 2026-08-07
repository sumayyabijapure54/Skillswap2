import { Router } from 'express';
import { getQuiz, submitQuiz, regenerateQuiz } from '../controllers/quizController.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { submitQuizSchema } from '../validation/schemas.js';

const router = Router();

router.get('/:skillId', requireAuth, getQuiz);
router.post('/:skillId/submit', requireAuth, validate(submitQuizSchema), submitQuiz);
router.post('/:skillId/regenerate', requireAuth, regenerateQuiz);

export default router;
