// Dependency is injected so tests can pass a mock instead of hitting the network.
export interface RateClient {
  getRate(from: string, to: string): Promise<number>;
}

export async function convert(cents: number, from: string, to: string, client: RateClient): Promise<number> {
  if (from === to) return cents;
  const rate = await client.getRate(from, to);
  if (!(rate > 0)) throw new Error(`invalid rate for ${from}->${to}`);
  return Math.round(cents * rate);
}

export function applyDiscount(cents: number, percent: number): number {
  if (percent < 0 || percent > 100) throw new RangeError('percent must be 0..100');
  return Math.round(cents * (1 - percent / 100));
}
