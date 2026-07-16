// h3 helpers for headers & cookies — all auto-imported. Cookies are just
// typed helpers over the Set-Cookie / Cookie headers, so you never build
// header strings by hand.
export default defineEventHandler((event) => {
  // Read a visit counter cookie, increment it, and write it back.
  const previous = Number(getCookie(event, "visits") ?? 0);
  const visits = previous + 1;

  setCookie(event, "visits", String(visits), {
    httpOnly: true, // not readable from client JS
    maxAge: 60 * 60, // 1 hour
    sameSite: "lax",
  });

  // Arbitrary response headers via setResponseHeader.
  setResponseHeader(event, "cache-control", "no-store");

  return { visits };
});
