import { defineHandler } from "nitro";
import { useStorage } from "nitro/storage";

/**
 * A persistent counter with zero infrastructure.
 *
 * useStorage() is unstorage: one API, ~20 drivers.
 * Swap fs -> Redis -> Cloudflare KV -> S3 -> Vercel KV
 * by changing nitro.config.ts, never this file.
 */
export default defineHandler(async () => {
  const store = useStorage("data");

  const current = (await store.getItem<number>("visits")) ?? 0;
  const next = current + 1;
  await store.setItem("visits", next);

  return { visits: next, driver: "swappable via config, not code" };
});
