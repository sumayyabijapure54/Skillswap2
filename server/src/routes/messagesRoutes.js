import { Router } from 'express';
import { listConversations, getThread, sendMessage } from '../controllers/messagesController.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { sendMessageSchema } from '../validation/schemas.js';

const router = Router();

// Must be registered before /:userId so "conversations" isn't parsed as an id.
router.get('/conversations', requireAuth, listConversations);
router.get('/:userId', requireAuth, getThread);
router.post('/:userId', requireAuth, validate(sendMessageSchema), sendMessage);

export default router;
