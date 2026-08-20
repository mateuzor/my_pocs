import { defineConfig } from 'vitest/config';

// On Node 18, the Web Crypto API isn't exposed as a global inside vitest's
// worker threads (only on the main thread) — `hono/jwt` and our own
// requestId middleware both call `crypto.subtle` / `crypto.randomUUID()`
// at the global scope, so tests need this tiny polyfill to run at all.
export default defineConfig({
  test: {
    setupFiles: ['./vitest.setup.ts'],
  },
});
