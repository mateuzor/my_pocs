// Bun has a built-in test runner — Jest-compatible API but ~3-4x faster.
// No Vitest, no Jest, no ts-jest configuration needed.
// Run with: `bun test`

import { describe, expect, it } from 'bun:test';
import { sum, chunk, delay } from '../src/utils';

describe('sum', () => {
  it('adds an array of numbers', () => {
    expect(sum([1, 2, 3, 4])).toBe(10);
  });

  it('returns 0 for empty array', () => {
    expect(sum([])).toBe(0);
  });
});

describe('chunk', () => {
  it('splits an array into fixed-size chunks', () => {
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
  });

  it('throws when size is not positive', () => {
    expect(() => chunk([1, 2], 0)).toThrow();
  });
});

describe('delay', () => {
  it('resolves after the given ms', async () => {
    const start = performance.now();
    await delay(50);
    expect(performance.now() - start).toBeGreaterThanOrEqual(45);
  });
});
