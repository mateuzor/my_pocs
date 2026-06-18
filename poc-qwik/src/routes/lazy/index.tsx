import { $, component$, useSignal } from '@builder.io/qwik';

export default component$(() => {
  const result = useSignal('');

  // $() wraps a function into a QRL — a *lazy reference* the optimizer extracts
  // into its own chunk. The function's code isn't downloaded until it's first
  // invoked (here, on click). This is the same mechanism behind component$/
  // onClick$ — manual, explicit code-splitting with zero bundler config.
  const computeHeavy = $((n: number) =>
    Array.from({ length: n }, (_, i) => i).reduce((a, b) => a + b, 0)
  );

  return (
    <main>
      <h1>Granular code-splitting</h1>
      <p>The compute function lives in its own chunk, fetched on first click.</p>
      <button
        onClick$={async () => {
          result.value = String(await computeHeavy(1000));
        }}
      >
        run heavy compute
      </button>
      {result.value && <p>sum 0..999 = {result.value}</p>}
    </main>
  );
});
