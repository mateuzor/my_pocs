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

async function login() {
  const res = await client.auth.login.$post({
    json: { username: 'mateus', password: 'senha' },
  });
  const { token } = await res.json();
  return token;
}

describe('health', () => {
  it('responds ok on GET /health', async () => {
    const res = await client.health.$get();
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ status: 'ok' });
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
