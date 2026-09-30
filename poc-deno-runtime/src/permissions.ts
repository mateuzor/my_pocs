// Deno is secure by default: no file, network or env access unless granted.
// Run with different flags to see the behaviour:
//   deno run src/permissions.ts                         -> prompts / fails
//   deno run --allow-read=./deno.json src/permissions.ts -> reads only that file
// Scoped flags (path, host) implement least privilege, unlike Node's all-or-nothing.
async function tryRead(path: string) {
  const status = await Deno.permissions.query({ name: "read", path });
  console.log(`read ${path}: ${status.state}`);
  if (status.state === "granted") {
    const text = await Deno.readTextFile(path);
    console.log(`  ${text.length} bytes read`);
  }
}

await tryRead("./deno.json");
await tryRead("/etc/hosts");
