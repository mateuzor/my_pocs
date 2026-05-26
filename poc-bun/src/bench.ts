// Bun has a built-in benchmarking API: `Bun.nanoseconds()`.
// This script measures a common operation (JSON parse) using Bun vs a hand-
// rolled timer to compare with what you'd do in Node.

const PAYLOAD = JSON.stringify({
  users: Array.from({ length: 1000 }, (_, i) => ({ id: i, name: `User ${i}` })),
});

function bench(label: string, fn: () => void, iters = 10_000) {
  // warmup — fill the inline cache before measuring
  for (let i = 0; i < 100; i++) fn();

  const start = Bun.nanoseconds();
  for (let i = 0; i < iters; i++) fn();
  const elapsed = (Bun.nanoseconds() - start) / 1_000_000; // ns → ms

  console.log(`${label.padEnd(30)} ${elapsed.toFixed(2)} ms total · ${(elapsed / iters * 1000).toFixed(2)} μs/op`);
}

bench('JSON.parse (1000 items)', () => {
  JSON.parse(PAYLOAD);
});

bench('JSON.stringify (1000 items)', () => {
  JSON.stringify({ users: [1, 2, 3] });
});

bench('Bun.hash (small string)', () => {
  Bun.hash('hello world');
});

console.log(`\nRuntime: bun ${Bun.version} (revision ${Bun.revision.slice(0, 7)})`);
