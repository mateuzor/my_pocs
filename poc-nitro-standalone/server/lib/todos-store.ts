// A plain module (not a route) used as a temporary in-memory store.
// Only `routes/`, `api/`, `middleware/` and `plugins/` have special meaning
// in Nitro; anything else under `server/` is just importable code.
//
// Day 4 swaps this Map for Nitro's useStorage() so data survives restarts —
// keeping it in memory for now lets the routing examples stay focused.
export interface Todo {
  id: number;
  title: string;
  done: boolean;
}

const todos = new Map<number, Todo>([
  [1, { id: 1, title: "Learn Nitro routing", done: true }],
  [2, { id: 2, title: "Try the storage layer", done: false }],
]);
let nextId = 3;

export const todoStore = {
  list: () => [...todos.values()],
  add: (title: string): Todo => {
    const todo: Todo = { id: nextId++, title, done: false };
    todos.set(todo.id, todo);
    return todo;
  },
};
