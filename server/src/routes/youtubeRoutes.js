import { Router } from 'express';
import { getYoutubeCourse, getYoutubeVideoById } from '../controllers/youtubeController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/course', getYoutubeCourse);
router.get('/video', requireAuth, getYoutubeVideoById);

export default router;
