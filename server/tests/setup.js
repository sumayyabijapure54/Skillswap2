import dotenv from 'dotenv';

// Fixed, fake values — these tests never touch a real database, Razorpay
// account, or JWT that needs to match production. They only need to exist
// so modules that read process.env at import time (razorpayClient.js,
// requireAuth, etc.) don't throw during module evaluation.
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret-do-not-use-in-prod';
process.env.RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_test_fake_key_id';
process.env.RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'fake_razorpay_secret';
process.env.RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || 'fake_webhook_secret';
process.env.CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/skillswap-test';

dotenv.config({ path: '.env.test', override: false });
