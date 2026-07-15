// Files under server/plugins/ run ONCE at server startup (not per request).
// They receive the Nitro app instance and are the place to wire lifecycle
// hooks, warm caches, open DB connections, etc.
//
// `defineNitroPlugin` is auto-imported.
export default defineNitroPlugin((nitroApp) => {
  console.log("[plugin] Nitro server starting up");

  // Hooks tap into the request lifecycle globally, without touching routes.
  nitroApp.hooks.hook("request", (event) => {
    // A good spot for correlation ids / tracing. Stored on event.context,
    // which is per-request scratch space shared with every handler.
    event.context.startedAt = Date.now();
  });

  nitroApp.hooks.hook("beforeResponse", (event) => {
    const started = event.context.startedAt as number | undefined;
    if (started) {
      event.node.res.setHeader("x-response-time", `${Date.now() - started}ms`);
    }
  });
});
