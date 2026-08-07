import { describe, it, expect } from 'vitest';
import { generateOTP, generateResetToken, hashToken, generateRefreshToken, generateCertificateNumber } from '../src/utils/tokens.js';

describe('generateOTP', () => {
  it('always returns a 6-digit numeric string', () => {
    for (let i = 0; i < 50; i++) {
      const otp = generateOTP();
      expect(otp).toMatch(/^\d{6}$/);
    }
  });
});

describe('generateResetToken / hashToken', () => {
  it('returns a raw token and its hash, and the hash is reproducible from the raw token', () => {
    const { rawToken, hashedToken } = generateResetToken();
    expect(rawToken).toMatch(/^[0-9a-f]{64}$/);
    expect(hashedToken).toMatch(/^[0-9a-f]{64}$/);
    expect(hashToken(rawToken)).toBe(hashedToken);
  });

  it('never stores the raw token as the hash (a DB leak alone should not reveal it)', () => {
    const { rawToken, hashedToken } = generateResetToken();
    expect(hashedToken).not.toBe(rawToken);
  });

  it('generates different tokens on each call', () => {
    const a = generateResetToken();
    const b = generateResetToken();
    expect(a.rawToken).not.toBe(b.rawToken);
  });
});

describe('generateRefreshToken', () => {
  it('returns a raw/hashed pair, distinct from each other', () => {
    const { rawToken, hashedToken } = generateRefreshToken();
    expect(rawToken).not.toBe(hashedToken);
    expect(hashToken(rawToken)).toBe(hashedToken);
  });
});

describe('generateCertificateNumber', () => {
  it('matches the SS-YYYY-NNNNNN format', () => {
    expect(generateCertificateNumber()).toMatch(/^SS-\d{4}-\d{6}$/);
  });

  it('uses the given date\'s year', () => {
    expect(generateCertificateNumber(new Date('2031-06-01'))).toMatch(/^SS-2031-\d{6}$/);
  });

  it('generates different numbers on each call', () => {
    const seen = new Set(Array.from({ length: 100 }, () => generateCertificateNumber()));
    // Random 6-digit serials over 100 draws could theoretically collide,
    // but with a 1-in-1,000,000 space that's astronomically unlikely —
    // treat any duplicate as a real bug rather than adding retry noise here.
    expect(seen.size).toBe(100);
  });
});
