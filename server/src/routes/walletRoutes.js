import { Router } from 'express';
import { getWallet, listTransactions, topUpWallet } from '../controllers/walletController.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { topUpSchema } from '../validation/schemas.js';

const router = Router();

router.get('/', requireAuth, getWallet);
router.get('/transactions', requireAuth, listTransactions);
router.post('/topup', requireAuth, validate(topUpSchema), topUpWallet);

export default router;
