import { describe, expect, it } from 'vitest';
import { testClient } from 'hono/testing';
import { app } from './app.js';

// Lesson 5 — Testing a Hono app.
//
// `hono/testing` gives us `testClient(app)`, which wraps the app with the
// SAME typed RPC client used by `hc<AppType>()` (see client.ts). That means
// tests get autocomplete and type-checking on routes/params/body for free,
// and we never spin up a real HTTP server/port — `app.request()` runs the
// fetch handler in-process.
const client = testClient(app);

// The rate-limit middleware buckets requests by IP (see middlewares/rate-limit.ts),
// and it's the SAME app instance across every test in this file. Passing a
// distinct x-forwarded-for per test group keeps their buckets independent —
// otherwise an earlier test's login attempts would count towards a later
// test's rate-limit assertions.
async function login(ip = '10.0.0.1') {
  const res = await client.auth.login.$post(
    { json: { username: 'mateus', password: 'senha' } },
    { headers: { 'x-forwarded-for': ip } }
  );
  const { token } = await res.json();
  return token;
}

describe('health', () => {
  it('responds ok on GET /health', async () => {
    const res = await client.health.$get();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.status).toBe('ok');
    expect(res.headers.get('X-Request-Id')).not.toBeNull();
  });
});

describe('tasks CRUD (authenticated)', () => {
  it('creates and lists a task scoped to the logged-in user', async () => {
    const token = await login();
    const headers = { Authorization: `Bearer ${token}` };

    const created = await client.tasks.$post(
      { json: { title: 'Write tests' } },
      { headers }
    );
    expect(created.status).toBe(201);
    const task = await created.json();
    expect(task.title).toBe('Write tests');

    const list = await client.tasks.$get({}, { headers });
    const tasks = await list.json();
    expect(tasks).toContainEqual(task);
  });

  it('returns 404 for a task id that does not exist', async () => {
    const token = await login();
    const headers = { Authorization: `Bearer ${token}` };

    const res = await client.tasks[':id'].$get(
      { param: { id: '999999' } },
      { headers }
    );
    expect(res.status).toBe(404);
  });
});

describe('uploads', () => {
  it('accepts an allowed mime type under the size limit', async () => {
    const form = new FormData();
    form.append('file', new File(['hello'], 'hello.txt', { type: 'text/plain' }));

    const res = await app.request('/uploads', { method: 'POST', body: form });
    expect(res.status).toBe(201);
    expect(await res.json()).toMatchObject({ name: 'hello.txt', type: 'text/plain', size: 5 });
  });

  it('rejects a disallowed mime type as 415', async () => {
    const form = new FormData();
    form.append('file', new File(['<html></html>'], 'page.html', { type: 'text/html' }));

    const res = await app.request('/uploads', { method: 'POST', body: form });
    expect(res.status).toBe(415);
  });
});

describe('auth edge cases', () => {
  it('rejects login with wrong credentials as 401', async () => {
    const res = await client.auth.login.$post(
      { json: { username: 'mateus', password: 'wrong' } },
      { headers: { 'x-forwarded-for': '10.0.0.2' } }
    );
    expect(res.status).toBe(401);
  });

  it('rejects /tasks without a token as 401', async () => {
    const res = await client.tasks.$get(
      {},
      { headers: { 'x-forwarded-for': '10.0.0.3' } }
    );
    expect(res.status).toBe(401);
  });

  it('rate-limits repeated failed logins (5 per 15min window)', async () => {
    // The login route has its OWN stricter rate limit than the general one
    // (see app.ts). This proves the two middlewares stack independently.
    const attempt = () =>
      client.auth.login.$post(
        { json: { username: 'mateus', password: 'wrong' } },
        { headers: { 'x-forwarded-for': '10.0.0.9' } }
      );

    for (let i = 0; i < 5; i++) await attempt();
    const blocked = await attempt();
    expect(blocked.status).toBe(429);
  });
});
