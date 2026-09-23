import { act, renderHook } from '@testing-library/react';
import { useCounter } from './useCounter';

describe('useCounter', () => {
  // WHY: renderHook mounts a throwaway component so hooks obey the rules of hooks.
  it('starts with the initial value', () => {
    const { result } = renderHook(() => useCounter(5));
    expect(result.current.count).toBe(5);
  });

  // WHY: state updates outside user events must be wrapped in act() so React flushes them before asserting.
  it('increments and decrements by step', () => {
    const { result } = renderHook(() => useCounter(0, 2));
    act(() => result.current.increment());
    act(() => result.current.increment());
    act(() => result.current.decrement());
    expect(result.current.count).toBe(2);
  });

  it('resets to the initial value', () => {
    const { result } = renderHook(() => useCounter(10));
    act(() => result.current.increment());
    act(() => result.current.reset());
    expect(result.current.count).toBe(10);
  });

  it('reacts to changed props via rerender', () => {
    const { result, rerender } = renderHook(({ step }) => useCounter(0, step), { initialProps: { step: 1 } });
    rerender({ step: 10 });
    act(() => result.current.increment());
    expect(result.current.count).toBe(10);
  });
});
