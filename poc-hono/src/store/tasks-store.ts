// Lesson 8 — in-memory task store, extracted out of app.ts so the /tasks
// sub-app (src/routes/tasks.ts) can own its own routes without reaching
// into app.ts's module state.
export interface Task {
  id: number;
  title: string;
  done: boolean;
  userId: number;
}

export const tasks: Task[] = [];
let nextId = 1;

export function createTask(userId: number, title: string): Task {
  const task: Task = { id: nextId++, title, done: false, userId };
  tasks.push(task);
  return task;
}
