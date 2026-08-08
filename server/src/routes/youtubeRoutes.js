import { Router } from 'express';
import { getYoutubeVideo } from '../controllers/youtubeController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// Mentor-only lookup used while building a lesson — resolves a pasted
// YouTube URL to that exact video's metadata. No search endpoint exists.
router.get('/video', requireAuth, getYoutubeVideo);

export default router;
