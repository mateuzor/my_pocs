import { treaty } from '@elysiajs/eden';
import type { App } from './index';

// EDEN — the killer feature of Elysia.
//
// You export the SERVER type with `export type App = typeof app` (see index.ts),
// then `treaty<App>` builds a fully type-safe client object whose shape mirrors
// every route on the server. No code generation, no spec file, no zod-to-ts pipeline.
// The TypeScript compiler reads your routes directly.
//
// Compare to fetch():
//   const res = await fetch('http://localhost:3000/tasks');         ← URL is a string, no autocomplete
//   const tasks = (await res.json()) as Task[];                      ← manual cast, no validation
//
// With Eden:
//   const { data: tasks } = await api.tasks.get();                   ← autocompleted, typed return

const api = treaty<App>('localhost:3000');

async function demo() {
  // GET /tasks?completed=false
  // - `tasks.get()` corresponds to GET /tasks
  // - The `query` arg is typed from the t.Object({ completed: t.Optional(...) }) schema
  // - `data` is fully typed as `Task[]` — autocomplete on each field works
  const { data: list, error: listError } = await api.tasks.get({
    query: { completed: false },
  });
  if (listError) {
    console.error('Failed to list tasks:', listError.value);
    return;
  }
  console.log('Tasks:', list);

  // GET /tasks/:id — path params become function arguments
  // `api.tasks({ id: 1 }).get()` reads as: tasks where id=1 → GET
  // The `1` is checked against t.Numeric() on the server
  const { data: task, error: taskError } = await api.tasks({ id: 1 }).get();
  if (taskError) {
    // error.value is typed based on the server's error() returns —
    // here it's { message: string } from the 404 branch
    console.error(`Status ${taskError.status}:`, taskError.value);
  } else {
    console.log('Task #1:', task);
  }

  // POST /tasks — body is type-checked against the TypeBox schema
  // Try passing `priority: 'urgent'` and TypeScript rejects it at compile time
  // because the schema only allows 'low' | 'medium' | 'high'
  const { data: created } = await api.tasks.post({
    title: 'Buy milk',
    priority: 'high',
  });
  console.log('Created:', created);

  // PUT /tasks/:id — partial body, also fully typed
  if (created) {
    const { data: updated } = await api.tasks({ id: created.id }).put({
      completed: true,
    });
    console.log('Updated:', updated);
  }

  // GET /me — uses the .derive() user from the server. Eden passes headers through.
  const { data: me } = await api.me.get({
    headers: { authorization: 'Bearer alice' },
  });
  console.log('Authenticated as:', me);
}

// Only runs when this file is executed directly (e.g., `bun run src/client.ts`).
// Won't run when index.ts imports the App type from it.
if (import.meta.main) {
  demo().catch(console.error);
}
