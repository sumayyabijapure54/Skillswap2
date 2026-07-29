import 'dotenv/config';
import http from 'http';
import path from 'path';
import express from 'express';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import morgan from 'morgan';
import jwt from 'jsonwebtoken';
import { Server } from 'socket.io';
import { connectDB } from './src/config/db.js';
import { apiLimiter } from './src/middleware/rateLimit.js';
import { setIO } from './src/realtime/io.js';
import User from './src/models/User.js';
import skillsRoutes from './src/routes/skillsRoutes.js';
import authRoutes from './src/routes/authRoutes.js';
import usersRoutes from './src/routes/usersRoutes.js';
import progressRoutes from './src/routes/progressRoutes.js';
import wishlistRoutes from './src/routes/wishlistRoutes.js';
import notificationsRoutes from './src/routes/notificationsRoutes.js';
import bookingsRoutes from './src/routes/bookingsRoutes.js';
import walletRoutes from './src/routes/walletRoutes.js';
import paymentsRoutes from './src/routes/paymentsRoutes.js';
import { handleWebhook } from './src/controllers/paymentsController.js';
import reviewsRoutes from './src/routes/reviewsRoutes.js';
import messagesRoutes from './src/routes/messagesRoutes.js';
import certificatesRoutes from './src/routes/certificatesRoutes.js';
import communityRoutes from './src/routes/communityRoutes.js';
import adminRoutes from './src/routes/adminRoutes.js';
import mentorApplicationsRoutes from './src/routes/mentorApplicationsRoutes.js';
import reportsRoutes from './src/routes/reportsRoutes.js';
import youtubeRoutes from './src/routes/youtubeRoutes.js';
import { notFound, errorHandler } from './src/middleware/errorHandler.js';

import dns from 'node:dns';

dns.setServers(['8.8.8.8', '1.1.1.1']);

const app = express();

const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim());

app.use(helmet());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
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
app.use('/api/reports', reportsRoutes);
app.use('/api/youtube', youtubeRoutes);

app.use(notFound);
app.use(errorHandler);

// Socket.io needs the raw http.Server (not just the Express app) to attach
// its own upgrade handling for WebSocket connections alongside normal HTTP.
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: { origin: allowedOrigins }
});

// Client connects with: io(URL, { auth: { token: '<the same JWT used for API calls>' } })
// A rejected/missing token refuses the connection outright — there's no
// "anonymous" socket the way there's no anonymous API request.
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Unauthorized'));

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.sub);
    if (!user) return next(new Error('Unauthorized'));

    socket.user = user;
    next();
  } catch {
    next(new Error('Unauthorized'));
  }
});

io.on('connection', (socket) => {
  // Every tab/device the user has open joins the same room, named after
  // their own id — notifyUser() and sendMessage() emit to this room instead
  // of tracking individual socket ids.
  socket.join(socket.user._id.toString());
});

setIO(io);

const PORT = process.env.PORT || 5002;

connectDB().then(() => {
  httpServer.listen(PORT, () => console.log(`SkillSwap API listening on http://localhost:${PORT}`));
});
