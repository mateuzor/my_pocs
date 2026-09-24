import { debounce, retry } from '../src/debounce';

describe('timers', () => {
  // WHY: fake timers make time deterministic and instant; real sleeps make slow, flaky tests.
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('debounce only fires the last call', () => {
    const fn = jest.fn();
    const d = debounce(fn, 200);
    d(1);
    d(2);
    d(3);
    expect(fn).not.toHaveBeenCalled();
    jest.advanceTimersByTime(200);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(3);
  });

  it('retry waits between attempts', async () => {
    const op = jest.fn().mockRejectedValueOnce(new Error('fail')).mockResolvedValue('ok');
    const p = retry(op, 3, 1000);
    // Flush the rejected promise, then jump over the retry delay.
    await jest.advanceTimersByTimeAsync(1000);
    await expect(p).resolves.toBe('ok');
    expect(op).toHaveBeenCalledTimes(2);
  });

  it('retry gives up after the last attempt', async () => {
    const op = jest.fn().mockRejectedValue(new Error('boom'));
    const p = retry(op, 1, 10);
    await expect(p).rejects.toThrow('boom');
  });
});
