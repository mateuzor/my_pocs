import { Counter } from "./components/Counter";

// Root component. Composes the feature demos added across commits.
export function App() {
  return (
    <main style={{ fontFamily: "system-ui", maxWidth: 640, margin: "2rem auto" }}>
      <h1>Preact POC</h1>
      <p>
        Same JSX/hooks mental model as React, but a ~3kB runtime. Sections get
        added commit by commit.
      </p>
      <Counter />
    </main>
  );
}
