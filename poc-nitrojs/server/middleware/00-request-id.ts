import { defineEventHandler } from "h3";
import { randomUUID } from "node:crypto";

export default defineEventHandler((event) => {
  const id = randomUUID();
  // anexa no contexto do evento
  (event.context as any).reqId = id;
  event.node.res.setHeader("x-request-id", id);
});
