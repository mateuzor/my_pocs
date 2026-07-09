// FILE-BASED ROUTING is Nitro's core idea: the path of a file under
// `server/routes/` becomes the URL. This file maps to `GET /`.
//
// `defineEventHandler` is auto-imported (no import statement). It wraps a
// function receiving the `event` (the request/response context) and whatever
// you RETURN is automatically serialized — return an object and Nitro sends
// JSON with the right Content-Type. No res.json(), no res.end().
export default defineEventHandler(() => {
  return {
    message: "Nitro standalone is running",
    hint: "Routes are just files under server/routes/",
  };
});
