import { Router } from 'express';
import {
  updateProfile,
  completeOnboarding,
  changePassword,
  deleteAccount,
  uploadUserAvatar,
  removeUserAvatar
} from '../controllers/usersController.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { changePasswordSchema, updateProfileSchema, completeOnboardingSchema } from '../validation/schemas.js';
import { uploadAvatar } from '../middleware/upload.js';

const router = Router();

router.patch('/me', requireAuth, validate(updateProfileSchema), updateProfile);
router.patch('/me/onboarding', requireAuth, validate(completeOnboardingSchema), completeOnboarding);
router.patch('/me/password', requireAuth, validate(changePasswordSchema), changePassword);
router.delete('/me', requireAuth, deleteAccount);

// multipart/form-data — requireAuth must run first so uploadAvatar's
// filename callback has req.user available.
router.post('/me/avatar', requireAuth, uploadAvatar, uploadUserAvatar);
router.delete('/me/avatar', requireAuth, removeUserAvatar);

export default router;
