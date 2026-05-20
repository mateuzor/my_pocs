import { type Handlers } from "$fresh/server.ts";

// Routes that export a `handler` WITHOUT a default component are pure API endpoints.
// File path: routes/api/random.ts → URL: /api/random
//
// Use this for JSON endpoints called by client-side islands.
// Compare to:
//   - Next.js: route.ts in /app
//   - Elysia:  .get('/api/random', () => ...)

export const handler: Handlers = {
  GET() {
    return new Response(
      JSON.stringify({ value: Math.floor(Math.random() * 1000) }),
      {
        headers: { "content-type": "application/json" },
      },
    );
  },
};
