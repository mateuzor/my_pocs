// Static comparison page — pure SSR, no JS shipped.
// Renders a side-by-side table of Fresh vs Next.js vs Astro.

interface Row {
  topic: string;
  fresh: string;
  next: string;
  astro: string;
}

const ROWS: Row[] = [
  {
    topic: "Runtime",
    fresh: "Deno (V8 + native TS)",
    next: "Node.js / Edge",
    astro: "Node.js / Bun / Deno (adapter)",
  },
  {
    topic: "UI framework",
    fresh: "Preact only",
    next: "React only",
    astro: "Any (React, Vue, Svelte, Solid, Preact)",
  },
  {
    topic: "Build step",
    fresh: "None in dev — Deno runs TS directly",
    next: "Required (next dev compiles)",
    astro: "Required (Vite-powered)",
  },
  {
    topic: "Default rendering",
    fresh: "SSR, zero JS by default",
    next: "RSC + Client Components mix",
    astro: "SSG/SSR, zero JS by default",
  },
  {
    topic: "Interactivity model",
    fresh: "Islands (folder convention)",
    next: "Client Components ('use client')",
    astro: "Islands (client:* directives)",
  },
  {
    topic: "File-based routing",
    fresh: "routes/ (file = URL)",
    next: "app/ with conventions (page.tsx, route.ts)",
    astro: "pages/ + src/pages/ (file = URL)",
  },
  {
    topic: "Server-side handlers",
    fresh: "export const handler in route file",
    next: "Server Actions + Route Handlers",
    astro: "API routes (file.ts in pages/api)",
  },
  {
    topic: "Middleware",
    fresh: "_middleware.ts (per folder)",
    next: "middleware.ts (root only)",
    astro: "middleware.ts (single chain)",
  },
  {
    topic: "Configuration",
    fresh: "deno.json + fresh.config.ts",
    next: "next.config.js + tsconfig",
    astro: "astro.config.mjs",
  },
  {
    topic: "Strengths",
    fresh: "Tiny, fast, no build step in dev",
    next: "Mature ecosystem, RSC, Vercel integration",
    astro: "Multi-framework, content-first, ultra-light",
  },
];

export default function Comparison() {
  return (
    <main style={{ fontFamily: "system-ui, sans-serif", padding: "2rem", maxWidth: 1100 }}>
      <h1>Fresh vs Next.js vs Astro</h1>
      <p style={{ color: "#555" }}>
        All three are SSR-first frameworks, but each picks different trade-offs.
        The table below summarizes how their philosophies map to concrete choices.
      </p>

      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem", marginTop: "1rem" }}>
        <thead>
          <tr style={{ background: "#f7fafc" }}>
            <th style={{ padding: "0.6rem 0.75rem", textAlign: "left", border: "1px solid #e2e8f0" }}>Topic</th>
            <th style={{ padding: "0.6rem 0.75rem", textAlign: "left", border: "1px solid #e2e8f0" }}>Fresh</th>
            <th style={{ padding: "0.6rem 0.75rem", textAlign: "left", border: "1px solid #e2e8f0" }}>Next.js</th>
            <th style={{ padding: "0.6rem 0.75rem", textAlign: "left", border: "1px solid #e2e8f0" }}>Astro</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row) => (
            <tr key={row.topic}>
              <td style={{ padding: "0.5rem 0.75rem", border: "1px solid #e2e8f0", fontWeight: 600, whiteSpace: "nowrap" }}>{row.topic}</td>
              <td style={{ padding: "0.5rem 0.75rem", border: "1px solid #e2e8f0" }}>{row.fresh}</td>
              <td style={{ padding: "0.5rem 0.75rem", border: "1px solid #e2e8f0" }}>{row.next}</td>
              <td style={{ padding: "0.5rem 0.75rem", border: "1px solid #e2e8f0" }}>{row.astro}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 style={{ marginTop: "2rem" }}>When to pick which?</h3>
      <ul>
        <li><strong>Fresh</strong>: small Deno-native projects, edge deploys, when you want minimal tooling.</li>
        <li><strong>Next.js</strong>: large-scale apps, you need RSC + Server Actions, big team familiar with React.</li>
        <li><strong>Astro</strong>: content sites (blogs, marketing, docs), or apps that mix UI frameworks per page.</li>
      </ul>

      <p style={{ marginTop: "2rem" }}><a href="/">← Home</a></p>
    </main>
  );
}
