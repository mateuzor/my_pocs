import { signal } from "@preact/signals";

// SIGNALS are Preact's fine-grained reactivity primitive.
// A `signal` declared at MODULE SCOPE is shared by every island that imports it,
// even across different island INSTANCES — they all observe the same value.
//
// This is how you share state across islands without React Context or stores.
// Compare to a plain `let count = 0` (which would also be shared) — but signals
// also trigger reactive re-renders in the components that read them.

// Module-level shared signal — both instances of this component see the same value.
const sharedCount = signal(0);

interface Props {
  label: string;
}

export default function SharedCounter({ label }: Props) {
  return (
    <div style={{
      padding: "0.75rem 1rem",
      border: "1px solid #cbd5e0",
      borderRadius: "8px",
      background: "#fff",
      display: "flex",
      alignItems: "center",
      gap: "0.75rem",
    }}>
      <span style={{ fontSize: "0.85rem", color: "#718096", minWidth: 60 }}>{label}</span>
      <button onClick={() => sharedCount.value--}>−</button>
      {/* Reading `.value` in JSX subscribes this component to changes */}
      <strong style={{ minWidth: 30, textAlign: "center" }}>{sharedCount}</strong>
      <button onClick={() => sharedCount.value++}>+</button>
    </div>
  );
}
