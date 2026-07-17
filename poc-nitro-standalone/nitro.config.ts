// nitro.config.ts is the single source of truth for a STANDALONE Nitro app.
// Without Nuxt, Nitro is just a server engine: it takes this config plus the
// file-based `server/` folder and produces a portable Node/edge server.
export default defineNitroConfig({
  // Pinning a compatibility date makes builds reproducible.
  compatibilityDate: "2025-07-01",

  // STORAGE MOUNTS (powered by "unstorage"): swap the driver to change the
  // backend (fs / redis / cloudflare-kv / vercel-kv) with zero code edits.
  storage: {
    todos: { driver: "fs", base: "./.data/todos" },
  },

  // RUNTIME CONFIG: defaults overridden by NITRO_* env vars at boot.
  runtimeConfig: {
    apiSecret: "dev-secret",
    public: {
      appName: "poc-nitro-standalone",
    },
  },

  // ROUTE RULES: declarative, per-route behaviour applied WITHOUT editing the
  // handlers. Patterns support globs. This is the same mechanism Nitro uses
  // to express hybrid rendering (some routes cached at the edge, some SSR,
  // some redirected) purely from config.
  routeRules: {
    // Add cache headers so a CDN can cache /expensive for 30s.
    "/expensive": { cache: { maxAge: 30 } },
    // Attach a header to every /api/* response.
    "/api/**": { headers: { "x-powered-by": "nitro" } },
    // Redirect a whole path from config — no handler file needed.
    "/docs": { redirect: "/" },
    // Mark a route to be prerendered (see prerender block below).
    "/hello": { prerender: true },
  },

  // PRERENDER: routes listed here are rendered to static files at BUILD time
  // and served with zero server work — ideal for pages that rarely change.
  // `crawlLinks` follows internal links to discover more pages automatically.
  prerender: {
    routes: ["/", "/api/status"],
    crawlLinks: false,
  },
});
