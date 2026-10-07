# poc-electron

## What
A desktop text editor with Electron + TypeScript + React (Vite for the renderer):
- `src/main`: app lifecycle, `BrowserWindow`, native menu, file dialogs + `fs` access, native notifications
- `src/preload`: `contextBridge` exposing a small typed `window.api`
- `src/renderer`: React UI that only talks to `window.api`
- `src/shared/ipc.ts`: typed IPC contract used by all three processes
- `electron-builder.yml`: packaging for macOS (dmg/zip), Windows (nsis) and Linux (AppImage)

## Why
Electron's main idea is two worlds: a privileged Node process and an untrusted web page. Learning to keep them separated (contextIsolation, no nodeIntegration, sandbox, narrow bridge, CSP) is the core of building secure Electron apps. A typed contract makes the IPC boundary refactor-safe.

## How to run
```bash
npm install
npm run dev           # Vite + tsc watch + Electron with hot reload of renderer
npm start             # production build, then launch
npm run package:dir   # unpacked app in release/ (fast check)
npm run package       # installers in release/
```

## What to tell a mentor
- Main = Node/OS access; renderer = browser sandbox; preload = the only bridge. `contextBridge.exposeInMainWorld` exposes specific functions, never `ipcRenderer` itself.
- `ipcRenderer.invoke` / `ipcMain.handle` is the request/response pattern (returns a Promise); `webContents.send` pushes events (menu clicks) to the UI.
- Files are touched only in main, after the user picks a path in a native dialog; I also cap file size because IPC serializes data.
- Types in `shared/ipc.ts` drive the handler signatures in main and the wrapper in preload, so the contract cannot drift.
- Main/preload compile to CommonJS with `tsc` (sandboxed preload cannot be ESM); the renderer is a plain Vite app with relative `base` because production uses `file://`.
- Packaging: electron-builder only ships `dist/` and builds per-OS targets; code signing/notarization is the missing step for real distribution.
