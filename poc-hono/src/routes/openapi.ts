import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import { createTaskSchema } from '../schemas.js';
import { tasks, createTask } from '../store/tasks-store.js';

// Lesson 12 — OpenAPI generation from Zod schemas.
//
// `@hono/zod-openapi` re-exports `z` with an extra `.openapi()` method
// bolted onto every schema, so the SAME Zod object doubles as runtime
// validation AND spec metadata — no separate JSON Schema / swagger-jsdoc
// comments to keep in sync by hand.
//
// This sub-app is a documented DEMO of the tasks API (unauthenticated, its
// own copy of the handlers) rather than a replacement for routes/tasks.ts —
// wiring `.openapi()` into the JWT-protected, already-tested routes would
// be a bigger refactor than this lesson calls for. In a real project you'd
// pick one style and use it everywhere.
const taskSchema = z
  .object({
    id: z.number().openapi({ example: 1 }),
    title: z.string().openapi({ example: 'Learn Hono' }),
    done: z.boolean(),
    userId: z.number(),
  })
  .openapi('Task');

const listRoute = createRoute({
  method: 'get',
  path: '/tasks',
  summary: 'List all tasks',
  tags: ['tasks'],
  responses: {
    200: {
      description: 'Task list',
      content: { 'application/json': { schema: z.array(taskSchema) } },
    },
  },
});

const createTaskRoute = createRoute({
  method: 'post',
  path: '/tasks',
  summary: 'Create a task',
  tags: ['tasks'],
  request: {
    body: { content: { 'application/json': { schema: createTaskSchema } } },
  },
  responses: {
    201: {
      description: 'Task created',
      content: { 'application/json': { schema: taskSchema } },
    },
  },
});

export const openapiRoute = new OpenAPIHono()
  .openapi(listRoute, (c) => c.json(tasks))
  .openapi(createTaskRoute, (c) => {
    const input = c.req.valid('json');
    // userId 0 marks these as "demo" tasks created through the OpenAPI
    // playground, separate from the real per-user data under /tasks.
    return c.json(createTask(0, input.title), 201);
  });
