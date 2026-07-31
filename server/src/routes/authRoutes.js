import { Router } from 'express';
import {
  signup,
  login,
  getMe,
  verifyEmail,
  resendOTP,
  forgotPassword,
  resetPassword,
  refresh,
  logout,
  googleLogin,
  facebookLogin
} from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimit.js';
import { validate } from '../middleware/validate.js';
import {
  signupSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  refreshTokenSchema,
  logoutSchema
} from '../validation/schemas.js';

const router = Router();

router.post('/signup', authLimiter, validate(signupSchema), signup);
router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/google', authLimiter, googleLogin);
router.post('/facebook', authLimiter, facebookLogin);
router.get('/me', requireAuth, getMe);

router.post('/verify-email', requireAuth, verifyEmail);
router.post('/resend-otp', requireAuth, authLimiter, resendOTP);

router.post('/forgot-password', authLimiter, validate(forgotPasswordSchema), forgotPassword);
router.post('/reset-password', authLimiter, validate(resetPasswordSchema), resetPassword);

router.post('/refresh', authLimiter, validate(refreshTokenSchema), refresh);
router.post('/logout', requireAuth, validate(logoutSchema), logout);

export default router;
