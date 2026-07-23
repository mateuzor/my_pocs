// Structured logging with consola — the logger Nitro itself uses. It gives
// levelled, colourized, tagged output in dev and JSON-friendly output in
// production, so you don't hand-roll console.log formatting.
import { consola } from "consola";

// A tagged child logger keeps request logs grouped and greppable.
const log = consola.withTag("http");

export default defineEventHandler((event) => {
  const start = Date.now();
  event.node.res.on("close", () => {
    const ms = Date.now() - start;
    log.info(`${event.method} ${event.path} -> ${event.node.res.statusCode} (${ms}ms)`);
  });
});
