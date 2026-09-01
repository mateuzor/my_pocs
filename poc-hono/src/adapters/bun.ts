import { app } from '../app.js';

// Lesson 13 — Bun doesn't need an adapter package at all: `Bun.serve()`
// already speaks the Fetch API, so the exact same `app.fetch` from app.ts
// (built with @hono/node-server for the Node target) plugs in as-is.
// That's the whole "one app, many runtimes" pitch in one file.
//
// This isn't wired into any npm script — the project's dev loop runs on
// Node — it exists to make the claim runnable: `bun run src/adapters/bun.ts`.
export default {
  port: 3000,
  fetch: app.fetch,
};
