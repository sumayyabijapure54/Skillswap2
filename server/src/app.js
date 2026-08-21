import 'dotenv/config';
import path from 'path';
import express from 'express';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import morgan from 'morgan';
import { CLOUDINARY_ENABLED } from './lib/cloudinary.js';
import { apiLimiter } from './middleware/rateLimit.js';
import skillsRoutes from './routes/skillsRoutes.js';
import authRoutes from './routes/authRoutes.js';
import usersRoutes from './routes/usersRoutes.js';
import progressRoutes from './routes/progressRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import notificationsRoutes from './routes/notificationsRoutes.js';
import bookingsRoutes from './routes/bookingsRoutes.js';
import walletRoutes from './routes/walletRoutes.js';
import paymentsRoutes from './routes/paymentsRoutes.js';
import { handleWebhook } from './controllers/paymentsController.js';
import reviewsRoutes from './routes/reviewsRoutes.js';
import messagesRoutes from './routes/messagesRoutes.js';
import certificatesRoutes from './routes/certificatesRoutes.js';
import communityRoutes from './routes/communityRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import mentorApplicationsRoutes from './routes/mentorApplicationsRoutes.js';
import mentorsRoutes from './routes/mentorsRoutes.js';
import reportsRoutes from './routes/reportsRoutes.js';
import youtubeRoutes from './routes/youtubeRoutes.js';
import chatbotRoutes from './routes/chatbotRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import liveSessionsRoutes from './routes/liveSessionsRoutes.js';
import newsletterRoutes from './routes/newsletterRoutes.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

// Pulled out of server.js so tests (and anything else that just wants to
// exercise HTTP behavior) can import a ready-to-use Express app without
// triggering a real MongoDB connection or starting a listening socket —
// server.js is now the only place that does either of those.
export const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim());

const app = express();

// Render (and most hosts) sit behind a reverse proxy, so every request
// arrives with an X-Forwarded-For header. Without this, Express's default
// `trust proxy: false` makes express-rate-limit throw on every request
// (ERR_ERL_UNEXPECTED_X_FORWARDED_FOR) — which is exactly why auth and
// every other /api route can work on localhost but fail once deployed.
// "1" means "trust exactly one hop of proxy" (Render's own edge proxy).
app.set('trust proxy', 1);

// Default helmet sends Cross-Origin-Resource-Policy: same-origin, which
// blocks the browser from loading images/files (e.g. avatars) in an <img>
// tag when the frontend is on a different origin than this API (e.g.
// Vercel frontend + Render backend). "cross-origin" still keeps the other
// helmet protections, it just stops blocking cross-origin GETs of our own
// public static assets.
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}
app.use(cors({ origin: allowedOrigins }));
app.use(compression());

// Razorpay's webhook signature is computed over the exact raw request
// bytes — this must be registered BEFORE express.json() below, and with
// express.raw() instead of it, or req.body would already be a parsed object
// by the time handleWebhook tries to verify the signature against it.
app.post('/api/payments/razorpay/webhook', express.raw({ type: 'application/json' }), handleWebhook);

app.use(express.json());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

// Temporary diagnostic — confirms whether this deployed instance sees
// Cloudinary env vars, WITHOUT leaking their values. Safe to leave in,
// but fine to delete once avatar uploads are confirmed working.
app.get('/api/health/avatar-storage', (_req, res) => {
  res.json({
    cloudinaryEnabled: CLOUDINARY_ENABLED,
    hasCloudName: Boolean(process.env.CLOUDINARY_CLOUD_NAME),
    hasApiKey: Boolean(process.env.CLOUDINARY_API_KEY),
    hasApiSecret: Boolean(process.env.CLOUDINARY_API_SECRET)
  });
});
app.use('/api', apiLimiter);
app.use('/api/skills', skillsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/certificates', certificatesRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/mentor-applications', mentorApplicationsRoutes);
app.use('/api/mentors', mentorsRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/youtube', youtubeRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/live-sessions', liveSessionsRoutes);
app.use('/api/newsletter', newsletterRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
