import { describe, expect, it } from 'vitest';
import { Hono } from 'hono';
import { rateLimit } from './rate-limit.js';

// Lesson 5 — Testing a middleware in isolation.
//
// We don't need the full `app` here: a middleware is just a function that
// takes `(c, next)`, so we mount it on a throwaway Hono instance and drive
// it with `app.request()`. This keeps the test fast and focused on the
// middleware's own behavior (bucketing per IP, resetting the window).
function buildApp() {
  return new Hono().use(rateLimit({ windowMs: 60_000, limit: 2 })).get('/ping', (c) =>
    c.json({ ok: true })
  );
}

describe('rateLimit middleware', () => {
  it('allows requests under the limit', async () => {
    const app = buildApp();
    const res = await app.request('/ping', { headers: { 'x-forwarded-for': '1.1.1.1' } });
    expect(res.status).toBe(200);
  });

  it('blocks the request that exceeds the limit and sets Retry-After', async () => {
    const app = buildApp();
    const headers = { 'x-forwarded-for': '2.2.2.2' };

    await app.request('/ping', { headers });
    await app.request('/ping', { headers });
    const blocked = await app.request('/ping', { headers });

    expect(blocked.status).toBe(429);
    expect(blocked.headers.get('Retry-After')).not.toBeNull();
  });

  it('tracks limits per IP independently', async () => {
    const app = buildApp();
    await app.request('/ping', { headers: { 'x-forwarded-for': '3.3.3.3' } });
    await app.request('/ping', { headers: { 'x-forwarded-for': '3.3.3.3' } });
    // A different IP still has its own untouched bucket.
    const res = await app.request('/ping', { headers: { 'x-forwarded-for': '4.4.4.4' } });
    expect(res.status).toBe(200);
  });
});
