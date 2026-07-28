import rateLimit from 'express-rate-limit';

// Generous general cap on every /api request — protects against runaway
// or abusive clients without affecting normal usage.
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests — please slow down and try again shortly.' }
});

// Tight cap specifically on auth endpoints (login, signup, forgot-password,
// resend-otp) — the ones a brute-force or credential-stuffing attempt would
// actually hit. Applied on top of apiLimiter, not instead of it.
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many attempts — please wait a few minutes and try again.' }
});
