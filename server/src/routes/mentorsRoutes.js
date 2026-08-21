import { Router } from 'express';
import { getPublicTopMentors } from '../controllers/topMentorsController.js';
import { cacheControl } from '../middleware/cacheControl.js';

const router = Router();

// Public — no auth required. Short cache, same reasoning as GET /api/skills:
// admin-edited data that should still reflect changes quickly.
router.get('/top', cacheControl(60), getPublicTopMentors);

export default router;
