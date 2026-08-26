import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import { secureHeaders } from 'hono/secure-headers';
import { HTTPException } from 'hono/http-exception';
import { sign } from 'hono/jwt';
import { setSignedCookie, getSignedCookie, deleteCookie } from 'hono/cookie';
import { zValidator } from '@hono/zod-validator';
import { rateLimit } from './middlewares/rate-limit.js';
import { requestId, type Env } from './middlewares/request-id.js';
import { tasksRoute } from './routes/tasks.js';
import { JWT_SECRET, COOKIE_SECRET } from './config.js';
import { z } from 'zod';

// Aula 4 — Autenticação JWT + rate limit
//
// Hono já tem middleware de JWT built-in em `hono/jwt`. Diferente do Express
// (que precisa de `jsonwebtoken` + middleware custom), aqui é:
//   1. Rota de login gera o token com `sign(payload, secret)`
//   2. O middleware `jwt()` (agora dentro de routes/tasks.ts) valida e
//      coloca o payload em `c.get('jwtPayload')`
//
// Rate limit não vem built-in — construí um simples in-memory. Em prod usaria
// `hono-rate-limiter` ou colocaria um Redis/upstash.

// Usuários fake (pra POC — em prod seria users repository do backend).
const users = new Map<string, { id: number; password: string }>([
  ['mateus', { id: 1, password: 'senha' }],
]);

// Lesson 6 — CORS.
//
// `cors()` handles the preflight `OPTIONS` request automatically and adds
// the `Access-Control-Allow-*` headers to every response. Restricting
// `origin` to an allowlist (instead of `*`) is what lets `credentials: true`
// (cookies/Authorization headers) work — browsers reject wildcard origin
// combined with credentials.
const ALLOWED_ORIGINS = ['http://localhost:5173', 'http://localhost:3000'];

export const app = new Hono<Env>()
  .use(requestId)
  .use(
    cors({
      origin: ALLOWED_ORIGINS,
      allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true,
    })
  )
  // Lesson 6 — secureHeaders() sets a batch of hardening headers in one call
  // (X-Frame-Options, X-Content-Type-Options, a default Content-Security-Policy,
  // Referrer-Policy, etc.). Express needs the separate `helmet` package for this;
  // Hono ships it as a built-in middleware.
  .use(secureHeaders())
  .use(logger())
  .use(rateLimit({ windowMs: 60_000, limit: 100 })) // rate limit geral

  .onError((err, c) => {
    // `c.get('requestId')` is typed as `string` here — no cast, thanks to
    // the `Env` generic on `new Hono<Env>()` above.
    if (err instanceof HTTPException) return c.json({ error: err.message }, err.status);
    console.error(`[${c.get('requestId')}]`, err);
    return c.json({ error: 'INTERNAL_SERVER_ERROR' }, 500);
  })

  .get('/', (c) => c.text('Hono no ar 🔥'))
  .get('/health', (c) => c.json({ status: 'ok', requestId: c.get('requestId') }))

  // ---------------------------------------------------------------
  // LOGIN — público, sem JWT, com rate limit AGRESSIVO
  // ---------------------------------------------------------------
  .post(
    '/auth/login',
    rateLimit({ windowMs: 15 * 60_000, limit: 5 }), // 5 tentativas em 15 min
    zValidator(
      'json',
      z.object({ username: z.string().min(1), password: z.string().min(1) })
    ),
    async (c) => {
      const { username, password } = c.req.valid('json');
      const user = users.get(username);
      if (!user || user.password !== password) {
        // Mesma mensagem genérica pra não vazar se o user existe
        throw new HTTPException(401, { message: 'Credenciais inválidas' });
      }
      // sign() usa HS256 por default; expira em 15 min via `exp` claim
      const token = await sign(
        { sub: user.id, username, exp: Math.floor(Date.now() / 1000) + 15 * 60 },
        JWT_SECRET
      );
      return c.json({ token });
    }
  )

  // ---------------------------------------------------------------
  // Lesson 7 — cookie-based session, as an alternative to the JWT bearer
  // token above. `setSignedCookie` appends an HMAC signature to the cookie
  // value; `getSignedCookie` verifies it and returns `false` if the value
  // was tampered with client-side. Plain `setCookie` would let a client
  // hand-edit `session_user_id` to impersonate another user — signing closes
  // that hole without needing a server-side session store.
  // `httpOnly` keeps the cookie out of reach from JS (mitigates XSS reading
  // it), `sameSite: 'Lax'` is the built-in CSRF mitigation for top-level
  // navigations.
  // ---------------------------------------------------------------
  .post(
    '/auth/session-login',
    zValidator(
      'json',
      z.object({ username: z.string().min(1), password: z.string().min(1) })
    ),
    async (c) => {
      const { username, password } = c.req.valid('json');
      const user = users.get(username);
      if (!user || user.password !== password) {
        throw new HTTPException(401, { message: 'Credenciais inválidas' });
      }
      await setSignedCookie(c, 'session_user_id', String(user.id), COOKIE_SECRET, {
        httpOnly: true,
        sameSite: 'Lax',
        maxAge: 60 * 60, // 1h
      });
      return c.json({ ok: true });
    }
  )

  .get('/session/me', async (c) => {
    const userId = await getSignedCookie(c, COOKIE_SECRET, 'session_user_id');
    if (!userId) throw new HTTPException(401, { message: 'Sem sessão ativa ou cookie inválido' });
    return c.json({ userId: Number(userId) });
  })

  .post('/auth/session-logout', (c) => {
    deleteCookie(c, 'session_user_id');
    return c.json({ ok: true });
  })

  // ---------------------------------------------------------------
  // Lesson 8 — mounting a sub-app. Everything task-related (including its
  // own JWT middleware) now lives in routes/tasks.ts; `app.route()` grafts
  // its type chain onto `AppType`, so the RPC client keeps full type-safety
  // for `/tasks/*` even though those handlers are defined elsewhere.
  // ---------------------------------------------------------------
  .route('/tasks', tasksRoute);

export type AppType = typeof app;
