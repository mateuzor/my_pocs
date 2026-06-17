import { component$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';

// src/routes/about/index.tsx → the /about route. File path = URL, no config.
export default component$(() => {
  return (
    <main>
      <h1>About</h1>
      <p>Another file-based route, wrapped by the shared layout.</p>
    </main>
  );
});

// Per-route document head (title/meta) — merged by Qwik City during SSR.
export const head: DocumentHead = {
  title: 'About — Qwik POC',
};
