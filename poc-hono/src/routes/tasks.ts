import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { jwt } from 'hono/jwt';
import { streamSSE } from 'hono/streaming';
import { zValidator } from '@hono/zod-validator';
import { createTaskSchema, updateTaskSchema, taskIdParamSchema } from '../schemas.js';
import { tasks, createTask } from '../store/tasks-store.js';
import { JWT_SECRET } from '../config.js';

// Lesson 8 — route composition with `.route()`.
//
// Instead of one giant chained `app.ts`, each resource gets its own Hono
// instance that only knows about ITS routes and middleware. The parent app
// mounts it with `app.route('/tasks', tasksRoute)` — the prefix is applied
// automatically, so routes here are declared as if they lived at `/`.
// This is the same pattern as Express's `Router()`, but the sub-app keeps
// its own type chain, so `hc<AppType>()` on the parent still sees every
// nested route with full type-safety.
export const tasksRoute = new Hono()
  .use('*', jwt({ secret: JWT_SECRET, alg: 'HS256' }))

  .get('/', (c) => {
    const payload = c.get('jwtPayload') as { sub: number };
    return c.json(tasks.filter((t) => t.userId === payload.sub));
  })

  // Lesson 9 — Server-Sent Events.
  //
  // `streamSSE` keeps the connection open and lets us `writeSSE()` multiple
  // times over it — the client (EventSource, or fetch reading the stream)
  // gets one `event:`/`data:` frame per call, without polling. Declared
  // BEFORE `/:id` so the static segment `/stream` matches first; Hono's
  // router already prioritizes static routes over `:id`-style params, but
  // being explicit about ordering avoids surprises when skimming the file.
  .get('/stream', (c) => {
    const payload = c.get('jwtPayload') as { sub: number };
    return streamSSE(c, async (stream) => {
      for (let tick = 0; tick < 3; tick++) {
        const count = tasks.filter((t) => t.userId === payload.sub).length;
        await stream.writeSSE({ event: 'tick', data: JSON.stringify({ tick, count }), id: String(tick) });
        await stream.sleep(500);
      }
    });
  })

  .get('/:id', zValidator('param', taskIdParamSchema), (c) => {
    const { id } = c.req.valid('param');
    const payload = c.get('jwtPayload') as { sub: number };
    const task = tasks.find((t) => t.id === id && t.userId === payload.sub);
    if (!task) throw new HTTPException(404, { message: 'Task não encontrada' });
    return c.json(task);
  })

  .post('/', zValidator('json', createTaskSchema), (c) => {
    const input = c.req.valid('json');
    const payload = c.get('jwtPayload') as { sub: number };
    return c.json(createTask(payload.sub, input.title), 201);
  })

  .put(
    '/:id',
    zValidator('param', taskIdParamSchema),
    zValidator('json', updateTaskSchema),
    (c) => {
      const { id } = c.req.valid('param');
      const input = c.req.valid('json');
      const payload = c.get('jwtPayload') as { sub: number };
      const task = tasks.find((t) => t.id === id && t.userId === payload.sub);
      if (!task) throw new HTTPException(404, { message: 'Task não encontrada' });
      if (input.title !== undefined) task.title = input.title;
      if (input.done !== undefined) task.done = input.done;
      return c.json(task);
    }
  )

  .delete('/:id', zValidator('param', taskIdParamSchema), (c) => {
    const { id } = c.req.valid('param');
    const payload = c.get('jwtPayload') as { sub: number };
    const idx = tasks.findIndex((t) => t.id === id && t.userId === payload.sub);
    if (idx === -1) throw new HTTPException(404, { message: 'Task não encontrada' });
    return c.json(tasks.splice(idx, 1)[0]);
  });
