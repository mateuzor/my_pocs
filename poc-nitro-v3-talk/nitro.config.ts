import { defineConfig } from "nitro";

export default defineConfig({
  // Where Nitro scans. Defaults to false — unset it and every route 404s.
  serverDir: "./server", // server/api/* -> /api/*   server/routes/* -> /*

  // Storage: one API, ~20 drivers, swapped by config — never by handler code.
  // Gotcha: the `fs` driver pulls in native fsevents, which breaks the
  // cloudflare_module and deno_deploy builds. Hence devStorage.
  storage: {
    data: { driver: "memory" }, // prod: swap for redis / cloudflare-kv / s3
  },
  devStorage: {
    data: { driver: "fs", base: "./.data/kv" }, // dev: real files on disk
  },

  // Infrastructure as config. These same lines compile to CDN headers on
  // Vercel, _headers on Netlify, or runtime middleware on Node.
  routeRules: {
    "/api/**": { cors: true },
    "/api/time": { swr: 10 }, // caches the whole handler for 10s
    "/gh/**": { proxy: "https://api.github.com/**" }, // proxy, no proxy code
    "/admin/**": {
      basicAuth: { username: "nitro", password: "demo" }, // auth, no auth code
    },
    "**": { headers: { "x-powered-by": "Nitro v3" } },
  },
});
