import { Elysia } from 'elysia';

// Elysia is a TypeScript-first web framework built on top of Bun.
// Its main selling point is METHOD CHAINING with automatic TYPE INFERENCE:
// you write a route once and Elysia infers the parameter types automatically —
// no manual `req.params as { id: string }` casts or separate type files.

// Each .get/.post/.put/.delete call returns the same Elysia instance with
// the new route appended to its type. This is what makes Eden (the type-safe
// client we'll see in commit 4) possible.

const app = new Elysia()
  // Plain route — handler receives a `context` object with everything you need
  .get('/', () => 'Hello from Elysia')

  // Route with path params — `:id` is automatically typed as string in `params.id`
  // Notice we don't declare any types — Elysia infers them from the path itself
  .get('/tasks/:id', ({ params }) => {
    // params.id has type `string` automatically
    return { id: params.id, title: `Task ${params.id}` };
  })

  // Multiple path params, also fully inferred
  .get('/users/:userId/posts/:postId', ({ params }) => {
    // both params.userId and params.postId are typed as string
    return { userId: params.userId, postId: params.postId };
  })

  // Query string is also typed — `query.q` is inferred as string | undefined
  .get('/search', ({ query }) => {
    return { results: [], query: query.q ?? '' };
  })

  // POST handler — `body` is typed as unknown by default until we add validation
  // (we'll fix this in commit 2 with TypeBox schemas)
  .post('/tasks', ({ body }) => {
    return { created: true, received: body };
  })

  // Returning different status codes via the `set` context property
  .get('/admin', ({ set }) => {
    set.status = 401;
    return { error: 'Unauthorized' };
  })

  // .listen returns the running server — Bun gives us native HTTP performance
  .listen(3000);

// Logging the server URL so you can confirm it's running
console.log(`🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`);
