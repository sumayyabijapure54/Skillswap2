import { Router } from 'express';
import { listUsers, suspendUser, reinstateUser, makeAdmin, revokeAdmin } from '../controllers/adminController.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth, requireAdmin);

router.get('/users', listUsers);
router.patch('/users/:id/suspend', suspendUser);
router.patch('/users/:id/reinstate', reinstateUser);
router.patch('/users/:id/make-admin', makeAdmin);
router.patch('/users/:id/revoke-admin', revokeAdmin);

export default router;
