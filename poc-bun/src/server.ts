// Bun is a JS/TS runtime built from scratch in Zig, designed as a drop-in
// replacement for Node.js — but faster, with a built-in bundler, test runner,
// package manager, and TypeScript support out of the box.
// No `node_modules` resolution overhead, no tsc compilation step.
//
// THIS FILE demonstrates Bun's native HTTP server. The API is a thin wrapper
// over Web standards (Request / Response) — no `http` module, no body parsing
// middleware required.

// `Bun.serve` is Bun's native HTTP server.
// It can do ~3-4x the requests/sec of a comparable Node HTTP server.
const server = Bun.serve({
  port: 3000,

  // Handler receives a standard Request and must return a Response (or Promise<Response>)
  async fetch(req) {
    const url = new URL(req.url);

    // Static-style routes
    if (url.pathname === '/') {
      return new Response('Hello from Bun!', {
        headers: { 'content-type': 'text/plain' },
      });
    }

    // JSON endpoint — Response.json() is a static shortcut
    if (url.pathname === '/api/info') {
      return Response.json({
        runtime: 'bun',
        version: Bun.version,
        // Bun exposes hardware info as runtime APIs
        memoryUsage: process.memoryUsage().rss,
        platform: process.platform,
      });
    }

    // Demo of Bun.file — zero-copy file streaming
    if (url.pathname === '/readme') {
      const file = Bun.file('./README.md');
      // If the file exists, Bun streams it directly without buffering in memory
      if (await file.exists()) {
        return new Response(file, { headers: { 'content-type': 'text/markdown' } });
      }
      return new Response('No README found', { status: 404 });
    }

    // POST echo — bodies parse as standard Request
    if (url.pathname === '/echo' && req.method === 'POST') {
      const body = await req.json();
      return Response.json({ received: body, ts: Date.now() });
    }

    return new Response('Not found', { status: 404 });
  },

  // Per-request error handler — runs if `fetch` throws
  error(err) {
    return new Response(`Error: ${err.message}`, { status: 500 });
  },
});

console.log(`🥟 Bun server running at http://localhost:${server.port}`);
console.log(`Try:`);
console.log(`  curl http://localhost:${server.port}/`);
console.log(`  curl http://localhost:${server.port}/api/info`);
console.log(`  curl -X POST http://localhost:${server.port}/echo -d '{"x":1}' -H 'content-type: application/json'`);
