import { Elysia, t } from 'elysia';

// Elysia has FIRST-CLASS COOKIE support — `cookie` appears on the context
// just like `params` or `body`. Each cookie name is a reactive object:
//   cookie.foo.value         — read the current value
//   cookie.foo.value = 'bar' — set it (response gets Set-Cookie header)
//   cookie.foo.remove()      — delete it
//
// You can also declare a `cookie` SCHEMA on a route — Elysia will validate
// incoming cookies the same way it validates body/query, and tipify them.

// Minimal in-memory session store. Real-world: Redis with TTL.
interface Session {
  username: string;
  createdAt: number;
}
const sessions = new Map<string, Session>();

// Helper to create a random session id (cryptographically random)
const newSessionId = () => crypto.randomUUID();

export const sessionRoutes = new Elysia({ prefix: '/session' })
  // Declare the cookie shape ONCE for the whole sub-app via the `cookie` schema.
  // This lets us read `cookie.sid.value` as a typed string in every route below.
  .guard({
    cookie: t.Object({
      sid: t.Optional(t.String()),
    }),
  })

  // Log in — create a session and set the cookie
  .post(
    '/login',
    ({ body, cookie: { sid }, error }) => {
      if (!body.username) return error(400, { message: 'username required' });

      const id = newSessionId();
      sessions.set(id, { username: body.username, createdAt: Date.now() });

      // Setting `value` triggers a Set-Cookie response header.
      // Other properties on the cookie object configure the cookie itself:
      sid.value = id;
      sid.httpOnly = true;   // not accessible to JS — protects against XSS
      sid.sameSite = 'lax';  // CSRF protection
      sid.secure = false;    // would be `true` in production behind HTTPS
      sid.maxAge = 60 * 60;  // 1 hour in seconds

      return { ok: true, username: body.username };
    },
    {
      body: t.Object({ username: t.String({ minLength: 1 }) }),
    }
  )

  // Read the current session — derives username from the cookie
  .get('/me', ({ cookie: { sid }, error }) => {
    if (!sid.value) return error(401, { message: 'no session cookie' });

    const session = sessions.get(sid.value);
    if (!session) return error(401, { message: 'session expired or invalid' });

    return {
      username: session.username,
      ageMs: Date.now() - session.createdAt,
    };
  })

  // Log out — remove the cookie AND the server-side session record
  .post('/logout', ({ cookie: { sid } }) => {
    if (sid.value) {
      sessions.delete(sid.value);
      // .remove() expires the cookie immediately on the client
      sid.remove();
    }
    return { ok: true };
  });
