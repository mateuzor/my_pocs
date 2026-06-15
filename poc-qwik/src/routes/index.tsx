import { component$ } from '@builder.io/qwik';

// A route is just a component$ exported as default from src/routes/**. This one
// is fully static so far — the interactive bits arrive in the next commits.
export default component$(() => {
  return (
    <main>
      <h1>Qwik POC</h1>
      <p>Resumable by default — the server ships HTML with serialized state.</p>
    </main>
  );
});
