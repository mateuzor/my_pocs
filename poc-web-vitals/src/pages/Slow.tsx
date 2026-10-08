// FCP/TTFB are driven by network and server, not components. Reload with
// DevTools throttling (Slow 4G) or a slow backend to see them degrade.
export function Slow() {
  return (
    <section>
      <h2>FCP / TTFB</h2>
      <p>Reload the page with network throttling to move these two metrics.</p>
    </section>
  );
}
