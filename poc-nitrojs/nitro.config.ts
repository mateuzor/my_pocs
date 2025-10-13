import { defineNitroConfig } from 'nitropack/config'

export default defineNitroConfig({
  srcDir: 'server',
  preset: 'node-server',
  compatibilityDate: '2024-11-01',
  // Storage note: using useStorage("data") writes to .data/kv locally by default
  // For production (e.g., Vercel KV), swap storage driver accordingly.
  routeRules: {
    // example: cache all GET /stats for 60s (see server/routes/stats.cached.get.ts)
    '/stats': { cache: { maxAge: 60 } }
  }
})
