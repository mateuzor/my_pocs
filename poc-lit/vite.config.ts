import { defineConfig } from "vite";

// Lit needs no framework plugin — custom elements are a web standard, so Vite
// just bundles plain ES modules. This is part of Lit's pitch: "no framework
// runtime, just the platform + a tiny rendering helper".
export default defineConfig({});
