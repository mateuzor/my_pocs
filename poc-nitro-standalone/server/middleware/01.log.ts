// Any file under server/middleware/ runs on EVERY request, before route
// handlers, in alphabetical order (hence the numeric prefix to control it).
//
// Middleware that returns nothing simply lets the request continue — it's
// for cross-cutting concerns (logging, auth, headers) so individual routes
// stay clean. NEVER return a value here unless you mean to short-circuit
// the whole request.
export default defineEventHandler((event) => {
  const start = Date.now();
  // `event.node.res` is the raw Node response; hooking its "close" event lets
  // us log the final status + duration once the response is fully sent.
  event.node.res.on("close", () => {
    const ms = Date.now() - start;
    console.log(`${event.method} ${event.path} -> ${event.node.res.statusCode} (${ms}ms)`);
  });
});
