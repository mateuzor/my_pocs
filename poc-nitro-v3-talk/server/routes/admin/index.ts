import { defineHandler } from "nitro";

/**
 * server/routes/* maps to /* (no /api prefix).
 *
 * There is zero auth code in this file. The password lives in
 * nitro.config.ts as a route rule:
 *   "/admin/**": { basicAuth: { username: "nitro", password: "demo" } }
 */
export default defineHandler(() => {
  return new Response(
    "<h1>Admin area</h1><p>You got past basicAuth — and this file contains no auth code.</p>",
    { headers: { "content-type": "text/html" } },
  );
});
