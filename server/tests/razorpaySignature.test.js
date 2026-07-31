import { describe, it, expect } from 'vitest';
import crypto from 'crypto';
import {
  computeOrderPaymentSignature,
  verifyOrderPaymentSignature,
  verifyWebhookSignature
} from '../src/utils/razorpaySignature.js';

const SECRET = 'a-fake-key-secret';

describe('order/payment signature (checkout success callback)', () => {
  it('accepts a signature computed with the correct secret', () => {
    const sig = computeOrderPaymentSignature('order_123', 'pay_456', SECRET);
    expect(verifyOrderPaymentSignature('order_123', 'pay_456', sig, SECRET)).toBe(true);
  });

  it('rejects a signature computed with the wrong secret (forged by an attacker without the key)', () => {
    const forged = computeOrderPaymentSignature('order_123', 'pay_456', 'wrong-secret');
    expect(verifyOrderPaymentSignature('order_123', 'pay_456', forged, SECRET)).toBe(false);
  });

  it('rejects a valid signature replayed against a different order id', () => {
    const sig = computeOrderPaymentSignature('order_123', 'pay_456', SECRET);
    expect(verifyOrderPaymentSignature('order_999', 'pay_456', sig, SECRET)).toBe(false);
  });

  it('rejects a valid signature replayed against a different payment id', () => {
    const sig = computeOrderPaymentSignature('order_123', 'pay_456', SECRET);
    expect(verifyOrderPaymentSignature('order_123', 'pay_999', sig, SECRET)).toBe(false);
  });

  it('rejects when any required field is missing', () => {
    expect(verifyOrderPaymentSignature(null, 'pay_456', 'sig', SECRET)).toBe(false);
    expect(verifyOrderPaymentSignature('order_123', null, 'sig', SECRET)).toBe(false);
    expect(verifyOrderPaymentSignature('order_123', 'pay_456', null, SECRET)).toBe(false);
    expect(verifyOrderPaymentSignature('order_123', 'pay_456', 'sig', null)).toBe(false);
  });
});

describe('webhook signature (Razorpay-initiated server-to-server call)', () => {
  it('accepts a signature computed over the exact raw body bytes', () => {
    const raw = Buffer.from(JSON.stringify({ event: 'payment.captured' }));
    const sig = crypto.createHmac('sha256', SECRET).update(raw).digest('hex');
    expect(verifyWebhookSignature(raw, sig, SECRET)).toBe(true);
  });

  it('rejects if the body is re-serialized (different byte content) even with matching structure', () => {
    const raw = Buffer.from('{"event":"payment.captured"}');
    const reserialized = Buffer.from('{"event": "payment.captured"}'); // extra space
    const sig = crypto.createHmac('sha256', SECRET).update(raw).digest('hex');
    expect(verifyWebhookSignature(reserialized, sig, SECRET)).toBe(false);
  });

  it('rejects a tampered signature', () => {
    const raw = Buffer.from('{"event":"payment.captured"}');
    expect(verifyWebhookSignature(raw, 'not-a-real-signature', SECRET)).toBe(false);
  });
});
