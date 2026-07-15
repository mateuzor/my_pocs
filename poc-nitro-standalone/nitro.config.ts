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

  // RUNTIME CONFIG: typed config resolved at runtime. Values here are
  // defaults; any matching NITRO_* env var overrides them when the server
  // boots (NITRO_API_SECRET -> apiSecret). Read it with useRuntimeConfig().
  runtimeConfig: {
    // Server-only secret — never sent to any client.
    apiSecret: "dev-secret",
    // Conventionally "safe to expose" values.
    public: {
      appName: "poc-nitro-standalone",
    },
  },
});
