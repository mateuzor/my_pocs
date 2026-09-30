// Deno KV: a built-in key-value store (SQLite locally, FoundationDB on Deno Deploy).
// Keys are arrays, so hierarchies like ["visits", path] sort and list naturally.
export async function incrementVisits(kv: Deno.Kv, path: string): Promise<number> {
  const key = ["visits", path];
  // Atomic retry loop: commit only succeeds if nobody changed the entry since
  // we read it (optimistic concurrency), avoiding lost updates under load.
  while (true) {
    const current = await kv.get<number>(key);
    const next = (current.value ?? 0) + 1;
    const res = await kv.atomic().check(current).set(key, next).commit();
    if (res.ok) return next;
  }
}

export async function listVisits(kv: Deno.Kv): Promise<Record<string, number>> {
  const out: Record<string, number> = {};
  for await (const entry of kv.list<number>({ prefix: ["visits"] })) {
    out[String(entry.key[1])] = entry.value;
  }
  return out;
}
