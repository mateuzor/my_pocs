// Plain TypeScript module — exercised by the test file under tests/.
// No build step needed — Bun runs .ts files natively.

export function sum(nums: number[]): number {
  return nums.reduce((acc, n) => acc + n, 0);
}

export function chunk<T>(arr: T[], size: number): T[][] {
  if (size <= 0) throw new Error('size must be positive');
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

export async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
