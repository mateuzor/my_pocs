import { useSelector } from 'react-redux';
import { selectCartSummary, makeSelectItemsAbove } from './cart-selectors';
import { useMemo } from 'react';

export function CartSummary() {
  const { totalItems, totalPrice, mostExpensive } = useSelector(selectCartSummary);

  // Factory selector — create once with useMemo so it's stable across renders
  const selectPremiumItems = useMemo(() => makeSelectItemsAbove(20), []);
  const premiumItems = useSelector(selectPremiumItems);

  return (
    <div style={{ padding: '1.5rem', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '1rem' }}>
      <h3>Cart Summary (createSelector)</h3>
      <p style={{ color: '#555', fontSize: '0.9rem' }}>Derived state — only recomputes when cart items change.</p>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li>Total items in cart: <strong>{totalItems}</strong></li>
        <li>Total price: <strong>${totalPrice.toFixed(2)}</strong></li>
        <li>Most expensive: <strong>{mostExpensive?.name ?? '—'}</strong></li>
        <li>Premium items (&gt;$20): <strong>{premiumItems.map(i => i.name).join(', ') || '—'}</strong></li>
      </ul>
    </div>
  );
}
