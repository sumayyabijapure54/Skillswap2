import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './src/config/db.js';
import skillsRoutes from './src/routes/skillsRoutes.js';
import authRoutes from './src/routes/authRoutes.js';
import usersRoutes from './src/routes/usersRoutes.js';
import progressRoutes from './src/routes/progressRoutes.js';
import wishlistRoutes from './src/routes/wishlistRoutes.js';
import notificationsRoutes from './src/routes/notificationsRoutes.js';
import bookingsRoutes from './src/routes/bookingsRoutes.js';
import reviewsRoutes from './src/routes/reviewsRoutes.js';
import messagesRoutes from './src/routes/messagesRoutes.js';
import certificatesRoutes from './src/routes/certificatesRoutes.js';
import communityRoutes from './src/routes/communityRoutes.js';
import { notFound, errorHandler } from './src/middleware/errorHandler.js';

import dns from 'node:dns';

dns.setServers(['8.8.8.8', '1.1.1.1']);



const app = express();

const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim());

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/skills', skillsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/certificates', certificatesRoutes);
app.use('/api/community', communityRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5002;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`SkillSwap API listening on http://localhost:${PORT}`));
});
