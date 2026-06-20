import { signal, computed } from "@preact/signals";

// SIGNALS — the headline feature of Preact's reactivity model.
// A signal is a reactive box: reading `.value` inside a component subscribes
// ONLY that component to changes. Unlike useState, mutating a signal does NOT
// re-run the whole component tree — Preact updates just the text nodes that
// read it. That's "fine-grained" reactivity.
//
// Signals live at module scope here, so this cart state is shared by any
// component that imports it — no Context/provider plumbing needed.
const items = signal<{ name: string; price: number }[]>([
  { name: "Whey", price: 120 },
  { name: "Creatine", price: 90 },
]);

// `computed` is a derived signal: it recalculates lazily and memoizes until
// one of the signals it reads changes. Reads like a value, stays in sync.
const total = computed(() => items.value.reduce((sum, i) => sum + i.price, 0));

function addItem() {
  // Replace the array (signals track identity) to notify subscribers.
  items.value = [...items.value, { name: "Snack", price: 15 }];
}

export function SignalsCart() {
  return (
    <section>
      <h2>Signals cart</h2>
      {/* Reading total.value here subscribes this node only. Adding an item
          updates the number without re-rendering <App/> or <Counter/>. */}
      <p>
        {items.value.length} items — total: <strong>R$ {total.value}</strong>
      </p>
      <button onClick={addItem}>add snack</button>
    </section>
  );
}
