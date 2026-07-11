// `server/api/todos/index.get.ts` -> `GET /api/todos`.
// The `.get` suffix binds this handler to the GET method ONLY. Nitro derives
// the HTTP verb from the filename, so a folder holds one file per verb
// (index.get.ts, index.post.ts, ...) instead of a manual `if method ===`.
import { todoStore } from "../../lib/todos-store";

export default defineEventHandler(() => todoStore.list());
