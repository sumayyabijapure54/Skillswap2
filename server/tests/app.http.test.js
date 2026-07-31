import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

// These hit the REAL Express app (real middleware chain: helmet, cors,
// rate limiters, the validate() middleware, route matching) over real HTTP
// via supertest — the only thing they deliberately avoid is anything that
// would require a live MongoDB connection, since none is available in this
// environment. Every request below is expected to be rejected by validation
// (or auth) before the controller would ever touch the database.

describe('GET /api/health', () => {
  it('responds ok with no auth/DB required', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});

describe('POST /api/auth/signup — validation layer', () => {
  it('rejects a body missing all fields', async () => {
    const res = await request(app).post('/api/auth/signup').send({});
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Validation failed');
    expect(Array.isArray(res.body.errors)).toBe(true);
  });

  it('rejects a short password before ever reaching the database', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({ name: 'Ada', email: 'ada@example.com', password: 'short' });
    expect(res.status).toBe(400);
    expect(res.body.errors.some((e) => e.field === 'password')).toBe(true);
  });

  it('rejects an invalid email', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({ name: 'Ada', email: 'not-an-email', password: 'supersecret' });
    expect(res.status).toBe(400);
    expect(res.body.errors.some((e) => e.field === 'email')).toBe(true);
  });
});

describe('POST /api/auth/login — validation layer', () => {
  it('rejects a missing password', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'ada@example.com' });
    expect(res.status).toBe(400);
  });
});

describe('protected routes without a token', () => {
  it('rejects GET /api/auth/me with no Authorization header', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  it('rejects a malformed Authorization header', async () => {
    const res = await request(app).get('/api/auth/me').set('Authorization', 'NotBearer sometoken');
    expect(res.status).toBe(401);
  });

  it('rejects a syntactically invalid JWT before any DB lookup', async () => {
    const res = await request(app).get('/api/auth/me').set('Authorization', 'Bearer not.a.valid.jwt');
    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/invalid token/i);
  });

  it('rejects creating a booking with no token', async () => {
    const res = await request(app).post('/api/bookings').send({ skillId: 'react-fundamentals' });
    expect(res.status).toBe(401);
  });

  it('rejects starting a payment with no token', async () => {
    const res = await request(app).post('/api/payments/razorpay/create-order').send({ amount: 100 });
    expect(res.status).toBe(401);
  });
});

describe('POST /api/skills — auth required before validation runs', () => {
  it('rejects an unauthenticated attempt to create a skill', async () => {
    const res = await request(app).post('/api/skills').send({ title: 'Free Hack' });
    expect(res.status).toBe(401);
  });
});

describe('unknown routes', () => {
  it('returns a 404 with a helpful message', async () => {
    const res = await request(app).get('/api/this-route-does-not-exist');
    expect(res.status).toBe(404);
    expect(res.body.message).toMatch(/Route not found/);
  });
});
