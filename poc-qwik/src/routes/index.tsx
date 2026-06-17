import { component$, useSignal } from '@builder.io/qwik';
import { LazyBox } from '../components/lazy-box';
import { StoreCart } from '../components/store-cart';
import { ComputedTask } from '../components/computed-task';
import { ResourceUser } from '../components/resource-user';

export default component$(() => {
  // useSignal = a reactive value. Reading count.value in JSX subscribes that
  // spot in the DOM; writing it updates only that spot — no virtual-DOM diff.
  const count = useSignal(0);

  return (
    <main>
      <h1>Qwik POC</h1>
      <p>Resumable by default — the server ships HTML with serialized state.</p>

      <h2>Lazy event handler</h2>
      <p>count: {count.value}</p>
      {/* onClick$ — the `$` makes this handler a SEPARATE lazy chunk. The JS for
          the click is NOT downloaded on load; it's fetched the instant you click
          (Qwik prefetches it in the background). That's why initial JS ≈ 0. */}
      <button onClick$={() => count.value++}>+1</button>

      <h2>Lazy child component</h2>
      <LazyBox label="toggle details" />

      <h2>Deep reactive store</h2>
      <StoreCart />

      <h2>Computed + task</h2>
      <ComputedTask />

      <h2>Async resource</h2>
      <ResourceUser />
    </main>
  );
});
