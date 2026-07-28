// npm install razorpay (added to package.json)
import Razorpay from 'razorpay';

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.warn('[razorpay] RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET are not set — payment routes will fail.');
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

export default razorpay;
