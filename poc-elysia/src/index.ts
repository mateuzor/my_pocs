import { Elysia, t } from 'elysia';
import { tasksRoutes } from './tasks';

// Elysia is a TypeScript-first web framework built on top of Bun.
// Its main selling point is METHOD CHAINING with automatic TYPE INFERENCE:
// you write a route once and Elysia infers the parameter types automatically —
// no manual `req.params as { id: string }` casts or separate type files.

const app = new Elysia()
  .get('/', () => 'Hello from Elysia')

  // Path params are typed automatically — `params.id` is inferred as string
  .get('/echo/:id', ({ params }) => ({ id: params.id }))

  // Query string is also typed — `query.q` is string | undefined
  .get('/search', ({ query }) => ({ results: [], query: query.q ?? '' }))

  // .use mounts another Elysia instance — type information is preserved.
  // The tasks routes are defined in src/tasks.ts and use TypeBox schemas
  // for body/params/query validation.
  .use(tasksRoutes)

  // Global error handler — runs whenever a route throws or fails validation
  // VALIDATION errors come through here with code === 'VALIDATION'
  .onError(({ code, error, set }) => {
    if (code === 'VALIDATION') {
      set.status = 422;
      return { error: 'Validation failed', details: error.message };
    }
    if (code === 'NOT_FOUND') {
      set.status = 404;
      return { error: 'Route not found' };
    }
    set.status = 500;
    return { error: 'Internal server error' };
  })

  .listen(3000);

console.log(`🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`);

// Suppress unused-import warning — `t` is re-exported for convenience in tests
export type App = typeof app;
void t;
