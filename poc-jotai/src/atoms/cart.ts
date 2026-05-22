import { atom } from 'jotai';

// Jotai is built around ATOMS — tiny units of state.
// An atom is just a primitive value (or a computed function) that any
// component can subscribe to via useAtom. No store, no reducers, no Provider
// hierarchy by default. Atoms behave like useState, but their value can be
// shared by any component on the tree.

interface CartItem {
  id: number;
  name: string;
  price: number;
  qty: number;
}

// PRIMITIVE ATOM — like useState, but the state lives outside the component.
// Multiple components can read and write this atom; they all stay in sync.
export const cartItemsAtom = atom<CartItem[]>([
  { id: 1, name: 'Mechanical keyboard', price: 149, qty: 1 },
  { id: 2, name: 'Wireless mouse', price: 49, qty: 2 },
]);

// DERIVED READ-ONLY ATOM — computed from other atoms.
// The function receives a `get` argument that subscribes to whatever it reads.
// When cartItemsAtom changes, this atom re-computes automatically.
// No useMemo, no useEffect, no manual recompute logic.
export const totalCountAtom = atom((get) => {
  const items = get(cartItemsAtom);
  return items.reduce((sum, item) => sum + item.qty, 0);
});

export const totalPriceAtom = atom((get) => {
  const items = get(cartItemsAtom);
  return items.reduce((sum, item) => sum + item.qty * item.price, 0);
});

// DERIVED WRITE ATOM — write-only "action" atom. Common pattern in Jotai:
// expose actions as their own atoms so consumers don't need to know the
// internal shape of state.
export const addItemAtom = atom(null, (get, set, newItem: Omit<CartItem, 'id'>) => {
  const items = get(cartItemsAtom);
  const id = Math.max(0, ...items.map((i) => i.id)) + 1;
  set(cartItemsAtom, [...items, { ...newItem, id }]);
});

export const updateQtyAtom = atom(
  null,
  (get, set, payload: { id: number; qty: number }) => {
    const items = get(cartItemsAtom);
    set(
      cartItemsAtom,
      items
        .map((i) => (i.id === payload.id ? { ...i, qty: payload.qty } : i))
        .filter((i) => i.qty > 0) // remove item when qty drops to 0
    );
  }
);
