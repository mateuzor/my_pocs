import { describe, it, expect } from "vitest";
// server/utils helpers are plain ESM exports, so we can unit-test them
// directly without booting the server.
import { ok } from "../server/utils/api";

// For full HTTP-level tests, Nitro ships @nitrojs/test-utils which spins up
// the app and gives you a typed `$fetch`:
//
//   import { setup, $fetch } from "@nitrojs/test-utils";
//   await setup();
//   expect(await $fetch("/api/status")).toMatchObject({ status: "ok" });
//
// Here we keep it to a fast unit test of the response envelope helper.
describe("ok()", () => {
  it("wraps data in a success envelope", () => {
    expect(ok([1, 2, 3])).toEqual({ success: true, data: [1, 2, 3] });
  });

  it("preserves the payload type", () => {
    const result = ok({ id: 1 });
    expect(result.success).toBe(true);
    expect(result.data).toEqual({ id: 1 });
  });
});
