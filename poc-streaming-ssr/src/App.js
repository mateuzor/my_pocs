import React, { Suspense } from "react";

// Lazily load components with simulated delay to mimic async data fetching
const Fact1 = React.lazy(() => delayResolve("Chunk 1: Instant", 0));
const Fact2 = React.lazy(() => delayResolve("Chunk 2: after 2s", 2000));
const Fact3 = React.lazy(() => delayResolve("Chunk 3: after 4s", 4000));

// Simulates async module resolution (like fetching data from an API)
function delayResolve(text, ms) {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Resolve a component that renders a <p> tag with the text
      resolve({ default: () => <p>{text}</p> });
    }, ms);
  });
}

export default function App() {
  return (
    <html>
      <head>
        <title>Cat Facts</title>
      </head>
      <body>
        <h1>Stream Rendered Cat Facts!</h1>
        <div id="approot">
          {/* Suspense allows streaming: sends fallback first, then chunks as ready */}
          <Suspense fallback={<p>Loading...</p>}>
            <Fact1 />
            <Fact2 />
            <Fact3 />
          </Suspense>
        </div>
      </body>
    </html>
  );
}
