// Field decorators return an "initializer" function that can transform the
// initial value. To validate on every write we pair it with an accessor decorator.
export function range(min: number, max: number) {
  return function <This>(
    target: ClassAccessorDecoratorTarget<This, number>,
    context: ClassAccessorDecoratorContext<This, number>,
  ): ClassAccessorDecoratorResult<This, number> {
    const check = (v: number) => {
      if (v < min || v > max) {
        throw new RangeError(`${String(context.name)} must be between ${min} and ${max}, got ${v}`);
      }
      return v;
    };
    return {
      get() {
        return target.get.call(this);
      },
      set(value: number) {
        target.set.call(this, check(value));
      },
      init(value: number) {
        return check(value);
      },
    };
  };
}

// Field decorator: returns a function that transforms the initial value.
export function upper<This>(_t: undefined, _c: ClassFieldDecoratorContext<This, string>) {
  return (value: string) => value.toUpperCase();
}
