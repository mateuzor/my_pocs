// nitro.config.ts is the single source of truth for a STANDALONE Nitro app.
// Without Nuxt, Nitro is just a server engine: it takes this config plus the
// file-based `server/` folder and produces a portable Node/edge server.
//
// `defineNitroConfig` is auto-imported by Nitro's build — no import needed.
export default defineNitroConfig({
  // Pinning a compatibility date makes builds reproducible: Nitro locks its
  // default behaviour to the state it had on this date, so upgrades never
  // silently change how the server behaves.
  compatibilityDate: "2025-07-01",

  // Nitro's dev server prints a nice startup banner and route list.
  // Everything else (routing, storage, presets) is discovered from files.
});
