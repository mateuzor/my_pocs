// Memoize caches results per argument list. Decorators make this reusable
// without touching the method body (cross-cutting concern).
export function memoize<This, Args extends unknown[], Return>(
  target: (this: This, ...args: Args) => Return,
  _context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Return>,
) {
  const cache = new Map<string, Return>();
  return function (this: This, ...args: Args): Return {
    const key = JSON.stringify(args);
    if (!cache.has(key)) cache.set(key, target.call(this, ...args));
    return cache.get(key)!;
  };
}
