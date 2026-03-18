import { useDispatch, useSelector } from 'react-redux';
import { addItem, removeItem, updateQuantity, clearCart, selectCartItems, selectCartTotal } from './cart-slice';

const PRODUCTS = [
  { id: 1, name: 'React Book', price: 29 },
  { id: 2, name: 'TypeScript Course', price: 49 },
  { id: 3, name: 'VS Code Theme', price: 9 },
];

export function Cart() {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);

  return (
    <div style={{ padding: '1.5rem', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '1rem' }}>
      <h3>Shopping Cart</h3>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {PRODUCTS.map((p) => (
          <button key={p.id} onClick={() => dispatch(addItem(p))} style={{ padding: '0.4rem 0.75rem' }}>
            + {p.name} (${p.price})
          </button>
        ))}
      </div>

      {items.length === 0 ? (
        <p style={{ color: '#aaa' }}>Cart is empty</p>
      ) : (
        <>
          {items.map((item) => (
            <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>
              <span style={{ flex: 1 }}>{item.name}</span>
              <input
                type="number"
                value={item.quantity}
                min={1}
                onChange={(e) => dispatch(updateQuantity({ id: item.id, quantity: Number(e.target.value) }))}
                style={{ width: '50px', padding: '0.25rem' }}
              />
              <span>${(item.price * item.quantity).toFixed(2)}</span>
              <button onClick={() => dispatch(removeItem(item.id))}>✕</button>
            </div>
          ))}
          <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
            <span>Total: ${total.toFixed(2)}</span>
            <button onClick={() => dispatch(clearCart())}>Clear Cart</button>
          </div>
        </>
      )}
    </div>
  );
}
