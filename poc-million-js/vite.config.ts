import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import million from 'million/compiler';

export default defineConfig({
  plugins: [
    // The Million compiler rewrites components wrapped in block() at build time
    // into a static template + a list of dynamic holes. It must run BEFORE the
    // React plugin so it sees the original JSX.
    // auto:false keeps the comparison honest: only components we wrap are optimized.
    million.vite({ auto: false }),
    react(),
  ],
});
