import { app } from '../app.js';

// Lesson 13 — Cloudflare Workers (and Vercel Edge) load a module that
// default-exports an object with a `fetch(request, env, ctx)` method.
// Hono's `app` already has that exact shape — no adapter needed, this file
// is only here to give the Workers entrypoint its own path/name for
// `wrangler.toml`'s `main` field. Deploy with `wrangler deploy` (see
// wrangler.toml at the project root).
export default app;
