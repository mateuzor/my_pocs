// Class decorator: receives the class and may return a subclass.
// Here we seal instances (no new props) and tag them with a creation time.
export function sealed<T extends new (...args: any[]) => object>(target: T, _ctx: ClassDecoratorContext<T>) {
  return class extends target {
    createdAt = Date.now();
    constructor(...args: any[]) {
      super(...args);
      Object.seal(this);
    }
  };
}
