import React from "react";
import DebounceInput from "./components/DebounceInput";
import ThrottleScroll from "./components/ThrottleScroll";

export default function App() {
  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>Debounce vs Throttle</h1>
      <DebounceInput />
      <ThrottleScroll />
    </div>
  );
}
