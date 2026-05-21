import { type Plugin } from "$fresh/server.ts";

// Fresh PLUGINS extend the framework. A plugin can:
//   - inject scripts/styles into every rendered page (via render())
//   - register middlewares that run on every request
//   - declare its own routes (e.g. /_health)
//   - register islands shipped by the plugin
//
// This minimal plugin demonstrates the inject-script pattern.
// Real plugins: @twind, fresh-tailwind, fresh-seo, fresh-charts.

export const bannerPlugin: Plugin = {
  name: "console-banner",

  // render() runs after the page is rendered server-side.
  // We return scripts to be injected into the resulting HTML.
  render(ctx) {
    ctx.render(); // must call before returning

    return {
      scripts: [
        {
          // The browser runs this small inline script on every page load.
          // Useful for: analytics shims, feature flags, version stamps.
          entrypoint: "main",
          state: { greeting: "Hello from the banner plugin" },
        },
      ],
    };
  },
};
