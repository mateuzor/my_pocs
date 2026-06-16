import { component$, useSignal } from '@builder.io/qwik';

// Every component$ is ALSO a lazy boundary. This child's code (and its event
// handler) is a separate chunk that the browser only fetches when the user
// interacts — the parent renders on the server and stays inert until then.
export const LazyBox = component$<{ label: string }>(({ label }) => {
  const open = useSignal(false);
  return (
    <section>
      <button onClick$={() => (open.value = !open.value)}>{label}</button>
      {open.value && <p>Loaded on demand — this handler's chunk arrived on click.</p>}
    </section>
  );
});
