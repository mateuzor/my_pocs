// Tiny in-memory fake API with latency, so we can observe loading states,
// deduplication and optimistic updates without a backend.
export interface Todo { id: number; text: string; done: boolean }
export interface Post { id: number; title: string }

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

let todos: Todo[] = [
  { id: 1, text: 'Read SWR docs', done: true },
  { id: 2, text: 'Try optimistic UI', done: false },
];
export let fetchCount = 0; // visible proof of dedupe: many hooks, one request

export async function getTodos(): Promise<Todo[]> {
  fetchCount++;
  await sleep(600);
  return [...todos];
}

export async function addTodo(text: string): Promise<Todo> {
  await sleep(800);
  if (text.toLowerCase().includes('fail')) throw new Error('Server rejected this todo');
  const todo = { id: Date.now(), text, done: false };
  todos = [...todos, todo];
  return todo;
}

export async function toggleTodo(id: number): Promise<void> {
  await sleep(500);
  todos = todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
}

const allPosts: Post[] = Array.from({ length: 25 }, (_, i) => ({ id: i + 1, title: `Post #${i + 1}` }));

export async function getPosts(page: number, size = 5): Promise<Post[]> {
  await sleep(400);
  return allPosts.slice(page * size, page * size + size);
}

export async function getClock(): Promise<string> {
  await sleep(100);
  return new Date().toLocaleTimeString();
}
