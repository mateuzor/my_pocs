# poc-build-benchmark

This project is a **Proof of Concept (POC)** created to **benchmark and compare build performance** of the three most popular JavaScript bundlers: **Webpack**, **Vite**, and **esbuild**.

We evaluate build time and output size by running each tool against the same simple JavaScript project that imports a large dependency (`lodash`).

---

## 💪 Purpose

Understand the trade-offs between **Webpack**, **Vite**, and **esbuild** in terms of:

- Build speed
- Output size
- Usability for real-world projects

---

## ⚙️ How to Run

1. **Install dependencies**:

```bash
npm install
```

2. **Run all benchmarks**:

```bash
npm run bench
```

This will execute:

- `npm run bench:webpack`
- `npm run bench:vite`
- `npm run bench:esbuild`

You will see build output and timing logs in the terminal.

---

## 🔍 What You Should Notice

| Bundler | Build Time | Output Size (approx)     |
| ------- | ---------- | ------------------------ |
| Webpack | \~1.6s     | 69.3 KiB                 |
| Vite    | \~0.7s     | 72.9 KiB (26.9 KiB gzip) |
| esbuild | **\~0.2s** | 71.9 KiB                 |

- 🐣 Webpack is powerful but slower.
- ⚡ Vite is fast and developer-friendly.
- 🚀 esbuild is extremely fast and ideal for tooling and small-to-medium projects.

---

## 📁 Project Structure

```
poc-build-benchmark/
├── scripts/              # Benchmark runner logic
│   └── run.js
├── src/                  # Entry point for all bundlers
│   └── index.js
├── dist/                 # Output files from builds
├── webpack.config.js     # Webpack config
├── vite.config.js        # Vite config
├── esbuild.config.js     # esbuild config
├── package.json
└── README.md
```

---

## 🌍 Real-World Use Cases

### Webpack

- Used by **React**, **Angular**, **Vue CLI**
- Enterprise-grade applications with complex setups
- Large plugin ecosystem

### Vite

- Used by **Vue 3**, **SvelteKit**, **Astro**
- Focus on DX (instant dev server with HMR)
- Builds using **Rollup** under the hood

### esbuild

- Used by **Vite (under the hood for dev)**, **Rome**, **Turbopack**
- Best for CLIs, tools, small-to-medium SPAs
- Fastest JS/TS bundler to date

---

## ✅ Pros and Cons

### Webpack

✅ Large ecosystem, flexible
❌ Slower build and config complexity

### Vite

✅ Fast builds, modern DX, support for HMR
❌ Still maturing for edge cases, Rollup output can be complex

### esbuild

✅ Ultra-fast, zero-config
❌ Less flexible, minimal plugin support

---

## 📦 Dependencies Used

- `lodash` (to simulate heavy code)
- `webpack`, `vite`, `esbuild`

---
