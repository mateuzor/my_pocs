# poc-deno-runtime

## What
A small Deno service showing the runtime's distinguishing features: permission flags, `deno.json` tasks and import map, the standard library from JSR (`jsr:@std/*`), npm packages via `npm:`, `Deno.serve`, `Deno.test`, and Deno KV.

## Why
Deno is secure by default (no disk, network, or env access without flags), ships TypeScript, a formatter, linter, test runner and server built in, and uses web-standard APIs. That removes much of the Node toolchain setup and makes scripts safer to run.

## How to run
```bash
deno task start        # serve on :8000 with scoped net/read permissions
deno task test         # run Deno.test suites
deno task perms        # observe the permission model
curl localhost:8000/hello
curl localhost:8000/stats
```
Requires Deno 2.x. KV may need `--unstable-kv` depending on the version (already in the tasks).

## What to tell a mentor
- Permissions are scoped: `--allow-net=0.0.0.0:8000` and `--allow-read=.` instead of `-A`.
- The import map in `deno.json` maps bare names to `jsr:` and `npm:` specifiers, so there is no `node_modules`.
- The handler is a pure `Request => Response`, so tests need no server.
- KV offers atomic operations with `check`, which prevents lost updates without a separate database.
- JSR is TypeScript-first; npm compatibility covers the long tail.
