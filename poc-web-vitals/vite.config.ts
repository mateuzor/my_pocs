import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // Same-origin proxy so sendBeacon needs no CORS preflight.
    proxy: { '/vitals': 'http://localhost:4000' },
  },
});
