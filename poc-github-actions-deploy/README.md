# poc-github-actions-deploy

## What
A small Vite + TypeScript app with two GitHub Actions workflows in `.github/workflows/`: `ci.yml` (lint, test matrix, build, with npm cache) and `deploy.yml` (build and publish to GitHub Pages through a protected environment).

## Why
Automating checks and deployment gives fast feedback and reproducible releases. Caching speeds up installs, a matrix verifies several Node versions and OSes in parallel, concurrency prevents wasted or conflicting runs, and environments add deployment history and approval gates.

## How to run
```bash
npm install
npm run lint && npm test && npm run build
npm run dev
```
To deploy: push to GitHub, then in Settings > Pages choose "GitHub Actions" as source. Note that GitHub only reads workflows from the repository root `.github/workflows/`; in a monorepo of POCs, copy these files there (and add `working-directory` or `paths` filters) for them to run.

## What to tell a mentor
- `setup-node` with `cache: npm` caches downloads keyed by the lockfile; use `npm ci` for reproducible installs.
- Matrix + `fail-fast: false` shows every failing combination; `needs` orders jobs.
- Concurrency cancels outdated CI runs but queues deploys (`cancel-in-progress: false`) so a release is never cut off.
- `permissions` are minimal per workflow; Pages needs `pages: write` and `id-token: write` for OIDC.
- The `github-pages` environment exposes the URL and can require reviewers.
