import { Router } from 'express';
import {
  getQuizForManage, saveQuiz, setPublished,
  getQuizStatus, getQuiz, submitQuiz
} from '../controllers/quizController.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { saveQuizSchema, publishQuizSchema, submitQuizSchema } from '../validation/schemas.js';

const router = Router();

// Mentor management (ownership enforced in the controller, not here, so a
// single 403 message can explain *why* — "only this course's mentor").
router.get('/:skillId/manage', requireAuth, getQuizForManage);
router.put('/:skillId', requireAuth, validate(saveQuizSchema), saveQuiz);
router.patch('/:skillId/publish', requireAuth, validate(publishQuizSchema), setPublished);

// Learner-facing
router.get('/:skillId/status', requireAuth, getQuizStatus);
router.get('/:skillId', requireAuth, getQuiz);
router.post('/:skillId/submit', requireAuth, validate(submitQuizSchema), submitQuiz);

export default router;
