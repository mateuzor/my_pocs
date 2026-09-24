import { applyDiscount, convert, RateClient } from '../src/pricing';

describe('convert (async + mocks)', () => {
  // jest.fn creates a standalone mock; we program its resolved value per test.
  const getRate = jest.fn<ReturnType<RateClient['getRate']>, Parameters<RateClient['getRate']>>();
  const client: RateClient = { getRate };

  it('uses the rate from the client', async () => {
    getRate.mockResolvedValueOnce(5);
    await expect(convert(100, 'USD', 'BRL', client)).resolves.toBe(500);
    expect(getRate).toHaveBeenCalledWith('USD', 'BRL');
    expect(getRate).toHaveBeenCalledTimes(1);
  });

  it('skips the call when currencies match', async () => {
    expect(await convert(100, 'USD', 'USD', client)).toBe(100);
    expect(getRate).not.toHaveBeenCalled(); // clearMocks:true reset the history
  });

  it('rejects on invalid rate', async () => {
    getRate.mockResolvedValueOnce(0);
    // WHY: always await/return async assertions, or the test passes before they run.
    await expect(convert(100, 'USD', 'BRL', client)).rejects.toThrow('invalid rate');
  });

  it('propagates client failures', async () => {
    getRate.mockRejectedValueOnce(new Error('network'));
    await expect(convert(1, 'A', 'B', client)).rejects.toThrow('network');
  });
});

describe('applyDiscount', () => {
  // test.each: one table, many cases, readable names.
  it.each([
    [1000, 10, 900],
    [999, 50, 500],
    [100, 0, 100],
    [100, 100, 0],
  ])('applyDiscount(%i, %i%%) = %i', (cents, pct, expected) => {
    expect(applyDiscount(cents, pct)).toBe(expected);
  });

  it('rejects out of range', () => {
    expect(() => applyDiscount(100, 101)).toThrow(RangeError);
    expect(() => applyDiscount(100, -1)).toThrow(RangeError);
  });
});
