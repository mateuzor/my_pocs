import { LocationProvider, Router, Route, lazy, ErrorBoundary } from "preact-iso";
import { Home } from "./pages/Home";

// ROUTING with preact-iso — the official, tiny isomorphic router.
// - LocationProvider exposes the current URL via context.
// - Router renders the first <Route> whose `path` matches.
// - `lazy()` code-splits a route: the About chunk is only fetched when visited.
const About = lazy(() => import("./pages/About").then((m) => ({ default: m.About })));

export function App() {
  return (
    <LocationProvider>
      <main style={{ fontFamily: "system-ui", maxWidth: 640, margin: "2rem auto" }}>
        <h1>Preact POC</h1>
        <nav style={{ display: "flex", gap: "1rem" }}>
          {/* Plain <a> works: preact-iso intercepts same-origin clicks for SPA nav. */}
          <a href="/">Home</a>
          <a href="/about">About</a>
        </nav>

        {/* ErrorBoundary also acts as the Suspense fallback boundary for lazy routes. */}
        <ErrorBoundary>
          <Router>
            <Route path="/" component={Home} />
            <Route path="/about" component={About} />
            <Route default component={() => <p>404 — not found</p>} />
          </Router>
        </ErrorBoundary>
      </main>
    </LocationProvider>
  );
}
