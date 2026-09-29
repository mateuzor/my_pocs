import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: { include: ['consumer/test/**/*.test.ts'], testTimeout: 30000 },
});
