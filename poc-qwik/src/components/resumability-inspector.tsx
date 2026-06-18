import { component$, useStore, useTask$ } from '@builder.io/qwik';
import { isServer } from '@builder.io/qwik/build';

// Makes resumability tangible. The task below runs ONLY on the server during
// SSR; the values it computes are serialized into the HTML and the client
// resumes from them — without ever re-running this task. Proof: the seed stays
// identical between the server-rendered HTML and the live page.
export const ResumabilityInspector = component$(() => {
  const state = useStore({ computedOn: 'pending', seed: 0 });

  useTask$(() => {
    if (isServer) {
      state.computedOn = 'server';
      state.seed = Math.floor(Math.random() * 1000);
    }
  });

  return (
    <section>
      <p>state.computedOn = {state.computedOn}</p>
      <p>seed (set on server, resumed on client) = {state.seed}</p>
      <p>
        <small>
          View page source and find &lt;script type="qwik/json"&gt; — that's the
          serialized state the client resumes from (no hydration pass).
        </small>
      </p>
    </section>
  );
});
