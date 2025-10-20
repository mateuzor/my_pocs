import { defineEventHandler, getRequestURL } from "h3";
import { readTodos } from "../utils/kv";
import { createHash } from "node:crypto";

export default defineEventHandler(async (event) => {
  if (event.method !== "GET") return;
  const url = getRequestURL(event);
  if (url.pathname !== "/todos") return;

  const todos = await readTodos();
  const body = JSON.stringify(todos);
  const etag = createHash("sha1").update(body).digest("hex");
  event.node.res.setHeader("ETag", `"${etag}"`);
  const ifNone = event.node.req.headers["if-none-match"];
  if (ifNone === `"${etag}"`) {
    event.node.res.statusCode = 304;
    event.node.res.end();
  }
});
