import { defineHandler } from "nitro";

/**
 * A completely normal, uncached-looking handler.
 *
 * The caching lives in nitro.config.ts:
 *   "/api/time": { swr: 10 }
 *
 * Nitro wraps this handler in defineCachedHandler at build time.
 * The clock freezes for 10 seconds. This file knows nothing about it.
 */
export default defineHandler(() => {
  return { now: new Date().toISOString() };
});
