import { render } from "preact";
import { App } from "./App";

// Preact has no separate "react-dom" package: `render(vnode, container)` lives
// in the core. Note we render INTO #app (no createRoot ceremony) — the whole
// runtime is a fraction of React's size.
render(<App />, document.getElementById("app")!);
