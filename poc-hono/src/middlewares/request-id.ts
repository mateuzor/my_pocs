import type { MiddlewareHandler } from 'hono';

// Lesson 8 — typed context variables.
//
// `c.set(key, value)` / `c.get(key)` share request-scoped data between
// middlewares and handlers (Hono's answer to Express's `req.foo = bar`).
// Declaring `Env` and passing it as `Hono<Env>()`'s generic is what makes
// `c.get('requestId')` come back as `string` instead of `unknown` at every
// call site — no casting needed, unlike the `c.get('jwtPayload') as {...}`
// casts still sprinkled in routes/tasks.ts.
export type Env = {
  Variables: {
    requestId: string;
  };
};

export const requestId: MiddlewareHandler<Env> = async (c, next) => {
  const id = crypto.randomUUID();
  c.set('requestId', id);
  c.header('X-Request-Id', id);
  await next();
};
