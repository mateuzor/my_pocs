import { selector, selectorFamily } from 'recoil';
import { recoilCountAtom, recoilNameAtom } from './atoms';

// selector computes derived state from atoms — memoized, updates automatically
// Equivalent to Jotai's derived read-only atom
export const greetingSelector = selector<string>({
  key: 'greetingSelector',
  get: ({ get }) => {
    // get() reads an atom and registers it as a dependency
    const name = get(recoilNameAtom);
    const count = get(recoilCountAtom);
    return `Hello, ${name}! You clicked ${count} times.`;
  },
});

export const doubledCountSelector = selector<number>({
  key: 'doubledCount',
  get: ({ get }) => get(recoilCountAtom) * 2,
});

// selectorFamily creates a parameterized selector factory
// Like a selector that takes an argument — one cached result per unique param
export const multipliedCountSelector = selectorFamily<number, number>({
  key: 'multipliedCount',
  get: (multiplier) => ({ get }) => get(recoilCountAtom) * multiplier,
});
