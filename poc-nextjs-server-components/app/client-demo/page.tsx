// This file is a SERVER component by default in Next.js App Router.
// It renders on the server — no useState, no event handlers allowed here.
import ClientCounter from './ClientCounter';

export default function ClientDemoPage() {
  return (
    <main style={{ padding: '2rem' }}>
      <h1>Server vs Client Components</h1>

      {/* This text is rendered on the server — no JS sent to the browser for it */}
      <p style={{ color: '#555' }}>
        This paragraph is server-rendered HTML. No React JS is shipped for it.
      </p>

      {/* ClientCounter is a Client Component — React JS is sent to the browser for it */}
      <ClientCounter initialCount={0} />
    </main>
  );
}
