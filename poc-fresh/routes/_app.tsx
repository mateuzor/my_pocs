import { type PageProps } from "$fresh/server.ts";

// _app.tsx is the ROOT WRAPPER for every route — analogous to Next's app/layout.tsx
// or Astro's layouts. It receives the page Component as a prop and renders it
// inside the full <html> document.
// Use this for the <head>, global stylesheets, body wrappers, theme providers.

export default function App({ Component }: PageProps) {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Fresh POC</title>
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body>
        <Component />
      </body>
    </html>
  );
}
