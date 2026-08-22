import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import { secureHeaders } from 'hono/secure-headers';
import { HTTPException } from 'hono/http-exception';
import { jwt, sign } from 'hono/jwt';
import { zValidator } from '@hono/zod-validator';
import { createTaskSchema, updateTaskSchema, taskIdParamSchema } from './schemas.js';
import { rateLimit } from './middlewares/rate-limit.js';
import { z } from 'zod';

// Aula 4 — Autenticação JWT + rate limit
//
// Hono já tem middleware de JWT built-in em `hono/jwt`. Diferente do Express
// (que precisa de `jsonwebtoken` + middleware custom), aqui é:
//   1. Rota de login gera o token com `sign(payload, secret)`
//   2. `.use('/tasks/*', jwt({ secret }))` protege tudo abaixo — o middleware
//      valida e coloca o payload em `c.get('jwtPayload')`
//
// Rate limit não vem built-in — construí um simples in-memory. Em prod usaria
// `hono-rate-limiter` ou colocaria um Redis/upstash.

const JWT_SECRET = process.env.JWT_SECRET ?? 'dev-only-secret';

interface Task {
  id: number;
  title: string;
  done: boolean;
  userId: number;
}
const tasks: Task[] = [];
let nextId = 1;

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

export const app = new Hono()
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
    if (err instanceof HTTPException) return c.json({ error: err.message }, err.status);
    console.error(err);
    return c.json({ error: 'INTERNAL_SERVER_ERROR' }, 500);
  })

  .get('/', (c) => c.text('Hono no ar 🔥'))
  .get('/health', (c) => c.json({ status: 'ok' }))

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
  // JWT middleware — protege TUDO abaixo (mesmo pattern do .use do Express)
  // ---------------------------------------------------------------
  // `alg` became required in newer hono/jwt releases (was optional/defaulted
  // to HS256 when this POC started) — pin it explicitly so a dependency
  // bump doesn't silently change the signing algorithm.
  .use('/tasks/*', jwt({ secret: JWT_SECRET, alg: 'HS256' }))

  .get('/tasks', (c) => {
    // Payload validado disponível via c.get('jwtPayload')
    const payload = c.get('jwtPayload') as { sub: number };
    return c.json(tasks.filter((t) => t.userId === payload.sub));
  })

  .get('/tasks/:id', zValidator('param', taskIdParamSchema), (c) => {
    const { id } = c.req.valid('param');
    const payload = c.get('jwtPayload') as { sub: number };
    const task = tasks.find((t) => t.id === id && t.userId === payload.sub);
    if (!task) throw new HTTPException(404, { message: 'Task não encontrada' });
    return c.json(task);
  })

  .post('/tasks', zValidator('json', createTaskSchema), (c) => {
    const input = c.req.valid('json');
    const payload = c.get('jwtPayload') as { sub: number };
    const task: Task = { id: nextId++, title: input.title, done: false, userId: payload.sub };
    tasks.push(task);
    return c.json(task, 201);
  })

  .put(
    '/tasks/:id',
    zValidator('param', taskIdParamSchema),
    zValidator('json', updateTaskSchema),
    (c) => {
      const { id } = c.req.valid('param');
      const input = c.req.valid('json');
      const payload = c.get('jwtPayload') as { sub: number };
      const task = tasks.find((t) => t.id === id && t.userId === payload.sub);
      if (!task) throw new HTTPException(404, { message: 'Task não encontrada' });
      if (input.title !== undefined) task.title = input.title;
      if (input.done !== undefined) task.done = input.done;
      return c.json(task);
    }
  )

  .delete('/tasks/:id', zValidator('param', taskIdParamSchema), (c) => {
    const { id } = c.req.valid('param');
    const payload = c.get('jwtPayload') as { sub: number };
    const idx = tasks.findIndex((t) => t.id === id && t.userId === payload.sub);
    if (idx === -1) throw new HTTPException(404, { message: 'Task não encontrada' });
    return c.json(tasks.splice(idx, 1)[0]);
  });

export type AppType = typeof app;
