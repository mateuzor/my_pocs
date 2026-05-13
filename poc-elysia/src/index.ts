import { Elysia, t } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import { tasksRoutes } from './tasks';
import { Logger, parseAuthHeader } from './services';
import { hooksDemo } from './hooks-demo';

// CONTEXT SYSTEM: how Elysia injects dependencies into route handlers.
//
// Three primitives, each with a distinct lifecycle:
//
//   .decorate(name, value)  — STATIC INJECTION (singletons)
//     Created once when the app starts. Use for services like loggers,
//     database clients, external API SDKs. Same instance shared across all requests.
//
//   .state(name, value)     — MUTABLE SHARED STATE
//     Lives in the `store` object. Persists across requests but is mutable.
//     Good for counters, in-memory caches, or feature flags loaded at boot.
//
//   .derive(fn)             — PER-REQUEST DERIVED VALUES
//     Function runs at the start of every request. Use for values computed
//     from request data: parsed auth, request ID, decoded JWT payload, etc.
//
// All three are TYPE-SAFE — TypeScript knows what's available on `context`
// inside every handler with no manual typing.

const app = new Elysia()
  // SWAGGER PLUGIN — generates an interactive OpenAPI UI at /swagger.
  // It reads the schemas you declared (body, params, query, response) and
  // the `detail` metadata on each route — no extra documentation files needed.
  // This is the killer combo with TypeBox: one schema → validation + types + docs.
  .use(
    swagger({
      path: '/swagger',
      documentation: {
        info: {
          title: 'POC Elysia API',
          version: '1.0.0',
          description: 'Tasks CRUD demonstrating TypeBox + Swagger integration',
        },
        tags: [{ name: 'tasks', description: 'Task management endpoints' }],
      },
    })
  )

  // Inject a singleton logger — available as `logger` in every handler
  .decorate('logger', new Logger())

  // Add mutable state — accessed via `store` on the context
  .state('requestCount', 0)

  // Run per-request: parse the Authorization header into a user object
  // The return value is merged into context — `user` is available in handlers
  .derive(({ headers }) => {
    const user = parseAuthHeader(headers.authorization);
    return { user };
  })

  // Handler now receives logger, store, and user in addition to the usual stuff
  .get('/', ({ logger, store, user }) => {
    store.requestCount++;
    logger.info(`Hit / — total requests: ${store.requestCount}`);
    return {
      message: 'Hello from Elysia',
      requestCount: store.requestCount,
      // user is { username: string } | null depending on the Auth header
      authenticatedAs: user?.username ?? 'anonymous',
    };
  })

  // Route that uses derive() output for "authentication"
  .get('/me', ({ user, error }) => {
    if (!user) return error(401, { message: 'Send Authorization: Bearer <username>' });
    return { username: user.username };
  })

  // Echo route — typed via inference, no schema needed
  .get('/echo/:id', ({ params }) => ({ id: params.id }))

  .use(tasksRoutes)
  .use(hooksDemo)

  .onError(({ code, error, set, logger }) => {
    // logger is available here too — decorated context flows into onError
    logger.error(`Request failed [${code}]`, error);
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

export type App = typeof app;
void t;
