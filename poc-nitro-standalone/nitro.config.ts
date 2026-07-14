// nitro.config.ts is the single source of truth for a STANDALONE Nitro app.
// Without Nuxt, Nitro is just a server engine: it takes this config plus the
// file-based `server/` folder and produces a portable Node/edge server.
export default defineNitroConfig({
  // Pinning a compatibility date makes builds reproducible.
  compatibilityDate: "2025-07-01",

  // STORAGE MOUNTS (powered by "unstorage").
  // Mount the "todos" namespace on the filesystem driver: now
  // useStorage("todos") persists to .data/todos on disk and survives
  // restarts — and the handler code does NOT change. Swap `driver: "fs"`
  // for "redis" / "cloudflare-kv" / "vercel-kv" to change backends with
  // zero code edits. That decoupling is one of Nitro's headline features.
  storage: {
    todos: { driver: "fs", base: "./.data/todos" },
  },
});
