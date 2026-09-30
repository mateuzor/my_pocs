import chalk from "chalk"; // npm: package, resolved through the import map, no node_modules needed
import { createHandler } from "./handler.ts";

// Deno.openKv needs --unstable-kv on older versions; the path persists data to disk.
const kv = await Deno.openKv("./data.kv");

// Deno.serve is the built-in HTTP server: no framework, web-standard Request/Response.
const server = Deno.serve({
  port: 8000,
  onListen: ({ port }) => console.log(chalk.green(`Listening on http://localhost:${port}`)),
}, createHandler(kv));

// Graceful shutdown on Ctrl+C so KV flushes cleanly (needs no extra permission).
Deno.addSignalListener("SIGINT", async () => {
  await server.shutdown();
  kv.close();
  Deno.exit(0);
});
