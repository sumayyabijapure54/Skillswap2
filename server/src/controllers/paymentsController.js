import crypto from 'crypto';
import mongoose from 'mongoose';
import razorpay from '../lib/razorpayClient.js';
import User from '../models/User.js';
import Transaction from '../models/Transaction.js';

const MAX_TOPUP = 50000; // ₹50,000 — matches the drop-in kit's limit

// Credits a user's wallet for a captured Razorpay payment and logs it as a
// Transaction, atomically, using `providerPaymentId` as an idempotency key.
// Both the client-side /verify call and the server-side webhook can end up
// trying to credit the same payment (e.g. the browser tab closes right
// after Razorpay's callback fires but before the network request lands, and
// the webhook picks it up instead) — this makes calling it twice for the
// same payment a no-op the second time, instead of a double-credit.
async function creditWalletForPayment({ userId, amount, providerOrderId, providerPaymentId }) {
  const session = await mongoose.startSession();
  try {
    let transaction;
    let balance;

    await session.withTransaction(async () => {
      const existing = await Transaction.findOne({ providerPaymentId }).session(session);
      const user = await User.findById(userId).session(session);
      if (!user) {
        throw Object.assign(new Error('User not found'), { status: 404 });
      }

      if (existing) {
        // Already credited by a previous call (verify or webhook) — just
        // report the current state, don't touch the balance again.
        transaction = existing;
        balance = user.wallet.balance;
        return;
      }

      user.wallet.balance = +(user.wallet.balance + amount).toFixed(2);
      await user.save({ session });
      balance = user.wallet.balance;

      const [created] = await Transaction.create(
        [
          {
            user: userId,
            type: 'topup',
            amount,
            method: 'razorpay',
            description: 'Wallet top-up via Razorpay',
            providerOrderId,
            providerPaymentId
          }
        ],
        { session }
      );
      transaction = created;
    });

    return { transaction, balance };
  } finally {
    session.endSession();
  }
}

// POST /api/payments/razorpay/create-order  { amount }  (protected)
// `amount` is in rupees; Razorpay's API wants paise. The order is created
// server-side so the charged amount is never trusted from the client at
// verification time — only what this call decided is honored.
export async function createOrder(req, res, next) {
  try {
    const { amount } = req.body;

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ message: 'Enter a valid amount.' });
    }
    if (amount > MAX_TOPUP) {
      return res.status(400).json({ message: `Top-ups over ₹${MAX_TOPUP.toLocaleString('en-IN')} aren't supported yet.` });
    }

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt: `wallet_topup_${Date.now()}`,
      notes: { userId: req.user._id.toString(), purpose: 'wallet_topup' }
    });

    // keyId is the PUBLIC key — safe to send to the frontend, it's what
    // Razorpay's checkout.js needs client-side. The secret never leaves here.
    res.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID
    });
  } catch (err) {
    console.error('Razorpay order creation failed:', err);
    res.status(500).json({ message: 'Could not start payment. Please try again.' });
  }
}

// POST /api/payments/razorpay/verify
// { razorpay_order_id, razorpay_payment_id, razorpay_signature }  (protected)
// Called by the frontend right after Razorpay's checkout modal succeeds.
export async function verifyPayment(req, res, next) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: 'Missing payment details.' });
    }

    // Recompute the signature ourselves — this is what stops someone from
    // just calling this endpoint directly and claiming they paid without
    // actually paying.
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: 'Payment verification failed.' });
    }

    // Signature checks out → this payment genuinely happened. Pull the real
    // amount from Razorpay rather than trusting anything the client sent.
    const payment = await razorpay.payments.fetch(razorpay_payment_id);
    const amount = payment.amount / 100;

    const { transaction, balance } = await creditWalletForPayment({
      userId: req.user._id,
      amount,
      providerOrderId: razorpay_order_id,
      providerPaymentId: razorpay_payment_id
    });

    res.json({ ok: true, wallet: { balance }, transaction });
  } catch (err) {
    console.error('Razorpay verification failed:', err);
    res.status(500).json({ message: 'Could not verify payment.' });
  }
}

// POST /api/payments/razorpay/webhook  (public — Razorpay calls this
// directly over the internet, so there's no JWT; the signature IS the auth)
//
// Registered in server.js with express.raw() ahead of the app's global
// express.json(), so req.body here is still the exact raw Buffer Razorpay
// computed its signature over — re-serializing parsed JSON can produce
// different bytes (key order, spacing) and silently break verification.
export async function handleWebhook(req, res) {
  try {
    const signature = req.headers['x-razorpay-signature'];
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!secret) {
      console.error('[razorpay webhook] RAZORPAY_WEBHOOK_SECRET is not set — rejecting webhook.');
      return res.status(500).end();
    }

    const expected = crypto.createHmac('sha256', secret).update(req.body).digest('hex');
    if (expected !== signature) {
      return res.status(400).json({ message: 'Invalid webhook signature' });
    }

    const event = JSON.parse(req.body.toString('utf8'));

    if (event.event === 'payment.captured') {
      const payment = event.payload.payment.entity;
      const userId = payment.notes?.userId;
      const amount = payment.amount / 100;

      if (userId) {
        await creditWalletForPayment({
          userId,
          amount,
          providerOrderId: payment.order_id,
          providerPaymentId: payment.id
        });
      } else {
        console.warn('[razorpay webhook] payment.captured with no notes.userId — cannot credit a wallet:', payment.id);
      }
    }

    // Razorpay just wants a 200 to stop retrying — it doesn't parse the body.
    res.status(200).json({ received: true });
  } catch (err) {
    console.error('Razorpay webhook handling failed:', err);
    res.status(500).end();
  }
}
