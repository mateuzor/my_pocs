import { assertEquals, assertObjectMatch } from "@std/assert";
import { createHandler } from "./handler.ts";
import { incrementVisits } from "./kv.ts";

// Deno.test is built in: no Jest/Vitest. t.step gives nested sub-tests.
// An in-memory KV (":memory:") keeps tests isolated and disk-free.
Deno.test("handler", async (t) => {
  const kv = await Deno.openKv(":memory:");
  const handler = createHandler(kv);

  await t.step("GET /hello counts visits", async () => {
    await handler(new Request("http://x/hello"));
    const res = await handler(new Request("http://x/hello"));
    assertObjectMatch(await res.json(), { message: "Hello from Deno", visits: 2 });
  });

  await t.step("unknown route is 404", async () => {
    const res = await handler(new Request("http://x/nope"));
    assertEquals(res.status, 404);
    await res.body?.cancel();
  });

  kv.close();
});

Deno.test("atomic increments do not lose updates", async () => {
  const kv = await Deno.openKv(":memory:");
  await Promise.all(Array.from({ length: 20 }, () => incrementVisits(kv, "/race")));
  assertEquals((await kv.get<number>(["visits", "/race"])).value, 20);
  kv.close();
});
