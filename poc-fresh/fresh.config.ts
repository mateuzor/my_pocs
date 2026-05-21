import { defineConfig } from "$fresh/server.ts";
import { bannerPlugin } from "./plugins/banner.ts";

// Plugins are registered here. Order matters: render() hooks run sequentially,
// so an earlier plugin's injected scripts appear before later ones in <head>.
export default defineConfig({
  plugins: [bannerPlugin],
});
