import { atom } from 'recoil';

// atom() in Recoil works like Jotai — a piece of global state
// Key difference from Jotai: every atom requires a unique string key
// The key is used for debugging, persistence, and DevTools identification
export const recoilCountAtom = atom<number>({
  key: 'recoilCount',   // must be globally unique across your entire app
  default: 0,           // initial value
});

export const recoilNameAtom = atom<string>({
  key: 'recoilName',
  default: 'World',
});

// Recoil atoms support effects — side effects that run on mount/change
// Common uses: localStorage sync, logging, WebSocket subscriptions
export const persistedCountAtom = atom<number>({
  key: 'persistedCount',
  default: 0,
  effects: [
    ({ onSet, setSelf }) => {
      // Read initial value from localStorage on mount
      const saved = localStorage.getItem('recoil-count');
      if (saved !== null) setSelf(Number(saved));

      // Persist to localStorage whenever the atom changes
      onSet((newValue) => {
        localStorage.setItem('recoil-count', String(newValue));
      });
    },
  ],
});
