import { Router } from 'express';
import { getHistory, clearHistory, sendMessage, runQuickAction } from '../controllers/chatbotController.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { chatMessageSchema, chatQuickActionSchema } from '../validation/schemas.js';
import { aiChatLimiter } from '../middleware/rateLimit.js';

const router = Router();

router.use(requireAuth);

router.get('/history', getHistory);
router.delete('/history', clearHistory);
router.post('/message', aiChatLimiter, validate(chatMessageSchema), sendMessage);
router.post('/quick-action', aiChatLimiter, validate(chatQuickActionSchema), runQuickAction);

export default router;
