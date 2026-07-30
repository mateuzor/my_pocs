import { defineHandler } from "nitro";
import { defineCachedFunction } from "nitro/cache";

const GH = "https://api.github.com/repos/";
const UA = { "user-agent": "nitro-poc" };

// Wrap ANY async function in a persistent stale-while-revalidate cache.
// No redis client. No connection string. Backed by the storage layer:
// files on disk in dev, memory / Redis / Workers KV in prod — via config only.
const cachedStars = defineCachedFunction(
  async (repo: string) => {
    const res = await fetch(GH + repo, { headers: UA });
    if (!res.ok) throw new Error(`GitHub returned ${res.status}`);
    const data = (await res.json()) as { stargazers_count: number };
    return data.stargazers_count;
  },
  {
    name: "ghStars",
    maxAge: 60, // fresh for 60s
    staleMaxAge: -1, // then serve stale, revalidate in background
    getKey: (repo: string) => repo,
  },
);

// [...repo] is a catch-all: /api/stars/nitrojs/nitro -> "nitrojs/nitro"
export default defineHandler(async (event) => {
  const { repo } = event.context.params as { repo: string };

  const start = performance.now();
  const stars = await cachedStars(repo).catch(() => null);
  const ms = +(performance.now() - start).toFixed(1);

  // Cold: ~300 ms (network). Warm: ~0.4 ms (cache).
  return { repo, stars, ms, source: ms < 20 ? "cache" : "network" };
});
