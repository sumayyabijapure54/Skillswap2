import { Router } from 'express';
import { toggleWishlist } from '../controllers/wishlistController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/:skillId/toggle', requireAuth, toggleWishlist);

export default router;
