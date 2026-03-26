import { atom } from 'jotai';

// atom() creates a piece of atomic state — like useState but global and shareable across components
export const countAtom = atom(0);

export const nameAtom = atom('World');

// Derived (read-only) atom — recomputes automatically whenever its dependencies change
export const greetingAtom = atom(
  (get) => `Hello, ${get(nameAtom)}! Count: ${get(countAtom)}`
);

// Read-write derived atom — custom getter and setter
export const doubledCountAtom = atom(
  (get) => get(countAtom) * 2,
  (_get, set, newValue: number) => {
    // The setter writes back to the source atom, not to this derived atom
    set(countAtom, Math.round(newValue / 2));
  }
);
