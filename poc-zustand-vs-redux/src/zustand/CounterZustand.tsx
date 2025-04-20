import Counter from "../components/Counter";
import { useCounterStore } from "./useCounterStore";

export default function CounterZustand() {
  const { count, clicks, increment, decrement, reset, asyncIncrement } =
    useCounterStore();
  return (
    <>
      <h3>Zustand Counter</h3>
      <Counter
        {...{ count, clicks, increment, decrement, reset, asyncIncrement }}
      />
    </>
  );
}
