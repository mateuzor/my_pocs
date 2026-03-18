import { createSelector } from '@reduxjs/toolkit';
import { selectCartItems } from './cart-slice';

// createSelector creates a memoized selector — it only recomputes when its inputs change
// Without memoization, derived data (like totals and grouping) would recalculate on every render

// Input selector: raw cart items (from existing selector)
// Output selector: computes summary from items
export const selectCartSummary = createSelector(
  selectCartItems, // input
  (items) => {      // output — only runs when items reference changes
    const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
    const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const mostExpensive = items.reduce(
      (max, i) => (i.price > (max?.price ?? 0) ? i : max),
      null as typeof items[0] | null
    );

    return { totalItems, totalPrice, mostExpensive };
  }
);

// Selector that filters items above a price threshold
// Takes additional argument using a factory pattern
export const makeSelectItemsAbove = (minPrice: number) =>
  createSelector(
    selectCartItems,
    (items) => items.filter((i) => i.price >= minPrice)
  );
