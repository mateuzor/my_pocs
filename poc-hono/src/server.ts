import { serve } from '@hono/node-server';
import { app } from './app.js';

// Aula 1 — Adapter pra rodar no Node.
//
// Hono não sobe servidor sozinho — ele expõe um handler
// (Request → Response) que vários adapters plugam em diferentes runtimes:
//   - @hono/node-server   → Node
//   - bun (nativo)        → Bun.serve({ fetch: app.fetch })
//   - deno (nativo)       → Deno.serve(app.fetch)
//   - Cloudflare Workers  → export default app
//
// A mesma app roda em qualquer runtime — é a razão de Hono ser tão popular
// pra edge functions.

const PORT = 3000;

serve({ fetch: app.fetch, port: PORT }, (info) => {
  console.log(`Hono no ar em http://localhost:${info.port}`);
});
