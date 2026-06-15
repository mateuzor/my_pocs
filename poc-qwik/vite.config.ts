import { defineConfig } from 'vite';
import { qwikVite } from '@builder.io/qwik/optimizer';
import { qwikCity } from '@builder.io/qwik-city/vite';

// qwikVite runs the OPTIMIZER: it splits every `$` boundary (component$, onClick$…)
// into its own lazily-loadable chunk. qwikCity adds the file-based router + SSR.
export default defineConfig(() => {
  return {
    plugins: [qwikCity(), qwikVite()],
  };
});
