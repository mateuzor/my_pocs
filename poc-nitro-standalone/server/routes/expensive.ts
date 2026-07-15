// cachedEventHandler wraps a handler with Nitro's cache layer. The result is
// stored (in the configured cache storage) and reused for `maxAge` seconds,
// so the expensive work runs at most once per interval — ideal for slow
// upstream calls or heavy computation.
//
// Call `GET /expensive` repeatedly within 10s: `computedAt` stays frozen,
// proving the handler body did not re-run.
export default cachedEventHandler(
  async () => {
    // Stand-in for a slow computation / upstream fetch.
    const value = await new Promise<number>((resolve) =>
      setTimeout(() => resolve(Math.round(Math.random() * 1000)), 200),
    );
    return { value, computedAt: new Date().toISOString() };
  },
  {
    maxAge: 10, // seconds to serve the cached response before recomputing
    name: "expensive",
    getKey: () => "singleton", // one shared cache entry for this route
  },
);
