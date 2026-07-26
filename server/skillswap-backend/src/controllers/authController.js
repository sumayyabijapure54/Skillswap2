import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { sendMail, otpEmailHtml, resetPasswordEmailHtml } from '../utils/email.js';
import { generateOTP, generateResetToken, hashToken } from '../utils/tokens.js';

const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes
const RESET_TTL_MS = 30 * 60 * 1000; // 30 minutes

function signToken(user) {
  return jwt.sign({ sub: user._id.toString() }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
}

async function issueAndSendOTP(user) {
  const otp = generateOTP();
  user.emailVerifyOTP = otp;
  user.emailVerifyExpires = new Date(Date.now() + OTP_TTL_MS);
  await user.save();
  await sendMail({ to: user.email, subject: 'Verify your SkillSwap email', html: otpEmailHtml(user.name, otp) });
}

// POST /api/auth/signup
export async function signup(req, res, next) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'name, email, and password are all required' });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({ message: 'An account with that email already exists' });
    }

    const user = await User.create({ name: name.trim(), email, password });
    await issueAndSendOTP(user);
    await Notification.create({
      user: user._id,
      type: 'system',
      text: 'Welcome to SkillSwap! Complete your profile to get better matches.'
    });

    const token = signToken(user);
    res.status(201).json({ token, user });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/login
export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = signToken(user);
    user.password = undefined;

    res.json({ token, user });
  } catch (err) {
    next(err);
  }
}

// GET /api/auth/me  (protected)
export async function getMe(req, res) {
  res.json({ user: req.user });
}

// POST /api/auth/verify-email  { otp }  (protected)
export async function verifyEmail(req, res, next) {
  try {
    const { otp } = req.body;
    if (!otp) return res.status(400).json({ message: 'otp is required' });

    const user = await User.findById(req.user._id).select('+emailVerifyOTP +emailVerifyExpires');

    if (user.verified) {
      return res.json({ user });
    }
    if (!user.emailVerifyOTP || !user.emailVerifyExpires || user.emailVerifyExpires < new Date()) {
      return res.status(400).json({ message: 'Code expired — request a new one' });
    }
    if (user.emailVerifyOTP !== String(otp)) {
      return res.status(400).json({ message: 'Incorrect code' });
    }

    user.verified = true;
    user.emailVerifyOTP = undefined;
    user.emailVerifyExpires = undefined;
    await user.save();

    res.json({ user });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/resend-otp  (protected)
export async function resendOTP(req, res, next) {
  try {
    const user = await User.findById(req.user._id);
    if (user.verified) {
      return res.status(400).json({ message: 'Email is already verified' });
    }
    await issueAndSendOTP(user);
    res.json({ message: 'Verification code resent' });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/forgot-password  { email }
export async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'email is required' });

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    // Always respond the same way whether or not the email exists, so this
    // endpoint can't be used to check which emails are registered.
    const genericMessage = { message: "If that email is registered, we've sent a reset link." };

    if (!user) return res.json(genericMessage);

    const { rawToken, hashedToken } = generateResetToken();
    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = new Date(Date.now() + RESET_TTL_MS);
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${rawToken}`;
    await sendMail({
      to: user.email,
      subject: 'Reset your SkillSwap password',
      html: resetPasswordEmailHtml(user.name, resetUrl)
    });

    res.json(genericMessage);
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/reset-password  { token, password }
export async function resetPassword(req, res, next) {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res.status(400).json({ message: 'token and password are required' });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }

    const user = await User.findOne({
      passwordResetToken: hashToken(token),
      passwordResetExpires: { $gt: new Date() }
    }).select('+passwordResetToken +passwordResetExpires');

    if (!user) {
      return res.status(400).json({ message: 'That reset link is invalid or has expired' });
    }

    user.password = password; // re-hashed by the pre-save hook
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.json({ message: 'Password updated — you can now log in' });
  } catch (err) {
    next(err);
  }
}
