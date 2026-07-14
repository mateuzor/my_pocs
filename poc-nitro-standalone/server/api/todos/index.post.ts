// `POST /api/todos` — validating input and returning a typed HTTP error.
import { todoStore } from "../../lib/todos-store";

export default defineEventHandler(async (event) => {
  const body = await readBody<{ title?: string }>(event);

  if (!body?.title || typeof body.title !== "string") {
    // createError() produces a proper HTTP error instead of a generic 500.
    // Nitro serializes it to JSON ({ statusCode, statusMessage, ... }) and
    // sets the response status — no manual res.statusCode juggling.
    throw createError({ statusCode: 400, statusMessage: "title is required" });
  }

  // setResponseStatus lets us return 201 Created on success.
  setResponseStatus(event, 201);
  return todoStore.add(body.title);
});
