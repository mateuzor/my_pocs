import { defineConfig } from 'vite';

// GitHub Pages serves project sites under /<repo>/, so assets need that base.
// The workflow sets BASE_PATH; locally it falls back to "/".
export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
});
