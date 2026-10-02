import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite: dev server serves native ESM (no bundling), so cold start barely
// depends on app size. Production build uses Rollup.
export default defineConfig({
  plugins: [react()],
  build: { outDir: 'dist-vite' },
});
