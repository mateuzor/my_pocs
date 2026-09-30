import { extname } from "@std/path";
import { STATUS_CODE } from "@std/http/status";
import { incrementVisits, listVisits } from "./kv.ts";

// Handler is a pure (Request) => Response function: it uses web-standard APIs,
// so it is testable without opening a socket and portable to other runtimes.
export function createHandler(kv: Deno.Kv) {
  return async (req: Request): Promise<Response> => {
    const url = new URL(req.url);
    const count = await incrementVisits(kv, url.pathname);

    if (url.pathname === "/stats") return Response.json(await listVisits(kv));

    if (url.pathname === "/hello") {
      return Response.json({ message: "Hello from Deno", visits: count });
    }

    if (url.pathname === "/deno.json") {
      // Needs --allow-read; the scoped flag limits it to the project dir.
      const body = await Deno.readTextFile("./deno.json");
      return new Response(body, { headers: { "content-type": "application/json" } });
    }

    return new Response(`Not found (${extname(url.pathname) || "no ext"})`, {
      status: STATUS_CODE.NotFound,
    });
  };
}
