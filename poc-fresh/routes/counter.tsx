import Counter from "../islands/Counter.tsx";

// This PAGE is mostly static — the <h1>, paragraphs, and lists are rendered
// on the server and ship as plain HTML. Only the <Counter /> island ships
// the ~3kB of JS needed to make THAT widget interactive.
//
// Important: islands are imported and used like normal Preact components.
// Fresh detects that the import comes from islands/ and treats it specially.
// Props passed to islands must be JSON-serializable (they get embedded in HTML).

export default function CounterPage() {
  return (
    <main style={{ fontFamily: "system-ui, sans-serif", padding: "2rem", maxWidth: 720 }}>
      <h1>Islands architecture</h1>
      <p>
        Everything you see here EXCEPT the counter below is static HTML.
        Open DevTools → Network: you'll see one tiny JS chunk for the island,
        not a full SPA bundle.
      </p>

      <Counter />

      <p style={{ marginTop: "2rem", color: "#555", fontSize: "0.9rem" }}>
        If we deleted the import above, the page would ship <strong>zero JavaScript</strong>.
      </p>

      <h3>What's static vs what's an island?</h3>
      <ul>
        <li>This whole paragraph — static SSR, never hydrated</li>
        <li>The headings — static SSR</li>
        <li>The Counter component — server-rendered HTML + 3kB of hydration JS</li>
      </ul>

      <p><a href="/">← Home</a></p>
    </main>
  );
}
