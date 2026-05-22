import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import {
  cartItemsAtom,
  totalCountAtom,
  totalPriceAtom,
  addItemAtom,
  updateQtyAtom,
} from '../atoms/cart';

// THREE READ/WRITE HOOKS in Jotai:
//   useAtom(atom)       → [value, setter] — same shape as useState
//   useAtomValue(atom)  → read-only — skips the write subscription
//   useSetAtom(atom)    → write-only — useful for action atoms (no re-render
//                        when the underlying value changes)
//
// Using the right hook matters for performance:
// a component that only writes (e.g. a button) should use useSetAtom so it
// doesn't re-render when the value changes.

export function Cart() {
  const items = useAtomValue(cartItemsAtom);          // read-only
  const totalCount = useAtomValue(totalCountAtom);    // derived
  const totalPrice = useAtomValue(totalPriceAtom);    // derived
  const addItem = useSetAtom(addItemAtom);            // write-only action
  const updateQty = useSetAtom(updateQtyAtom);

  return (
    <section style={{ marginBottom: '2rem' }}>
      <h2>Cart ({totalCount} items)</h2>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {items.map((item) => (
          <li
            key={item.id}
            style={{
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'center',
              padding: '0.5rem 0',
              borderBottom: '1px solid #eee',
            }}
          >
            <span style={{ flex: 1 }}>
              <strong>{item.name}</strong> — ${item.price}
            </span>
            <button onClick={() => updateQty({ id: item.id, qty: item.qty - 1 })}>
              −
            </button>
            <span style={{ minWidth: 24, textAlign: 'center' }}>{item.qty}</span>
            <button onClick={() => updateQty({ id: item.id, qty: item.qty + 1 })}>
              +
            </button>
          </li>
        ))}
      </ul>

      <p>
        <strong>Total: ${totalPrice.toFixed(2)}</strong>
      </p>

      <button
        onClick={() => addItem({ name: 'USB-C Hub', price: 79, qty: 1 })}
      >
        Add USB-C Hub
      </button>
    </section>
  );
}

// SEPARATE COMPONENT consuming ONLY the derived atoms.
// Notice this component re-renders when items change, but it doesn't import
// `cartItemsAtom` directly — it depends on the DERIVATIONS. This is good
// encapsulation; the rest of the app doesn't know how totals are computed.
export function CartBadge() {
  const totalCount = useAtomValue(totalCountAtom);
  return (
    <span
      style={{
        background: '#4299e1',
        color: 'white',
        padding: '2px 10px',
        borderRadius: '12px',
        fontSize: '0.85rem',
      }}
    >
      🛒 {totalCount}
    </span>
  );
}

// Component using the read/write tuple — like useState
export function FirstItemEditor() {
  const [items, setItems] = useAtom(cartItemsAtom);
  if (items.length === 0) return null;

  return (
    <div>
      <label>
        Edit first item name:{' '}
        <input
          value={items[0].name}
          onChange={(e) =>
            setItems(items.map((it, i) => (i === 0 ? { ...it, name: e.target.value } : it)))
          }
        />
      </label>
    </div>
  );
}
