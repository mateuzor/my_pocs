// A conventional health / metrics endpoint. Because every handler already
// has access to process + per-request context, lightweight observability is
// almost free. Pair with `routeRules: { "/health": { cache: false } }` to
// keep it uncached.
export default defineEventHandler(() => ({
  status: "ok",
  uptime: Math.round(process.uptime()),
  memoryMB: Math.round(process.memoryUsage().rss / 1024 / 1024),
  node: process.version,
}));
