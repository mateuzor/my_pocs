import { Cart } from '../src/cart';
import * as pricing from '../src/pricing';
import { checkout } from '../src/notifier';

describe('checkout (spies)', () => {
  it('logs and notifies with the total', () => {
    const cart = new Cart();
    cart.add({ sku: 'a', price: 500, qty: 2 });
    const logger = { info: jest.fn() };
    const onPaid = jest.fn();

    expect(checkout(cart, logger, onPaid)).toBe(1000);
    expect(logger.info).toHaveBeenCalledWith('checkout total=1000');
    expect(onPaid).toHaveBeenCalledWith(1000);
  });

  it('fails on an empty cart without side effects', () => {
    const onPaid = jest.fn();
    expect(() => checkout(new Cart(), { info: jest.fn() }, onPaid)).toThrow('empty cart');
    expect(onPaid).not.toHaveBeenCalled();
  });

  // spyOn wraps a REAL method: you can stub it, and restore the original afterwards.
  it('can spy on a real function and restore it', () => {
    const spy = jest.spyOn(pricing, 'applyDiscount').mockReturnValue(42);
    expect(pricing.applyDiscount(1000, 10)).toBe(42);
    spy.mockRestore();
    expect(pricing.applyDiscount(1000, 10)).toBe(900);
  });

  it('spies on console without noise', () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    console.warn('hidden');
    expect(spy).toHaveBeenCalledWith('hidden');
    spy.mockRestore();
  });
});
