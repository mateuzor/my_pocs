// Nitro TASKS are jobs that run OUTSIDE the request cycle — via
// `nitro task run cleanup`, a scheduler (cron), or programmatically with
// runTask(). Perfect for maintenance/cron work that shouldn't live in a route.
//
// `defineTask` is auto-imported. Enable tasks with experimental.tasks in
// nitro.config.ts (see there).
export default defineTask({
  meta: {
    name: "cleanup",
    description: "Remove completed todos from storage",
  },
  async run() {
    const storage = useStorage("todos");
    const keys = await storage.getKeys();
    let removed = 0;
    for (const key of keys) {
      const todo = await storage.getItem<{ done: boolean }>(key);
      if (todo?.done) {
        await storage.removeItem(key);
        removed++;
      }
    }
    // Tasks return a { result } payload that the runner prints/logs.
    return { result: { removed } };
  },
});
