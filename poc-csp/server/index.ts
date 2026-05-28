import { Elysia } from 'elysia';

// Content Security Policy (CSP) is a SECURITY HEADER that tells the browser
// which sources of content are allowed. It's the strongest defense against
// XSS — even if an attacker injects HTML, the browser refuses to load
// scripts/styles/images from disallowed origins.
//
// CSP is composed of DIRECTIVES, each restricting a kind of resource:
//   default-src   — fallback for anything not explicitly set
//   script-src    — JavaScript sources
//   style-src     — stylesheet sources
//   img-src       — image sources
//   font-src, media-src, connect-src (XHR/fetch), frame-src, ...
//
// Special source keywords:
//   'self'             same origin (scheme + host + port)
//   'none'             nothing allowed
//   'unsafe-inline'    inline scripts/styles (defeats most of CSP's value — avoid)
//   'unsafe-eval'      eval() and friends (also avoid)
//   'nonce-XXXXX'      a fresh random per-page nonce for inline scripts
//   'sha256-XXXX'      hash of allowed inline content
//
// This server serves:
//   /lax.html      — NO CSP, demonstrates how a page is exposed
//   /strict.html   — STRICT CSP, shows what gets blocked

// A strict policy: same-origin only for everything, no inline, no eval.
// In real apps you'd add 'nonce-XXXX' for the inline scripts you genuinely need.
const STRICT_CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'", // we use a <style> block — allow inline styles for the demo
  "img-src 'self' data:",
  "connect-src 'self'",
  "font-src 'self'",
  "object-src 'none'",       // block <object>, <embed>, <applet> entirely
  "frame-ancestors 'none'",  // prevent the page from being framed (anti-clickjacking)
  "base-uri 'self'",         // attacker can't inject a <base> tag to redirect relative URLs
  "form-action 'self'",      // forms can only POST to same origin
].join('; ');

const app = new Elysia()
  .get('/', () => Response.redirect('/lax.html', 302))

  // /lax.html — served with NO CSP header
  .get('/lax.html', () => {
    return new Response(Bun.file('./public/lax.html'), {
      headers: { 'content-type': 'text/html' },
    });
  })

  // /strict.html — served with a strict CSP. The browser will block the same
  // inline scripts, external CDN, and onclick attribute that worked on /lax.
  .get('/strict.html', () => {
    return new Response(Bun.file('./public/strict.html'), {
      headers: {
        'content-type': 'text/html',
        'content-security-policy': STRICT_CSP,
        // Additional security headers commonly paired with CSP:
        'x-content-type-options': 'nosniff',
        'referrer-policy': 'no-referrer',
        'permissions-policy': 'camera=(), microphone=(), geolocation=()',
      },
    });
  })

  // Same-origin JS for the strict page
  .get('/safe.js', () => {
    return new Response(Bun.file('./public/safe.js'), {
      headers: { 'content-type': 'application/javascript' },
    });
  })

  .listen(3000);

console.log(`CSP POC running at http://localhost:${app.server?.port}`);
console.log('  /lax.html    — no CSP, see how everything works');
console.log('  /strict.html — strict CSP, watch DevTools for blocked resources');
