import { component$, useComputed$, useSignal, useTask$ } from '@builder.io/qwik';

export const ComputedTask = component$(() => {
  const celsius = useSignal(20);

  // useComputed$ — a DERIVED, memoized signal. Recomputes only when a signal it
  // read (celsius) changes. Synchronous and pure; no side effects here.
  const fahrenheit = useComputed$(() => (celsius.value * 9) / 5 + 32);

  const log = useSignal('');

  // useTask$ — runs once on the SERVER during SSR, then re-runs whenever a
  // tracked signal changes. track() declares the dependency. This is the place
  // for side effects / async work reacting to state.
  useTask$(({ track }) => {
    const f = track(() => fahrenheit.value);
    log.value = `fahrenheit is now ${f}`;
  });

  return (
    <section>
      <input
        type="number"
        value={celsius.value}
        onInput$={(_, el) => (celsius.value = Number(el.value))}
      />
      <p>
        {celsius.value}°C = {fahrenheit.value}°F
      </p>
      <p>
        <small>{log.value}</small>
      </p>
    </section>
  );
});
