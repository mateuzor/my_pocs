import { defineHandler } from "nitro";

// File name IS the route + method: hello.get.ts -> GET /api/hello
// No router. No app.get(). No registration file to keep in sync.
export default defineHandler((event) => {
  return {
    hello: "Nitro",
    method: event.req.method,
    // h3 v2 is built on web standards: event.req is a real Request,
    // event.url is a real URL. Nothing proprietary to learn.
    runtime: globalThis.process?.versions?.node
      ? `node ${process.versions.node}`
      : "edge",
  };
});
