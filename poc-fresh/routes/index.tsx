// Fresh uses FILE-BASED ROUTING. The path of this file IS the URL:
//   routes/index.tsx          → /
//   routes/about.tsx          → /about
//   routes/blog/index.tsx     → /blog
//   routes/blog/[slug].tsx    → /blog/:slug
//
// Every file under routes/ that default-exports a component becomes a page.
// By default, pages render on the server and ship ZERO JavaScript to the client.
// Interactivity is opt-in through "islands" (covered in commit 3).

export default function Home() {
  return (
    <main style={{ fontFamily: "system-ui, sans-serif", padding: "2rem", maxWidth: 720 }}>
      <h1>Fresh POC</h1>
      <p>
        This page was rendered on the server. View source — you'll see the full HTML,
        no hydration script, no JS bundle.
      </p>

      <h2>Available routes</h2>
      <ul>
        <li><a href="/">/ (this page)</a></li>
        <li><a href="/about">/about</a></li>
        <li><a href="/blog">/blog (nested layout)</a></li>
        <li><a href="/blog/intro-to-fresh">/blog/[slug] (dynamic route)</a></li>
        <li><a href="/counter">/counter (interactive island)</a></li>
        <li><a href="/islands-demo">/islands-demo (multiple islands + shared signal)</a></li>
        <li><a href="/products">/products (handler + form POST)</a></li>
        <li><a href="/api/random">/api/random (JSON-only endpoint)</a></li>
        <li><a href="/admin">/admin (scoped auth middleware)</a></li>
        <li><a href="/comparison">/comparison (Fresh vs Next vs Astro)</a></li>
      </ul>

      <p style={{ color: "#666", fontSize: "0.9rem", marginTop: "2rem" }}>
        Built with Fresh — a Deno web framework with island-based partial hydration.
      </p>
    </main>
  );
}
