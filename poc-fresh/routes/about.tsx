// routes/about.tsx → URL: /about
// Just a default-exported component. No registration, no router config —
// the file's location IS the route.

export default function About() {
  return (
    <main style={{ fontFamily: "system-ui, sans-serif", padding: "2rem", maxWidth: 720 }}>
      <h1>About this POC</h1>
      <p>
        Fresh is built around three core ideas:
      </p>
      <ol>
        <li>
          <strong>File-based routing</strong> — every file under <code>routes/</code> is a URL.
        </li>
        <li>
          <strong>Server-side rendering by default</strong> — pages render to HTML on the server,
          no client-side JS unless you explicitly opt in.
        </li>
        <li>
          <strong>Islands</strong> — small interactive components hydrated in isolation,
          so only the JS you need gets shipped.
        </li>
      </ol>
      <p><a href="/">← Back home</a></p>
    </main>
  );
}
