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
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many attempts — please wait a few minutes and try again.' }
});

// Each message/quick-action is a paid Anthropic API call — capped tighter
// than general API traffic so one chatty tab (or a scripted abuse attempt)
// can't run up the bill or starve other users of quota.
export const aiChatLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'You\'re sending messages to the AI Mentor a bit fast — please wait a minute and try again.' }
});