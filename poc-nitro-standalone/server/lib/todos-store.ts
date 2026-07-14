// Nitro ships a built-in KV abstraction: useStorage(). It returns a driver
// (in-memory by default) exposing the SAME get/set/getKeys API regardless of
// the backend — so swapping memory for fs / redis / cloudflare-kv is a
// one-line config change (see nitro.config.ts), not a code rewrite.
//
// This replaces the previous in-memory Map: data now goes through the
// storage layer, so once we mount a persistent driver it survives restarts.
export interface Todo {
  id: number;
  title: string;
  done: boolean;
}

// Everything under the "todos" mount. useStorage(base) namespaces the keys.
const storage = () => useStorage("todos");

export const todoStore = {
  async list(): Promise<Todo[]> {
    const keys = await storage().getKeys();
    const items = await Promise.all(keys.map((k) => storage().getItem<Todo>(k)));
    return items.filter((t): t is Todo => Boolean(t)).sort((a, b) => a.id - b.id);
  },
  async add(title: string): Promise<Todo> {
    const id = Date.now();
    const todo: Todo = { id, title, done: false };
    await storage().setItem(`todo:${id}`, todo);
    return todo;
  },
};
