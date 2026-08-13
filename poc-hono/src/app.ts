import { Hono } from 'hono';
import { logger } from 'hono/logger';

// Aula 1 — Hono é um framework HTTP TypeScript-first, ultra-leve (~14kB),
// portátil (roda em Bun, Deno, Node, Cloudflare Workers, Vercel Edge).
// A grande sacada: o `Hono` acumula TIPO conforme você encadeia rotas —
// isso é o que viabiliza o RPC client type-safe (aula 3).
//
// Comparação com Express:
//   - Express usa (req, res, next) mutáveis, resposta imperativa (res.json).
//   - Hono usa um Context imutável — `c.req.*` pra ler, `return c.json(...)` pra responder.
//   - Baseado em Web Standards (Request/Response), não em APIs Node-only.

// Storage em memória (banco vem depois — pra POC de sintaxe basta).
interface Task {
  id: number;
  title: string;
  done: boolean;
}
const tasks: Task[] = [
  { id: 1, title: 'Aprender Hono', done: false },
  { id: 2, title: 'Comparar com Express', done: false },
];
let nextId = 3;

// Exporto `app` pra o server.ts subir a porta e o cliente RPC (aula 3)
// derivar o tipo. É o mesmo padrão do createApp do Express.
export const app = new Hono()
  // Middleware built-in — loga método/path/status. Substitui pino-http/morgan.
  .use(logger())

  // GET / — resposta simples com c.text()
  .get('/', (c) => c.text('Hono no ar 🔥'))

  // GET /health — resposta JSON com c.json()
  .get('/health', (c) => c.json({ status: 'ok', ts: Date.now() }))

  // GET /tasks — path params são tipados via generics do Hono
  .get('/tasks', (c) => c.json(tasks))

  .get('/tasks/:id', (c) => {
    // c.req.param('id') — em Express seria req.params.id
    const id = Number(c.req.param('id'));
    const task = tasks.find((t) => t.id === id);
    if (!task) return c.json({ error: 'NOT_FOUND' }, 404);
    return c.json(task);
  })

  .post('/tasks', async (c) => {
    // c.req.json() é async — Web Standards ReadableStream por baixo
    const body = (await c.req.json()) as { title?: string };
    if (!body.title?.trim()) return c.json({ error: 'title obrigatório' }, 400);

    const task: Task = { id: nextId++, title: body.title.trim(), done: false };
    tasks.push(task);
    return c.json(task, 201);
  })

  .delete('/tasks/:id', (c) => {
    const id = Number(c.req.param('id'));
    const idx = tasks.findIndex((t) => t.id === id);
    if (idx === -1) return c.json({ error: 'NOT_FOUND' }, 404);
    return c.json(tasks.splice(idx, 1)[0]);
  });

// TypeScript já sabe todas as rotas — o TIPO do `app` codifica cada endpoint.
// Isso é a base do RPC client que vai aparecer na aula 3.
export type AppType = typeof app;
