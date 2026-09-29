import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: { include: ['provider/test/**/*.test.ts'], testTimeout: 30000 },
});
