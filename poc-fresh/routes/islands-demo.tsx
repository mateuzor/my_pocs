import Counter from "../islands/Counter.tsx";
import Search from "../islands/Search.tsx";
import SharedCounter from "../islands/SharedCounter.tsx";

// MULTIPLE ISLANDS on the same page.
// Two patterns to demonstrate:
//   1. ISOLATED STATE — each island instance has its own useState
//   2. SHARED STATE   — module-level signal observed across instances

export default function IslandsDemo() {
  return (
    <main style={{ fontFamily: "system-ui, sans-serif", padding: "2rem", maxWidth: 720 }}>
      <h1>Multiple islands on one page</h1>

      <h2>1. Isolated state (useState per instance)</h2>
      <p style={{ color: "#555", fontSize: "0.9rem" }}>
        Two Counters. Each has its own state — incrementing one does NOT affect the other.
      </p>
      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
        <Counter />
        <Counter />
      </div>

      <h2>2. Shared state via module-level signal</h2>
      <p style={{ color: "#555", fontSize: "0.9rem" }}>
        Two SharedCounters. They read/write the same signal — change one,
        the other re-renders automatically.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "2rem" }}>
        <SharedCounter label="A" />
        <SharedCounter label="B" />
      </div>

      <h2>3. Island with serializable props</h2>
      <p style={{ color: "#555", fontSize: "0.9rem" }}>
        Props passed from the server (this static page) into an island.
        They're embedded as JSON in the HTML — must be serializable.
      </p>
      <Search
        placeholder="Search frameworks..."
        suggestions={["React", "Vue", "Svelte", "Solid", "Preact", "Angular", "Qwik"]}
      />

      <p style={{ marginTop: "2rem" }}><a href="/">← Home</a></p>
    </main>
  );
}
