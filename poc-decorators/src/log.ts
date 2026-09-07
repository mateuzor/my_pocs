// Modern (TC39 stage 3) decorators: no "experimentalDecorators" flag needed in TS 5+.
// A method decorator receives the original method and a context object,
// and may return a replacement function.
export function log<This, Args extends unknown[], Return>(
  target: (this: This, ...args: Args) => Return,
  context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Return>,
) {
  const name = String(context.name);
  return function (this: This, ...args: Args): Return {
    console.log(`[log] ${name}(${args.map((a) => JSON.stringify(a)).join(', ')})`);
    const result = target.call(this, ...args);
    console.log(`[log] ${name} ->`, result);
    return result;
  };
}
