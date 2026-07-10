// Maps to `GET /hello`. Demonstrates reading the query string.
//
// `getQuery(event)` parses `?name=Mateus` into an object. It is one of the
// h3 helpers Nitro auto-imports — h3 is the tiny HTTP framework Nitro is
// built on, so every h3 util is available without importing.
export default defineEventHandler((event) => {
  const { name = "world" } = getQuery(event);
  return { greeting: `Hello, ${name}!` };
});
