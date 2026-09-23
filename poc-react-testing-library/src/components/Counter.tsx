import { useCounter } from '../hooks/useCounter';

export function Counter() {
  const { count, increment, decrement, reset } = useCounter();
  return (
    <section aria-label="counter">
      <p>
        Count: <output>{count}</output>
      </p>
      <button onClick={decrement}>Decrement</button>
      <button onClick={increment}>Increment</button>
      <button onClick={reset}>Reset</button>
    </section>
  );
}
