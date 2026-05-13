import { Elysia } from 'elysia';

// LIFECYCLE HOOKS in Elysia run at specific moments during a request.
// You attach them with .onRequest, .onParse, .onTransform, .onBeforeHandle,
// .onAfterHandle, .mapResponse, .onResponse, .onError.
//
// The full order for a successful request:
//
//   1. onRequest         — raw Request, before any routing happens
//   2. onParse           — body parsing (multipart, json, etc.)
//   3. onTransform       — mutate context before validation
//   4. onBeforeHandle    — guard / short-circuit (can return a value to skip handler)
//   5. (route handler)   — your actual business logic
//   6. onAfterHandle     — transform the return value before serialization
//   7. mapResponse       — final response object mapping (rare)
//   8. onResponse        — fire-and-forget: logging, metrics, cleanup
//
//   onError fires at any point if something throws.
//
// Hooks can be attached GLOBALLY (apply to all routes) or LOCALLY (single route).

export const hooksDemo = new Elysia({ prefix: '/hooks' })
  // Runs BEFORE Elysia even looks at the URL — useful for global concerns
  // like request IDs, raw header inspection, or rejecting based on the IP
  .onRequest(({ request }) => {
    const requestId = crypto.randomUUID();
    // Stashing on the underlying Request object — accessible later via .headers if needed
    console.log(`[${requestId.slice(0, 8)}] → ${request.method} ${new URL(request.url).pathname}`);
  })

  // Runs AFTER routing matched but BEFORE the handler executes.
  // If you RETURN a value here, the handler is skipped and the return value becomes the response.
  // This is how you implement auth guards, rate limiting, feature flags.
  .onBeforeHandle(({ headers, set }) => {
    if (headers['x-blocked'] === 'true') {
      set.status = 403;
      return { error: 'Blocked by beforeHandle hook' };
    }
    // returning undefined means "keep going to the handler"
  })

  // Runs AFTER the handler returns, but BEFORE the response is sent.
  // Receives the handler's return value — you can transform/wrap it.
  // Useful for envelope patterns: { data: ..., meta: ... }
  .onAfterHandle(({ response }) => {
    // Wrap every response in { data: ... } envelope
    if (response && typeof response === 'object' && !('error' in response)) {
      return { data: response, wrappedBy: 'afterHandle' };
    }
  })

  // Fire-and-forget — the response is already being sent, this just runs after.
  // Use for metrics, audit logs, async cleanup.
  .onResponse(({ request, set }) => {
    console.log(`  ← ${new URL(request.url).pathname} responded with ${set.status ?? 200}`);
  })

  // Route 1: basic — exercises onRequest, onBeforeHandle, handler, onAfterHandle, onResponse
  .get('/ping', () => ({ pong: true }))

  // Route 2: throws on purpose — exercises onError
  .get('/boom', () => {
    throw new Error('Intentional crash for the demo');
  })

  // Route 3: LOCAL hook — only applies to this single route
  // local hooks run INSIDE the global ones, like nested middleware
  .get(
    '/local',
    () => ({ message: 'has its own beforeHandle' }),
    {
      beforeHandle: ({ query, set }) => {
        if (!query.token) {
          set.status = 401;
          return { error: 'Missing token (local hook)' };
        }
      },
    }
  );
