import { defineConfig } from "vite";
import preact from "@preact/preset-vite";

// @preact/preset-vite wires up the JSX transform AND aliases react/react-dom
// to preact/compat, so React-only libraries keep working on top of Preact's
// ~3kB runtime. That alias is the whole reason "drop-in React replacement"
// is possible.
export default defineConfig({
  plugins: [preact()],
});
