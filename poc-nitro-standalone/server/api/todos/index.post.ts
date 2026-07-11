// `server/api/todos/index.post.ts` -> `POST /api/todos`.
// Same URL as the GET handler, different verb — the filename suffix keeps the
// two cleanly separated. For now it inserts a placeholder title;
// day 3 wires up readBody() to use the real request payload.
import { todoStore } from "../../lib/todos-store";

export default defineEventHandler(() => todoStore.add("New todo"));
