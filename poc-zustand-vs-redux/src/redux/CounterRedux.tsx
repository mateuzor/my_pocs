import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "./store";
import Counter from "../components/Counter";
import { increment, decrement, reset, incrementAsync } from "./counterSlice";

export default function CounterRedux() {
  const { count, clicks } = useSelector((state: RootState) => state.counter);
  const dispatch = useDispatch<AppDispatch>();

  return (
    <>
      <h3>Redux Counter</h3>
      <Counter
        count={count}
        clicks={clicks}
        increment={() => dispatch(increment())}
        decrement={() => dispatch(decrement())}
        reset={() => dispatch(reset())}
        asyncIncrement={() => dispatch(incrementAsync())}
      />
    </>
  );
}
