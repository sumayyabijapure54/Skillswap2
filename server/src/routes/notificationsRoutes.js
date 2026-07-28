import { Router } from 'express';
import { listNotifications, markRead, markAllRead } from '../controllers/notificationsController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAuth, listNotifications);
// Must be registered before /:id/read so "read-all" isn't parsed as an id.
router.patch('/read-all', requireAuth, markAllRead);
router.patch('/:id/read', requireAuth, markRead);

export default router;
