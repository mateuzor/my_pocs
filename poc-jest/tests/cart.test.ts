import { Cart } from '../src/cart';

describe('Cart', () => {
  // WHY: beforeEach gives every test a fresh instance; shared state is the #1 cause of flaky tests.
  let cart: Cart;
  beforeEach(() => {
    cart = new Cart();
  });

  // Matchers: pick the most specific one, failures read better.
  it('sums totals', () => {
    cart.add({ sku: 'a', price: 1000, qty: 2 });
    cart.add({ sku: 'b', price: 250, qty: 1 });
    expect(cart.total).toBe(2250); // toBe -> Object.is (primitives)
  });

  it('merges same sku', () => {
    cart.add({ sku: 'a', price: 100, qty: 1 });
    cart.add({ sku: 'a', price: 100, qty: 2 });
    // toEqual -> recursive equality (objects/arrays)
    expect(cart.toJSON()).toEqual([{ sku: 'a', price: 100, qty: 3 }]);
    expect(cart.toJSON()).toHaveLength(1);
  });

  it('matches partial objects and floats', () => {
    cart.add({ sku: 'a', price: 100, qty: 1 });
    expect(cart.toJSON()[0]).toMatchObject({ sku: 'a' });
    expect(0.1 + 0.2).toBeCloseTo(0.3); // never toBe for floats
  });

  it('throws on invalid qty', () => {
    // WHY: wrap in a function, otherwise the throw happens before expect can catch it.
    expect(() => cart.add({ sku: 'a', price: 1, qty: 0 })).toThrow(RangeError);
    expect(() => cart.add({ sku: 'a', price: 1, qty: 0 })).toThrow(/positive/);
  });

  it('removes items', () => {
    cart.add({ sku: 'a', price: 1, qty: 1 });
    expect(cart.remove('a')).toBe(true);
    expect(cart.remove('a')).toBe(false);
    expect(cart.total).toBe(0);
  });

  // Snapshot: good for stable, serializable output; review diffs carefully.
  it('serializes to a stable snapshot', () => {
    cart.add({ sku: 'b', price: 20, qty: 1 });
    cart.add({ sku: 'a', price: 10, qty: 2 });
    expect(cart.toJSON()).toMatchInlineSnapshot(`
[
  {
    "price": 10,
    "qty": 2,
    "sku": "a",
  },
  {
    "price": 20,
    "qty": 1,
    "sku": "b",
  },
]
`);
  });
});
