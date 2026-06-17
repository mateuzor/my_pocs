import { component$ } from '@builder.io/qwik';
import { routeLoader$ } from '@builder.io/qwik-city';

// routeLoader$ runs ON THE SERVER before the route renders. Its result is
// serialized into the HTML (so it's resumable) and exposed via the hook below.
// `params` comes from the [id] folder segment.
export const useUser = routeLoader$(async ({ params }) => {
  await new Promise((r) => setTimeout(r, 200));
  return { id: params.id, name: `User ${params.id}` };
});

export default component$(() => {
  const user = useUser(); // a readonly signal of the loader's value
  return (
    <main>
      <h1>User route</h1>
      <p>
        #{user.value.id} — {user.value.name}
      </p>
    </main>
  );
});
