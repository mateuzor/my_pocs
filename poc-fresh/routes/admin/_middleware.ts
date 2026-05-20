import { type FreshContext } from "$fresh/server.ts";

// SCOPED middleware — only runs for routes under /admin/*.
// This is how you implement folder-level auth without repeating the check
// on every route handler.
//
// The check runs AFTER the root _middleware.ts (which sets requestId),
// so we can read ctx.state.requestId here if needed.

export function handler(req: Request, ctx: FreshContext) {
  const auth = req.headers.get("authorization");

  // Trivial auth: require Bearer admin-token
  // In production this would verify a JWT or session cookie
  if (auth !== "Bearer admin-token") {
    return new Response("Unauthorized — send Authorization: Bearer admin-token", {
      status: 401,
      headers: { "content-type": "text/plain" },
    });
  }

  // Authorized — continue to the actual route handler
  return ctx.next();
}
