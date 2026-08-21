import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import RefreshToken from '../models/RefreshToken.js';
import { sendMail, otpEmailHtml, resetPasswordEmailHtml } from '../utils/email.js';
import { generateOTP, generateResetToken, generateRefreshToken, hashToken } from '../utils/tokens.js';
import { notifyUser } from '../utils/notify.js';
import { verifyGoogleToken, verifyFacebookToken } from '../lib/socialAuth.js';

const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes
const RESET_TTL_MS = 30 * 60 * 1000; // 30 minutes
const REFRESH_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

function signToken(user) {
  return jwt.sign({ sub: user._id.toString() }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
}

// Issues a new refresh token for a user and stores its hash. The access
// token's own expiry (JWT_EXPIRES_IN, default 7d) is left as-is here so
// existing clients that don't yet call /refresh keep working unchanged —
// this is purely additive. A client that wants shorter-lived access tokens
// can set JWT_EXPIRES_IN lower and start calling POST /api/auth/refresh
// with the refreshToken returned alongside it.
async function issueRefreshToken(user) {
  const { rawToken, hashedToken } = generateRefreshToken();
  await RefreshToken.create({
    user: user._id,
    tokenHash: hashedToken,
    expiresAt: new Date(Date.now() + REFRESH_TTL_MS)
  });
  return rawToken;
}

async function issueAndSendOTP(user) {
  const otp = generateOTP();
  user.emailVerifyOTP = otp;
  user.emailVerifyExpires = new Date(Date.now() + OTP_TTL_MS);
  await user.save();
  await sendMail({ to: user.email, subject: 'Verify your SkillSwap email', html: otpEmailHtml(user.name, otp) });
}

// POST /api/auth/signup  (validated by signupSchema)
export async function signup(req, res, next) {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({ message: 'An account with that email already exists' });
    }

    const user = await User.create({ name: name.trim(), email, password });

    // Bootstrap mechanism for the very first admin account(s) — there's no
    // signup flow for "become an admin", so ADMIN_EMAILS (comma-separated,
    // set in .env) is checked once at account creation. Anyone made admin
    // after that is promoted by an existing admin, not through this list.
    const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map((e) => e.trim().toLowerCase()).filter(Boolean);
    if (adminEmails.includes(user.email.toLowerCase())) {
      user.isAdmin = true;
      await user.save();
    }

    await issueAndSendOTP(user);
    await notifyUser({
      user: user._id,
      type: 'system',
      text: 'Welcome to SkillSwap! Complete your profile to get better matches.'
    });

    const token = signToken(user);
    const refreshToken = await issueRefreshToken(user);
    res.status(201).json({ token, refreshToken, user });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/login  (validated by loginSchema)
export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    if (user.status === 'suspended') {
      return res.status(403).json({ message: 'This account has been suspended' });
    }

    if (!user.verified) {
      await issueAndSendOTP(user);
    }

    const token = signToken(user);
    const refreshToken = await issueRefreshToken(user);
    user.password = undefined;

    res.json({ token, refreshToken, user });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/refresh  { refreshToken }  (validated by refreshTokenSchema)
// Rotates the refresh token (old one is deleted, a new one issued) so a
// leaked-and-reused token can't silently keep working forever.
export async function refresh(req, res, next) {
  try {
    const { refreshToken } = req.body;
    const tokenHash = hashToken(refreshToken);

    const stored = await RefreshToken.findOne({ tokenHash });
    const invalid = { message: 'Refresh token is invalid or expired — please log in again' };

    if (!stored) return res.status(401).json(invalid);
    if (stored.expiresAt < new Date()) {
      await stored.deleteOne();
      return res.status(401).json(invalid);
    }

    const user = await User.findById(stored.user);
    if (!user) {
      await stored.deleteOne();
      return res.status(401).json(invalid);
    }
    if (user.status === 'suspended') {
      await stored.deleteOne();
      return res.status(403).json({ message: 'This account has been suspended' });
    }

    await stored.deleteOne();
    const token = signToken(user);
    const newRefreshToken = await issueRefreshToken(user);

    res.json({ token, refreshToken: newRefreshToken });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/logout  { refreshToken? }  (protected)
// Revokes one session (the device that sent refreshToken) if provided,
// otherwise every session for this account — "log out everywhere".
export async function logout(req, res, next) {
  try {
    const { refreshToken } = req.body;
    if (refreshToken) {
      await RefreshToken.deleteOne({ tokenHash: hashToken(refreshToken), user: req.user._id });
    } else {
      await RefreshToken.deleteMany({ user: req.user._id });
    }
    res.json({ message: 'Logged out' });
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

// POST /api/auth/forgot-password  { email }  (validated by forgotPasswordSchema)
export async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;

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

    // A password reset should end every existing session, not just the one
    // that requested it — in case the reset was prompted by a compromise.
    await RefreshToken.deleteMany({ user: user._id });

    res.json({ message: 'Password updated — you can now log in' });
  } catch (err) {
    next(err);
  }
}

// Shared by googleLogin/facebookLogin below: given a verified provider
// profile, find-or-create the User and hand back the same {token,
// refreshToken, user} shape the password login/signup routes return, so
// the frontend doesn't need a separate code path once it has a profile.
async function loginOrCreateFromProvider({ provider, providerIdField, profile, res }) {
  const email = profile.email.toLowerCase().trim();

  let user = await User.findOne({ $or: [{ [providerIdField]: profile.providerId }, { email }] }).select(`+${providerIdField}`);

  if (user) {
    // Existing account (possibly created via password signup, or via the
    // other provider) — link this provider to it rather than making a
    // second account for the same email.
    if (!user[providerIdField]) {
      user[providerIdField] = profile.providerId;
      if (!user.authProviders.includes(provider)) user.authProviders.push(provider);
    }
    if (profile.emailVerified) user.verified = true;
    if (profile.avatar && !user.avatar) user.avatar = profile.avatar;
    await user.save();
  } else {
    user = await User.create({
      name: profile.name,
      email,
      password: undefined,
      [providerIdField]: profile.providerId,
      authProviders: [provider],
      verified: profile.emailVerified,
      avatar: profile.avatar || ''
    });

    const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map((e) => e.trim().toLowerCase()).filter(Boolean);
    if (adminEmails.includes(user.email.toLowerCase())) {
      user.isAdmin = true;
      await user.save();
    }

    await notifyUser({
      user: user._id,
      type: 'system',
      text: 'Welcome to SkillSwap! Complete your profile to get better matches.'
    });
  }

  if (user.status === 'suspended') {
    return res.status(403).json({ message: 'This account has been suspended' });
  }

  const token = signToken(user);
  const refreshToken = await issueRefreshToken(user);
  user.password = undefined;
  res.json({ token, refreshToken, user });
}

// POST /api/auth/google  { credential }  — credential is the Google
// Identity Services ID token from the frontend's Sign in with Google button.
export async function googleLogin(req, res, next) {
  try {
    const { credential } = req.body;
    if (!credential) return res.status(400).json({ message: 'credential is required' });

    const profile = await verifyGoogleToken(credential);
    await loginOrCreateFromProvider({ provider: 'google', providerIdField: 'googleId', profile, res });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/facebook  { accessToken }  — accessToken is what the
// Facebook Login JS SDK hands the frontend after the user approves.
export async function facebookLogin(req, res, next) {
  try {
    const { accessToken } = req.body;
    if (!accessToken) return res.status(400).json({ message: 'accessToken is required' });

    const profile = await verifyFacebookToken(accessToken);
    await loginOrCreateFromProvider({ provider: 'facebook', providerIdField: 'facebookId', profile, res });
  } catch (err) {
    next(err);
  }
}
