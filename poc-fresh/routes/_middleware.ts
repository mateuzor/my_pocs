import { type FreshContext } from "$fresh/server.ts";

// _middleware.ts runs for EVERY request matching its folder.
// At the root of routes/, it intercepts every page in the app.
// In a subfolder like routes/admin/_middleware.ts, it only runs for that subtree.
//
// Middleware can:
//   - inspect/modify the Request before the handler runs
//   - short-circuit with `new Response(...)` (auth, rate limiting)
//   - attach state to `ctx.state` for the downstream handler
//   - measure timing, log requests, etc.

// This shape becomes `ctx.state` in every handler downstream.
interface AppState {
  requestId: string;
  startTime: number;
}

export async function handler(req: Request, ctx: FreshContext<AppState>) {
  // Generate a per-request ID and stash it on ctx.state
  ctx.state.requestId = crypto.randomUUID();
  ctx.state.startTime = Date.now();

  console.log(`[${ctx.state.requestId.slice(0, 8)}] → ${req.method} ${new URL(req.url).pathname}`);

  // Call the next middleware / route handler in the chain
  const response = await ctx.next();

  // After the response is produced, we can mutate it (add headers, log)
  const duration = Date.now() - ctx.state.startTime;
  response.headers.set("x-request-id", ctx.state.requestId);
  response.headers.set("x-response-time", `${duration}ms`);

  console.log(`[${ctx.state.requestId.slice(0, 8)}] ← ${response.status} in ${duration}ms`);

  return response;
}
