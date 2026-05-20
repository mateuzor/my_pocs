// routes/admin/index.tsx → URL: /admin
// Protected by routes/admin/_middleware.ts — the Authorization check runs first.

export default function AdminHome() {
  return (
    <main style={{ fontFamily: "system-ui, sans-serif", padding: "2rem", maxWidth: 720 }}>
      <h1>Admin dashboard</h1>
      <p>
        You only see this page if you sent <code>Authorization: Bearer admin-token</code>.
        Otherwise, the folder-scoped middleware returned 401 before this component ran.
      </p>
      <p><a href="/">← Home</a></p>
    </main>
  );
}
