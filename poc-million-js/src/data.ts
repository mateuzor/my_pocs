export interface Row {
  id: number;
  name: string;
  email: string;
  score: number;
}

export function makeRows(count: number, seed = 0): Row[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    name: `User ${i}`,
    email: `user${i}@example.com`,
    score: (i * 7 + seed) % 100,
  }));
}
