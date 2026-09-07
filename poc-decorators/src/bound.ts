// addInitializer runs per instance, so we can bind the method to `this`
// once on construction. Fixes lost-`this` when passing methods as callbacks.
export function bound<This, T extends (...args: never[]) => unknown>(
  target: T,
  context: ClassMethodDecoratorContext<This, T>,
) {
  const name = context.name as keyof This;
  context.addInitializer(function (this: This) {
    (this as Record<keyof This, unknown>)[name] = (target as Function).bind(this);
  });
}
