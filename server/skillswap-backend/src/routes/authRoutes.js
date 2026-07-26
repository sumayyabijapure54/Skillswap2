import { Router } from 'express';
import {
  signup,
  login,
  getMe,
  verifyEmail,
  resendOTP,
  forgotPassword,
  resetPassword
} from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', requireAuth, getMe);

router.post('/verify-email', requireAuth, verifyEmail);
router.post('/resend-otp', requireAuth, resendOTP);

router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
