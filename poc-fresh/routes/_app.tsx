import { type PageProps } from "$fresh/server.ts";

// _app.tsx is the ROOT WRAPPER for every route — analogous to Next's app/layout.tsx
// or Astro's layouts. It receives the page Component as a prop and renders it
// inside the full <html> document.
// Use this for the <head>, global stylesheets, body wrappers, theme providers.
//
// STATIC ASSETS: anything under static/ is served as-is at the URL matching
// its path. static/logo.svg → /logo.svg, static/styles.css → /styles.css.
// No build step, no copy, no manifest entry — just drop the file in static/.

export default function App({ Component }: PageProps) {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Fresh POC</title>
        {/* Both URLs map to files in static/ */}
        <link rel="stylesheet" href="/styles.css" />
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
      </head>
      <body>
        <Component />
      </body>
    </html>
  );
}
