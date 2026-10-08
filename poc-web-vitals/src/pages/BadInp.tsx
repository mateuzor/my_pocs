import { useState } from 'react';

function blockMainThread(ms: number) {
  const end = performance.now() + ms;
  while (performance.now() < end) {
    /* busy wait */
  }
}

// Causes poor INP: the click handler does synchronous work, so the next
// paint is delayed. Fix: split work, yield (scheduler.yield/setTimeout) or move to a worker.
export function BadInp() {
  const [clicks, setClicks] = useState(0);
  return (
    <section>
      <h2>Slow interaction</h2>
      <button
        onClick={() => {
          blockMainThread(600);
          setClicks((c) => c + 1);
        }}
      >
        Heavy click ({clicks})
      </button>
    </section>
  );
}
