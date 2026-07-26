import { Router } from 'express';
import { updateProfile, completeOnboarding, changePassword, deleteAccount } from '../controllers/usersController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.patch('/me', requireAuth, updateProfile);
router.patch('/me/onboarding', requireAuth, completeOnboarding);
router.patch('/me/password', requireAuth, changePassword);
router.delete('/me', requireAuth, deleteAccount);

export default router;
