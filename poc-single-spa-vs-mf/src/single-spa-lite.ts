// ── SINGLE-SPA model ────────────────────────────────────────────────────────
// Single-spa is a ROOT ORCHESTRATOR. Each microfrontend registers a lifecycle
// (bootstrap → mount → unmount) plus an "activity function" that decides, from
// the current location, whether that app should be active. The orchestrator
// mounts/unmounts whole apps as the route changes. Apps are deployed
// independently but composed at runtime by this single router.

export interface AppLifecycle {
  mount: (el: HTMLElement) => void;
  unmount: (el: HTMLElement) => void;
}

interface RegisteredApp {
  name: string;
  app: AppLifecycle;
  activeWhen: (path: string) => boolean;
  mounted: boolean;
}

const registry: RegisteredApp[] = [];

export function registerApplication(opts: {
  name: string;
  app: AppLifecycle;
  activeWhen: (path: string) => boolean;
}) {
  registry.push({ ...opts, mounted: false });
}

// The reroute loop is the heart of single-spa: on every route change it diffs
// "which apps SHOULD be active" against "which ARE mounted" and reconciles.
export function start(root: HTMLElement) {
  const reroute = () => {
    const path = location.hash.slice(1) || '/';
    for (const entry of registry) {
      const shouldBeActive = entry.activeWhen(path);
      if (shouldBeActive && !entry.mounted) {
        entry.app.mount(root);
        entry.mounted = true;
      } else if (!shouldBeActive && entry.mounted) {
        entry.app.unmount(root);
        entry.mounted = false;
      }
    }
  };
  window.addEventListener('hashchange', reroute);
  reroute();
}
