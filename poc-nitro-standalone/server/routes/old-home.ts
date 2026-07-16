// sendRedirect issues a 3xx redirect and ends the request when returned.
// Useful for moved routes, canonical URLs, or post-login redirects.
// `GET /old-home` -> 301 -> `/`.
export default defineEventHandler((event) => {
  return sendRedirect(event, "/", 301);
});
