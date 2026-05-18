import { type PageProps } from "$fresh/server.ts";

// _layout.tsx applies to every route in this FOLDER (and subfolders).
// It nests INSIDE the root _app.tsx — so the chain becomes:
//   _app.tsx (HTML doc) → routes/blog/_layout.tsx → routes/blog/index.tsx
//
// Use folder-level layouts for shared chrome: sidebars, breadcrumbs, section nav.

export default function BlogLayout({ Component }: PageProps) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", minHeight: "100vh" }}>
      <aside style={{ background: "#f0f4f8", padding: "1.5rem" }}>
        <h3 style={{ marginTop: 0 }}>Blog</h3>
        <nav style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <a href="/blog">All posts</a>
          <a href="/blog/intro-to-fresh">Intro to Fresh</a>
          <a href="/blog/islands-deep-dive">Islands deep dive</a>
        </nav>
        <p style={{ marginTop: "2rem", fontSize: "0.8rem", color: "#666" }}>
          This sidebar is shared by every page under /blog
        </p>
      </aside>

      <section style={{ padding: "2rem" }}>
        <Component />
      </section>
    </div>
  );
}
