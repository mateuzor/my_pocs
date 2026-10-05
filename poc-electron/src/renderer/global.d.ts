import type { ElectronApi } from '../shared/ipc';

// Makes window.api type-safe in the renderer, matching what preload exposes.
declare global {
  interface Window {
    api: ElectronApi;
  }
}

export {};
