
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const target = process.argv[2];
if(!target) {
  console.error('Usage: node scripts/run.js <webpack|vite|esbuild>');
  process.exit(1);
}
const commands = {
  webpack: ['npx', ['webpack']],
  vite: ['npx', ['vite', 'build']],
  esbuild: ['npx', ['esbuild', 'src/index.js', '--bundle', '--outfile=dist/esbuild.js', '--minify']]
};
const [cmd, args] = commands[target];
console.log(`\n▶ Running ${target} build`);
const t0 = Date.now();
const result = spawnSync(cmd, args, { stdio: 'inherit' });
const t1 = Date.now();
if (result.status !== 0) {
  console.error(`${target} build failed`);
  process.exit(result.status);
}
console.log(`⏱  ${target} build finished in ${(t1 - t0)/1000}s`);
