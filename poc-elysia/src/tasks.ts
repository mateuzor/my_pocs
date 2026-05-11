import { Elysia, t } from 'elysia';

// TypeBox validation is the second pillar of Elysia.
// You declare a SCHEMA once with `t.Object`/`t.String`/etc, and Elysia:
//   1. validates incoming requests at runtime (returns 422 automatically if invalid)
//   2. INFERS the TypeScript type — `body` in your handler is fully typed
//   3. generates OpenAPI docs from the same schema (via the Swagger plugin)
//
// One source of truth — schema, types, validation, and docs all in sync.

interface Task {
  id: number;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
}

// In-memory "database" — fine for a POC
const tasks: Task[] = [
  { id: 1, title: 'Learn Elysia', completed: false, priority: 'high' },
  { id: 2, title: 'Write POC', completed: true, priority: 'medium' },
];
let nextId = 3;

export const tasksRoutes = new Elysia({ prefix: '/tasks' })
  // GET /tasks?completed=true — query validation
  .get(
    '/',
    ({ query }) => {
      // query.completed is typed as `boolean | undefined` thanks to t.Optional + t.Boolean
      if (query.completed !== undefined) {
        return tasks.filter(t => t.completed === query.completed);
      }
      return tasks;
    },
    {
      query: t.Object({
        // t.Optional makes the field optional; otherwise required
        completed: t.Optional(t.Boolean()),
      }),
    }
  )

  // GET /tasks/:id — param validation with type coercion
  // Note: t.Numeric() parses the string param as a number automatically
  .get(
    '/:id',
    ({ params, error }) => {
      const task = tasks.find(t => t.id === params.id);
      // error() is Elysia's helper for typed HTTP error responses
      if (!task) return error(404, { message: `Task ${params.id} not found` });
      return task;
    },
    {
      params: t.Object({
        id: t.Numeric(), // auto-coerces "42" → 42, fails with 422 if not numeric
      }),
    }
  )

  // POST /tasks — body validation
  // If the request body doesn't match the schema, Elysia returns 422 with a
  // detailed error message — you never reach the handler with invalid data
  .post(
    '/',
    ({ body }) => {
      // body is fully typed: { title: string; priority: 'low'|'medium'|'high' }
      const task: Task = {
        id: nextId++,
        title: body.title,
        completed: false,
        priority: body.priority,
      };
      tasks.push(task);
      return task;
    },
    {
      body: t.Object({
        // t.String with constraints — minLength is enforced at runtime
        title: t.String({ minLength: 1, maxLength: 100 }),
        // t.Union of literals = enum
        priority: t.Union([
          t.Literal('low'),
          t.Literal('medium'),
          t.Literal('high'),
        ]),
      }),
    }
  )

  // PUT /tasks/:id — partial update with t.Partial
  .put(
    '/:id',
    ({ params, body, error }) => {
      const task = tasks.find(t => t.id === params.id);
      if (!task) return error(404, { message: `Task ${params.id} not found` });
      Object.assign(task, body);
      return task;
    },
    {
      params: t.Object({ id: t.Numeric() }),
      // t.Partial makes every field optional — for PATCH/PUT updates
      body: t.Partial(
        t.Object({
          title: t.String({ minLength: 1, maxLength: 100 }),
          completed: t.Boolean(),
          priority: t.Union([t.Literal('low'), t.Literal('medium'), t.Literal('high')]),
        })
      ),
    }
  )

  // DELETE /tasks/:id
  .delete(
    '/:id',
    ({ params, error }) => {
      const idx = tasks.findIndex(t => t.id === params.id);
      if (idx === -1) return error(404, { message: `Task ${params.id} not found` });
      const [deleted] = tasks.splice(idx, 1);
      return deleted;
    },
    {
      params: t.Object({ id: t.Numeric() }),
    }
  );
