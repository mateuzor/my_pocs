// `GET /api/todos`. Note there is NO import for `ok()` below — it lives in
// server/utils/ and Nitro auto-imports it. Same mechanism that provides
// defineEventHandler, useStorage, getQuery, etc.
import { todoStore } from "../../lib/todos-store";

export default defineEventHandler(async () => ok(await todoStore.list()));
