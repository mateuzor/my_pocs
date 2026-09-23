/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    // WHY: components need a DOM; jsdom simulates one in Node, much faster than a real browser.
    environment: 'jsdom',
    globals: true, // RTL auto-registers its cleanup only when afterEach is global
    setupFiles: ['./src/test/setup.ts'],
  },
});
