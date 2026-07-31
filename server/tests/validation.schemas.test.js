import { describe, it, expect } from 'vitest';
import {
  signupSchema,
  loginSchema,
  updateProfileSchema,
  completeOnboardingSchema,
  createBookingSchema,
  checkoutBookingSchema,
  createRazorpayOrderSchema,
  verifyRazorpayPaymentSchema
} from '../src/validation/schemas.js';

describe('signupSchema', () => {
  it('accepts a valid signup body', () => {
    const result = signupSchema.safeParse({ name: 'Ada Lovelace', email: 'Ada@Example.com', password: 'supersecret' });
    expect(result.success).toBe(true);
    expect(result.data.email).toBe('ada@example.com'); // lowercased
  });

  it('rejects a short password', () => {
    const result = signupSchema.safeParse({ name: 'Ada', email: 'ada@example.com', password: 'short' });
    expect(result.success).toBe(false);
  });

  it('rejects an invalid email', () => {
    const result = signupSchema.safeParse({ name: 'Ada', email: 'not-an-email', password: 'supersecret' });
    expect(result.success).toBe(false);
  });
});

describe('loginSchema', () => {
  it('rejects a missing password', () => {
    const result = loginSchema.safeParse({ email: 'ada@example.com' });
    expect(result.success).toBe(false);
  });
});

describe('updateProfileSchema', () => {
  it('accepts an empty body (nothing to update)', () => {
    expect(updateProfileSchema.safeParse({}).success).toBe(true);
  });

  it('accepts a valid partial update', () => {
    const result = updateProfileSchema.safeParse({ name: 'New Name', bio: 'Hello there' });
    expect(result.success).toBe(true);
  });

  it('rejects a bio over 500 characters', () => {
    const result = updateProfileSchema.safeParse({ bio: 'x'.repeat(501) });
    expect(result.success).toBe(false);
  });

  it('rejects an avatar that is not a URL, /uploads/ path, or empty string', () => {
    const result = updateProfileSchema.safeParse({ avatar: 'javascript:alert(1)' });
    expect(result.success).toBe(false);
  });

  it('accepts an http(s) avatar URL', () => {
    expect(updateProfileSchema.safeParse({ avatar: 'https://example.com/me.png' }).success).toBe(true);
  });

  it('accepts an /uploads/ avatar path', () => {
    expect(updateProfileSchema.safeParse({ avatar: '/uploads/avatars/abc.jpg' }).success).toBe(true);
  });

  it('accepts an empty avatar string (clearing it)', () => {
    expect(updateProfileSchema.safeParse({ avatar: '' }).success).toBe(true);
  });

  it('rejects more than 20 skillsOffered entries', () => {
    const result = updateProfileSchema.safeParse({ skillsOffered: Array.from({ length: 21 }, (_, i) => `skill-${i}`) });
    expect(result.success).toBe(false);
  });

  it('rejects unknown/extra fields silently by stripping them, not by erroring', () => {
    // zod objects strip unknown keys by default rather than rejecting —
    // confirms the schema won't break on harmless extra client fields.
    const result = updateProfileSchema.safeParse({ name: 'X', notAField: 'nope' });
    expect(result.success).toBe(true);
    expect(result.data.notAField).toBeUndefined();
  });
});

describe('completeOnboardingSchema', () => {
  it('rejects a missing role', () => {
    expect(completeOnboardingSchema.safeParse({}).success).toBe(false);
  });

  it('rejects an invalid role', () => {
    expect(completeOnboardingSchema.safeParse({ role: 'wizard' }).success).toBe(false);
  });

  it('accepts a valid role with no interests/goal', () => {
    const result = completeOnboardingSchema.safeParse({ role: 'learn' });
    expect(result.success).toBe(true);
  });

  it('rejects an invalid goal', () => {
    expect(completeOnboardingSchema.safeParse({ role: 'both', goal: 'extreme' }).success).toBe(false);
  });

  it('rejects more than 20 interests', () => {
    const result = completeOnboardingSchema.safeParse({
      role: 'teach',
      interests: Array.from({ length: 21 }, (_, i) => `topic-${i}`)
    });
    expect(result.success).toBe(false);
  });
});

describe('createBookingSchema', () => {
  it('rejects a scheduledAt in the past', () => {
    const result = createBookingSchema.safeParse({ skillId: 'react-fundamentals', scheduledAt: '2020-01-01T00:00:00Z' });
    expect(result.success).toBe(false);
  });

  it('accepts a valid future booking', () => {
    const future = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    const result = createBookingSchema.safeParse({ skillId: 'react-fundamentals', scheduledAt: future });
    expect(result.success).toBe(true);
  });
});

describe('checkoutBookingSchema', () => {
  it('rejects an invalid payment method', () => {
    const future = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    const result = checkoutBookingSchema.safeParse({
      skillId: 'react-fundamentals',
      scheduledAt: future,
      sessionType: 'Live 1:1',
      price: 20,
      method: 'crypto'
    });
    expect(result.success).toBe(false);
  });

  it('rejects a negative price', () => {
    const future = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    const result = checkoutBookingSchema.safeParse({
      skillId: 'react-fundamentals',
      scheduledAt: future,
      sessionType: 'Live 1:1',
      price: -5,
      method: 'wallet'
    });
    expect(result.success).toBe(false);
  });
});

describe('createRazorpayOrderSchema / verifyRazorpayPaymentSchema', () => {
  it('rejects a missing amount', () => {
    expect(createRazorpayOrderSchema.safeParse({}).success).toBe(false);
  });

  it('rejects missing verification fields', () => {
    expect(verifyRazorpayPaymentSchema.safeParse({ razorpay_order_id: 'order_1' }).success).toBe(false);
  });
});
