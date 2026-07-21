# Deploy: `static` preset

Prerender the whole app to static files and host it on any static host
(GitHub Pages, S3, nginx, a CDN).

```bash
NITRO_PRESET=static npm run build   # -> .output/public/
```

- Requires every served route to be prerenderable (see the `prerender` block
  in `nitro.config.ts`).
- Zero server cost at runtime; everything is plain files behind a CDN.
- Great for docs sites, landing pages, and mostly-read content.
