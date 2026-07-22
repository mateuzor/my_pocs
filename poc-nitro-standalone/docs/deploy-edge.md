# Deploy: edge presets (Cloudflare / Vercel / Netlify / Deno)

The same handlers run on edge runtimes — Nitro swaps Node APIs for the
platform's Web-standard runtime **at build time**, so your code is untouched.

```bash
NITRO_PRESET=cloudflare_module npm run build   # Cloudflare Workers
NITRO_PRESET=vercel            npm run build   # Vercel Functions
NITRO_PRESET=netlify           npm run build   # Netlify Functions
NITRO_PRESET=deno_deploy       npm run build   # Deno Deploy
```

- No code changes: routes, plugins, and `useStorage()` stay identical.
- Point the storage mount at an edge KV (`cloudflare-kv`, `vercel-kv`) via
  config — again, no handler edits.
- 15+ presets ship built-in; pin one with `preset: "..."` in `nitro.config.ts`.

This "write once, deploy anywhere" story is the single strongest reason to
reach for Nitro.
