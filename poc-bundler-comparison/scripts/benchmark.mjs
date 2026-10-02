// Measures, per bundler: production build time, output size (raw + gzip)
// and dev-server cold start (spawn -> first successful HTTP 200).
import { spawn, spawnSync } from 'node:child_process';
import { readdirSync, statSync, readFileSync, rmSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { join } from 'node:path';

const tools = [
  { name: 'vite', dist: 'dist-vite', port: 5171 },
  { name: 'webpack', dist: 'dist-webpack', port: 5172 },
  { name: 'parcel', dist: 'dist-parcel', port: 5173 },
];

const kb = (n) => (n / 1024).toFixed(1);

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)],
  );
}

function measureBuild({ name, dist }) {
  rmSync(dist, { recursive: true, force: true });
  // Clear Parcel's cache so we measure a cold build, not a cache hit.
  rmSync('.parcel-cache', { recursive: true, force: true });
  const t0 = performance.now();
  const r = spawnSync('npm', ['run', `build:${name}`, '--silent'], { stdio: 'ignore' });
  const ms = performance.now() - t0;
  if (r.status !== 0) throw new Error(`${name} build failed`);

  const js = walk(dist).filter((f) => f.endsWith('.js'));
  const raw = js.reduce((s, f) => s + statSync(f).size, 0);
  const gz = js.reduce((s, f) => s + gzipSync(readFileSync(f)).length, 0);
  return { ms, raw, gz };
}

// Cold start = time until the dev server answers GET / with 200.
// A real "ready" would also request the JS entry; for Vite that is when the
// on-demand transform happens, so we fetch the first script too.
async function measureDev({ name, port }) {
  const t0 = performance.now();
  const child = spawn('npm', ['run', `dev:${name}`, '--silent'], { stdio: 'ignore', detached: true });
  const base = `http://localhost:${port}`;
  try {
    for (let i = 0; i < 600; i++) {
      try {
        const res = await fetch(base + '/');
        if (res.ok) {
          const html = await res.text();
          const src = /<script[^>]+src="([^"]+)"/.exec(html)?.[1];
          if (src) await fetch(new URL(src, base + '/'));
          return performance.now() - t0;
        }
      } catch {
        // server not up yet
      }
      await new Promise((r) => setTimeout(r, 100));
    }
    throw new Error(`${name} dev server never became ready`);
  } finally {
    // Negative pid kills the whole process group (npm + the real server).
    process.kill(-child.pid);
  }
}

const rows = [];
for (const tool of tools) {
  console.log(`> ${tool.name}`);
  const build = measureBuild(tool);
  const dev = await measureDev(tool);
  rows.push({ ...tool, build, dev });
}

console.log('\n| Bundler | Build (s) | JS raw (KB) | JS gzip (KB) | Dev cold start (s) |');
console.log('|---|---|---|---|---|');
for (const r of rows) {
  console.log(
    `| ${r.name} | ${(r.build.ms / 1000).toFixed(2)} | ${kb(r.build.raw)} | ${kb(r.build.gz)} | ${(r.dev / 1000).toFixed(2)} |`,
  );
}
