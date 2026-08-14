import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { HTTPException } from 'hono/http-exception';
import { zValidator } from '@hono/zod-validator';
import { createTaskSchema, updateTaskSchema, taskIdParamSchema } from './schemas.js';

// Aula 1 — Hono é um framework HTTP TypeScript-first, ultra-leve (~14kB),
// portátil (roda em Bun, Deno, Node, Cloudflare Workers, Vercel Edge).
//
// Aula 2 — Validação com @hono/zod-validator + tratamento de erros
//
// zValidator('json', schema) é um MIDDLEWARE que:
//   1. valida o body/query/param contra o schema Zod
//   2. rejeita automaticamente com 400 se inválido
//   3. TIPA o resultado — dentro do handler, c.req.valid('json') tem o tipo
//      inferido do schema (sem `as` nem parse manual).
//
// A cadeia de tipos é o coração do Hono: cada .use/.get/.post enriquece o
// tipo do `app`, o que possibilita o RPC client (aula 3).

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

export const app = new Hono()
  .use(logger())

  // ERROR HANDLER GLOBAL — Hono usa .onError, análogo ao middleware de 4 args do Express.
  // HTTPException é a classe própria do Hono pra erros com status. Qualquer
  // outro throw vira 500.
  .onError((err, c) => {
    if (err instanceof HTTPException) {
      return c.json({ error: err.message }, err.status);
    }
    console.error(err);
    return c.json({ error: 'INTERNAL_SERVER_ERROR' }, 500);
  })

  .get('/', (c) => c.text('Hono no ar 🔥'))
  .get('/health', (c) => c.json({ status: 'ok', ts: Date.now() }))

  .get('/tasks', (c) => c.json(tasks))

  // zValidator('param', schema) valida os path params.
  // Se `id` não for numérico, retorna 400 antes de chegar no handler.
  .get('/tasks/:id', zValidator('param', taskIdParamSchema), (c) => {
    // .valid('param') retorna JÁ tipado — { id: number }
    const { id } = c.req.valid('param');
    const task = tasks.find((t) => t.id === id);
    if (!task) throw new HTTPException(404, { message: 'Task não encontrada' });
    return c.json(task);
  })

  // Múltiplos validators ENCADEIAM — cada um enriquece o tipo do context.
  .post('/tasks', zValidator('json', createTaskSchema), (c) => {
    const input = c.req.valid('json'); // { title: string }
    const task: Task = { id: nextId++, title: input.title, done: false };
    tasks.push(task);
    return c.json(task, 201);
  })

  .put(
    '/tasks/:id',
    zValidator('param', taskIdParamSchema),
    zValidator('json', updateTaskSchema),
    (c) => {
      const { id } = c.req.valid('param');
      const input = c.req.valid('json');
      const task = tasks.find((t) => t.id === id);
      if (!task) throw new HTTPException(404, { message: 'Task não encontrada' });
      if (input.title !== undefined) task.title = input.title;
      if (input.done !== undefined) task.done = input.done;
      return c.json(task);
    }
  )

  .delete('/tasks/:id', zValidator('param', taskIdParamSchema), (c) => {
    const { id } = c.req.valid('param');
    const idx = tasks.findIndex((t) => t.id === id);
    if (idx === -1) throw new HTTPException(404, { message: 'Task não encontrada' });
    return c.json(tasks.splice(idx, 1)[0]);
  });

export type AppType = typeof app;
