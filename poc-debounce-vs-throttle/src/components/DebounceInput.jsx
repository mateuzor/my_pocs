import React, { useState, useCallback } from "react";
import debounce from "../utils/debounce";

export default function DebounceInput() {
  const [count, setCount] = useState(0);

  const handleChange = useCallback(
    debounce(() => {
      setCount((prev) => prev + 1);
    }, 500),
    []
  );

  return (
    <div style={{ marginBottom: "2rem" }}>
      <h2>Debounce Input</h2>
      <input type="text" onChange={handleChange} />
      <p>Função chamada: {count}x</p>
    </div>
  );
}
