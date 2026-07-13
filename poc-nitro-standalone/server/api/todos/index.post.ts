// `POST /api/todos` — now reading the real request payload.
import { todoStore } from "../../lib/todos-store";

export default defineEventHandler(async (event) => {
  // readBody() parses the incoming request body (JSON by default) into a JS
  // value. It's async because the body arrives as a stream that must be
  // fully read first.
  const body = await readBody<{ title?: string }>(event);
  return todoStore.add(body?.title ?? "Untitled");
});
