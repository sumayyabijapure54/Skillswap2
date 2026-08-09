// Startup environment validation.
//
// Scope is deliberately narrow:
//  - HARD FAIL (process.exit) only for variables the app is fundamentally
//    broken without, in every environment. Right now that's just
//    JWT_SECRET — every authenticated request signs/verifies a JWT with
//    it, so a missing value doesn't fail loudly once at boot, it fails
//    unpredictably on the first login/request instead.
//    (MONGODB_URI already gets the same hard-fail treatment in
//    src/config/db.js — not duplicated here.)
//  - WARN ONLY, and only in production, for variables that already have
//    working local-dev fallbacks elsewhere in the code (Resend, Cloudinary,
//    Razorpay, Google/Facebook login, YouTube, Ollama). Those modules
//    already degrade gracefully by design (e.g. email logs to the console
//    instead of sending), so failing the whole server over them would be
//    a behavior change this pass is not supposed to make. The warning just
//    makes it obvious in the Render logs *before* a user hits the feature
//    and gets a confusing runtime error.
//
// Never logs the value of any variable — presence/absence only.

const HARD_REQUIRED = ['JWT_SECRET'];

// Each entry: env var name -> which feature breaks without it.
const PRODUCTION_RECOMMENDED = {
  RESEND_API_KEY: 'transactional email (OTP verification, password reset) will log to the console instead of sending',
  CLOUDINARY_CLOUD_NAME: 'avatar uploads will fall back to local disk, which does not survive a redeploy on Render',
  CLOUDINARY_API_KEY: 'avatar uploads will fall back to local disk, which does not survive a redeploy on Render',
  CLOUDINARY_API_SECRET: 'avatar uploads will fall back to local disk, which does not survive a redeploy on Render',
  RAZORPAY_KEY_ID: 'payment routes will fail',
  RAZORPAY_KEY_SECRET: 'payment routes will fail',
  YOUTUBE_API_KEY: 'lesson video lookups will fail'
};

export function validateEnv() {
  const missing = HARD_REQUIRED.filter((key) => !process.env[key]);

  if (missing.length) {
    console.error(
      `\n❌ Missing required environment variable(s): ${missing.join(', ')}\n` +
      'The server cannot start without these — copy .env.example to .env (or set them ' +
      'in your Render environment) and try again.\n'
    );
    process.exit(1);
  }

  if (process.env.NODE_ENV === 'production') {
    const warnings = Object.entries(PRODUCTION_RECOMMENDED)
      .filter(([key]) => !process.env[key])
      .map(([key, impact]) => `  - ${key} is not set: ${impact}`);

    if (warnings.length) {
      console.warn(`\n⚠️  Production startup warnings (server will still start):\n${warnings.join('\n')}\n`);
    }
  }
}
