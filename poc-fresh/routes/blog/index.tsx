// routes/blog/index.tsx → URL: /blog
// Renders inside routes/blog/_layout.tsx automatically.

const POSTS = [
  { slug: "intro-to-fresh", title: "Intro to Fresh", date: "2026-05-10" },
  { slug: "islands-deep-dive", title: "Islands deep dive", date: "2026-05-15" },
  { slug: "ssr-vs-hydration", title: "SSR vs hydration", date: "2026-05-18" },
];

export default function BlogIndex() {
  return (
    <article>
      <h1>All posts</h1>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {POSTS.map((post) => (
          <li key={post.slug} style={{ padding: "0.75rem 0", borderBottom: "1px solid #e2e8f0" }}>
            <a href={`/blog/${post.slug}`} style={{ fontWeight: 600 }}>
              {post.title}
            </a>
            <div style={{ color: "#718096", fontSize: "0.85rem" }}>{post.date}</div>
          </li>
        ))}
      </ul>
    </article>
  );
}
