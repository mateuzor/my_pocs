import { useEffect, useState, useMemo, useCallback, useReducer } from "react";

function reducerCounter(state: number, action: { type: string }) {
  switch (action.type) {
    case "ADD_1":
      return state + 1;
    case "SUBTRACT_1":
      return state - 1;
    case "MULTIPLE_10":
      return state * 10;
    default:
      throw new Error("Invalid Action");
  }
}

function Counter() {
  const [count, setCount] = useState(0);
  const [calc, setCalc] = useState(() => 423789 * 234798);
  // we can pass a function to avoid being calculated every time the component updates

  const [counter, dispatchCounter] = useReducer(reducerCounter, 0);

  const result = useMemo(() => {
    console.log("useMemo");
    982738973947239 * 479847234982;
  }, []);
  //use to memoize values that we dont want to be recreated in which render

  const increaseCounter = useCallback(() => {
    console.log("increase counter callback");
  }, []);

  useEffect(() => {
    console.log("render");
  }, []);

  useEffect(() => {
    console.log("it was mounted");
  }, [count]);

  useEffect(() => {
    return () => {
      console.log("it was unmounted");
    };
  }, []); // we can use the unmount as a clean up to cancel
  //fetch requests, or remove a event listener for example

  return (
    <>
      <button
        type="button"
        onClick={() => setCount((prevCount) => prevCount + 1)}
        //good practice to pass a callback with the previous state when using the own
        //state being updated to avoid desync
      >
        count is: {count}
      </button>
      <br />
      <div style={{ display: "flex" }}>
        <button onClick={() => dispatchCounter({ type: "ADD_1" })}>
          Add 1
        </button>
        <button onClick={() => dispatchCounter({ type: "SUBTRACT_1" })}>
          Subtract 1
        </button>
        <button onClick={() => dispatchCounter({ type: "MULTIPLE_10" })}>
          Multiple per 10
        </button>
      </div>
      {counter}
    </>
  );
}

export default Counter;
