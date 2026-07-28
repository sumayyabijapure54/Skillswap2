import { Router } from 'express';
import { getYoutubeCourse } from '../controllers/youtubeController.js';

const router = Router();

router.get('/course', getYoutubeCourse);

export default router;
