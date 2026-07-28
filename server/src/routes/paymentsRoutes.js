import { Router } from 'express';
import { createOrder, verifyPayment } from '../controllers/paymentsController.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createRazorpayOrderSchema, verifyRazorpayPaymentSchema } from '../validation/schemas.js';

const router = Router();

// Note: POST /razorpay/webhook is NOT here — it's registered directly in
// server.js, ahead of express.json(), because it needs the raw request body
// (see paymentsController.js's handleWebhook for why) and isn't
// authenticated with a JWT the way everything else in this router is.

router.post('/razorpay/create-order', requireAuth, validate(createRazorpayOrderSchema), createOrder);
router.post('/razorpay/verify', requireAuth, validate(verifyRazorpayPaymentSchema), verifyPayment);

export default router;
