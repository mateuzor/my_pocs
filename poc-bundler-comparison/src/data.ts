// Deterministic fake dataset so every bundler compiles the exact same code.
export interface Item {
  id: number;
  name: string;
  group: string;
}

const groups = ['alpha', 'beta', 'gamma', 'delta'];

export const items: Item[] = Array.from({ length: 200 }, (_, i) => ({
  id: i,
  name: `item-${i}`,
  group: groups[i % groups.length],
}));
