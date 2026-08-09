import { Router } from 'express';
import { subscribe } from '../controllers/newsletterController.js';
import { validate } from '../middleware/validate.js';
import { newsletterSubscribeSchema } from '../validation/schemas.js';

const router = Router();

router.post('/subscribe', validate(newsletterSubscribeSchema), subscribe);

export default router;
