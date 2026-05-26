import { Elysia } from 'elysia';

// HTMX servers return HTML FRAGMENTS, not JSON. Each endpoint returns the
// piece of HTML that HTMX will swap into the page at hx-target.
// The "API" is the HTML itself — no JSON shape to maintain, no client-side
// rendering layer, no schema duplicated between server and client.

const QUOTES = [
  '"Premature optimization is the root of all evil." — Knuth',
  '"There are two hard things in computer science." — Karlton',
  '"Talk is cheap. Show me the code." — Torvalds',
  '"Simple things should be simple, complex things should be possible." — Kay',
];

const FRAMEWORKS = ['React', 'Vue', 'Svelte', 'Solid', 'Preact', 'Angular', 'Qwik', 'Lit'];

// In-memory counter — HTMX keeps state on the server, not in the browser.
// (For per-user counters you'd key this off a session id or user id.)
let serverCount = 0;

const app = new Elysia()
  // Serve the static HTML page at /
  .get('/', () => Bun.file('./public/index.html'))

  // Endpoint 1: random quote — returns a single <em> element
  .get('/api/quote', () => {
    const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    return new Response(`<em>${quote}</em>`, {
      headers: { 'content-type': 'text/html' },
    });
  })

  // Endpoint 2: greeting from form POST
  .post('/api/greet', async ({ body }) => {
    const name = (body as { name?: string }).name ?? 'stranger';
    return new Response(`Hello, <strong>${escape(name)}</strong>! 👋`, {
      headers: { 'content-type': 'text/html' },
    });
  })

  // Endpoint 3: live search — returns <li> rows matching the query
  .get('/api/search', ({ query }) => {
    const q = (query.q ?? '').toLowerCase();
    const matches = q ? FRAMEWORKS.filter((f) => f.toLowerCase().includes(q)) : [];
    const html = matches.map((m) => `<li>${m}</li>`).join('') || '<li style="color:#a0aec0">no matches</li>';
    return new Response(html, { headers: { 'content-type': 'text/html' } });
  })

  // Endpoint 4: counter — receives current+delta, returns the new counter HTML
  .post('/api/counter', async ({ body }) => {
    const data = body as { current?: number; delta?: number };
    serverCount = (Number(data.current) || 0) + (Number(data.delta) || 1);
    // Return the SAME div structure — HTMX swaps it in via hx-swap="outerHTML"
    return new Response(
      `<div id="counter" hx-target="this" hx-swap="outerHTML">
        <span>Count: <strong>${serverCount}</strong></span>
        <button hx-post="/api/counter" hx-vals='{"current": ${serverCount}, "delta": 1}'>+1</button>
      </div>`,
      { headers: { 'content-type': 'text/html' } }
    );
  })

  // Endpoint 5: current server time — for the polling example
  .get('/api/time', () => {
    return new Response(
      `Server time: <strong>${new Date().toLocaleTimeString()}</strong>`,
      { headers: { 'content-type': 'text/html' } }
    );
  })

  .listen(3000);

console.log(`HTMX POC running at http://localhost:${app.server?.port}`);

// Naive HTML-escape to avoid XSS on the greeting endpoint
function escape(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!)
  );
}
