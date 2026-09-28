/// <reference types="vitest" />
import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  // Multi-page build: one HTML per variant so each can be audited by URL.
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        bad: resolve(__dirname, 'bad.html'),
        good: resolve(__dirname, 'good.html'),
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['tests/unit/**/*.test.ts'],
  },
});
