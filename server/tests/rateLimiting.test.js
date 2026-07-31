import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

// authLimiter caps auth endpoints at 10 requests per 15-minute window, on
// top of (tighter than) the general 300/15min apiLimiter — this confirms
// that cap is actually wired up and firing, not just configured and unused.
// Runs in its own file so vitest's per-file module isolation gives the
// limiter's in-memory counter a clean slate, uncontaminated by other test
// files' requests to the same routes.
describe('authLimiter on POST /api/auth/login', () => {
  it('allows the first 10 rapid attempts through to validation, then blocks the 11th with 429', async () => {
    const attempts = [];
    for (let i = 0; i < 11; i++) {
      // Deliberately invalid body (no password) — we only care whether the
      // rate limiter (which runs before validate()) lets the request
      // through to the validation layer or blocks it outright. A 400 means
      // "got past the limiter, failed validation"; a 429 means "the limiter
      // stopped it before that".
      // eslint-disable-next-line no-await-in-loop
      const res = await request(app).post('/api/auth/login').send({ email: 'nobody@example.com' });
      attempts.push(res.status);
    }

    const first10 = attempts.slice(0, 10);
    const eleventh = attempts[10];

    expect(first10.every((status) => status === 400)).toBe(true);
    expect(eleventh).toBe(429);
  });

  it('the 429 response includes a clear message', async () => {
    // This file's limiter state is already exhausted by the test above
    // (same in-memory counter, same test file) — one more request should
    // still be blocked.
    const res = await request(app).post('/api/auth/login').send({ email: 'nobody@example.com' });
    expect(res.status).toBe(429);
    expect(res.body.message).toMatch(/too many attempts/i);
  });
});
