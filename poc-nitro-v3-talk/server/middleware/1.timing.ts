import { defineHandler } from "nitro";

// Everything in middleware/ auto-registers for every route.
// Numeric prefix controls order (1. runs before 2.).
export default defineHandler((event) => {
  const start = performance.now();

  event.res.headers.set("x-nitro-demo", "true");

  // h3 v2 lifecycle hook — runs after the handler resolves
  event.waitUntil?.(Promise.resolve());
  event.context.startedAt = start;
});
