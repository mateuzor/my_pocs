import { type PageProps } from "$fresh/server.ts";

// DYNAMIC ROUTES use [bracket] syntax in the filename.
//   routes/blog/[slug].tsx    → /blog/whatever
//   routes/users/[id]/edit.tsx → /users/123/edit
//   routes/[...path].tsx      → catch-all (any depth)
//
// The param is available on `props.params` — fully typed as a string.
// (For richer parsing — booleans, numbers — see commit "handlers", where
// the server-side `handler` export gives you full request control.)

const POSTS: Record<string, { title: string; date: string; body: string }> = {
  "intro-to-fresh": {
    title: "Intro to Fresh",
    date: "2026-05-10",
    body: "Fresh is a Deno web framework built around server-side rendering and islands...",
  },
  "islands-deep-dive": {
    title: "Islands deep dive",
    date: "2026-05-15",
    body: "Islands are tiny interactive components hydrated independently...",
  },
  "ssr-vs-hydration": {
    title: "SSR vs hydration",
    date: "2026-05-18",
    body: "Server-side rendering produces HTML on the server. Hydration is the process...",
  },
};

export default function BlogPost(props: PageProps) {
  // params.slug is the value from [slug].tsx — typed as string
  const post = POSTS[props.params.slug];

  if (!post) {
    return (
      <article>
        <h1>404 — Post not found</h1>
        <p>No post with slug <code>{props.params.slug}</code>.</p>
        <p><a href="/blog">← All posts</a></p>
      </article>
    );
  }

  return (
    <article>
      <p style={{ color: "#718096", margin: 0 }}>{post.date}</p>
      <h1 style={{ marginTop: "0.25rem" }}>{post.title}</h1>
      <p>{post.body}</p>
      <p><a href="/blog">← All posts</a></p>
    </article>
  );
}
