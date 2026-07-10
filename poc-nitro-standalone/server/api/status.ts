// Nested folders build nested URLs — no router table anywhere.
// This file at `server/api/status.ts` is served as `GET /api/status`.
// The `/api` segment is just a folder name; the filesystem IS the router.
export default defineEventHandler(() => ({
  status: "ok",
  uptime: Math.round(process.uptime()),
}));
