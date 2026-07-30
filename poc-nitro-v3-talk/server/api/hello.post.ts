import { defineHandler, HTTPError } from "nitro";

// Same path, different file -> POST /api/hello
export default defineHandler(async (event) => {
  const body = await event.req.json().catch(() => null);

  if (!body?.name) {
    // v3 replaced createError() with a real Error subclass
    throw new HTTPError({ status: 400, message: "Field 'name' is required" });
  }

  return { greeted: body.name, at: new Date().toISOString() };
});
