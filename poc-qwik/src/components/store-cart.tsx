import { component$, useStore } from '@builder.io/qwik';

interface CartItem {
  name: string;
  qty: number;
}

// useStore creates a DEEP reactive proxy: nested object props and array
// mutations are tracked (unlike useSignal, which wraps a single .value). Reading
// a field subscribes only the JSX that reads it.
export const StoreCart = component$(() => {
  const cart = useStore<{ items: CartItem[] }>({ items: [] });

  return (
    <section>
      <button onClick$={() => cart.items.push({ name: `item ${cart.items.length + 1}`, qty: 1 })}>
        add item
      </button>
      <ul>
        {cart.items.map((it, i) => (
          <li key={i}>
            {it.name} ×{it.qty}
            {/* mutating a nested property is tracked thanks to the deep proxy */}
            <button onClick$={() => it.qty++}>+</button>
          </li>
        ))}
      </ul>
      <p>distinct items: {cart.items.length}</p>
    </section>
  );
});
