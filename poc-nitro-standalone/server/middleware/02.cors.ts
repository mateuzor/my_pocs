// handleCors centralizes CORS in one middleware: it sets the
// Access-Control-* headers and, for preflight OPTIONS requests, ends the
// response early. Returning `true` means "preflight handled — stop here",
// so we return to short-circuit the request.
//
// (routeRules can also do CORS declaratively; this shows the programmatic
// path when you need conditional logic.)
export default defineEventHandler((event) => {
  const handled = handleCors(event, {
    origin: "*",
    methods: ["GET", "POST", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type"],
  });
  if (handled) {
    return; // preflight answered, don't fall through to the route
  }
});
