#!/usr/bin/env -S deno run -A --watch=static/,routes/

// Dev entry — runs the same Fresh server but in watch mode with HMR.
// The manifest is regenerated automatically when files change.

import dev from "$fresh/dev.ts";
import config from "./fresh.config.ts";

await dev(import.meta.url, "./main.ts", config);
