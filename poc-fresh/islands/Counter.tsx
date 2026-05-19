import { useState } from "preact/hooks";

// This file lives under islands/, which is the MAGIC FOLDER in Fresh.
// Everything inside islands/ is automatically:
//   1. rendered on the server as static HTML (initial paint)
//   2. then hydrated on the client as an interactive component
//
// Components OUTSIDE islands/ (the ones in routes/ or components/) ship ZERO JS.
// Only the islands you actually USE on a page get bundled and sent to the browser.
//
// This is the core idea — "islands architecture": small interactive widgets
// floating in a sea of static HTML. Compare to a typical React SPA where the
// entire app hydrates as one giant tree.

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div style={{
      padding: "1rem",
      border: "1px solid #cbd5e0",
      borderRadius: "8px",
      background: "#fff",
      maxWidth: 280,
    }}>
      <p style={{ margin: "0 0 0.5rem", fontSize: "0.85rem", color: "#718096" }}>
        Interactive island
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <button onClick={() => setCount(c => c - 1)}>−</button>
        <strong style={{ fontSize: "1.25rem", minWidth: 30, textAlign: "center" }}>
          {count}
        </strong>
        <button onClick={() => setCount(c => c + 1)}>+</button>
      </div>
    </div>
  );
}
