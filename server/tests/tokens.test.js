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
  it('matches the SS-XXXXXXXX format', () => {
    expect(generateCertificateNumber()).toMatch(/^SS-[0-9A-F]{8}$/);
  });

  it('generates different numbers on each call', () => {
    const seen = new Set(Array.from({ length: 100 }, () => generateCertificateNumber()));
    expect(seen.size).toBe(100);
  });
});
