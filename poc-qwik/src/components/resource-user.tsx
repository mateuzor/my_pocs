import { component$, Resource, useResource$, useSignal } from '@builder.io/qwik';

export const ResourceUser = component$(() => {
  const userId = useSignal(1);

  // useResource$ — async work that re-runs when a tracked signal changes.
  // cleanup() lets us abort a stale request when userId changes again quickly.
  const userResource = useResource$<{ id: number; name: string }>(async ({ track, cleanup }) => {
    const id = track(() => userId.value);
    const controller = new AbortController();
    cleanup(() => controller.abort());
    await new Promise((r) => setTimeout(r, 500));
    return { id, name: `User ${id}` };
  });

  return (
    <section>
      <button onClick$={() => userId.value++}>load next (#{userId.value})</button>
      {/* <Resource> renders the pending / resolved / rejected branch for you. */}
      <Resource
        value={userResource}
        onPending={() => <p>loading…</p>}
        onRejected={(err) => <p>error: {String(err)}</p>}
        onResolved={(u) => (
          <p>
            #{u.id} — {u.name}
          </p>
        )}
      />
    </section>
  );
});
