import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite only handles the renderer (a normal web app). Main/preload are built by tsc.
export default defineConfig({
  root: 'src/renderer',
  // Relative base: in production the page is loaded via file://, absolute /assets would break.
  base: './',
  plugins: [react()],
  server: { port: 5173, strictPort: true },
  build: { outDir: '../../dist/renderer', emptyOutDir: true },
});
