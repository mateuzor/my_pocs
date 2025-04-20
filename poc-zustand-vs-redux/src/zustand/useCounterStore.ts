import { create } from "zustand";

interface CounterState {
  count: number;
  clicks: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
  asyncIncrement: () => void;
}

export const useCounterStore = create<CounterState>((set) => ({
  count: 0,
  clicks: 0,
  increment: () => set((s) => ({ count: s.count + 1, clicks: s.clicks + 1 })),
  decrement: () => set((s) => ({ count: s.count - 1, clicks: s.clicks + 1 })),
  reset: () => set({ count: 0, clicks: 0 }),
  asyncIncrement: () =>
    setTimeout(
      () => set((s) => ({ count: s.count + 1, clicks: s.clicks + 1 })),
      500
    ),
}));
