import crypto from 'crypto';

// Recomputes the signature Razorpay expects for a client-side checkout
// success callback: HMAC-SHA256 of "orderId|paymentId" using the account's
// key secret. This is what stops someone from calling POST /verify directly
// and claiming a payment happened without actually paying — matches only if
// the payment genuinely completed through Razorpay's checkout.
export function computeOrderPaymentSignature(orderId, paymentId, secret) {
  return crypto
    .createHmac('sha256', secret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');
}

export function verifyOrderPaymentSignature(orderId, paymentId, signature, secret) {
  if (!orderId || !paymentId || !signature || !secret) return false;
  return computeOrderPaymentSignature(orderId, paymentId, secret) === signature;
}

// Webhook signatures are computed over the exact raw request body bytes
// (a Buffer), not a reconstructed string — re-serializing parsed JSON can
// produce different bytes (key order, spacing) and silently break this.
export function verifyWebhookSignature(rawBodyBuffer, signature, secret) {
  if (!rawBodyBuffer || !signature || !secret) return false;
  const expected = crypto.createHmac('sha256', secret).update(rawBodyBuffer).digest('hex');
  return expected === signature;
}
