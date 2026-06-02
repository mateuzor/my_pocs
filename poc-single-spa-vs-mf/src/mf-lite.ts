// ── MODULE FEDERATION model ─────────────────────────────────────────────────
// Module Federation is NOT a router. A "host" pulls EXPOSED MODULES from
// independently-deployed "remotes" at RUNTIME and stitches them into its own
// bundle. The unit of sharing is a *module* (a component, a function), not a
// whole app. Shared dependencies (e.g. React) are deduplicated through a
// "share scope" so both sides use one copy.

// The share scope: a singleton registry of shared deps. The first loader to
// register a version wins; later remotes reuse it instead of bundling their own.
const shareScope = new Map<string, unknown>();

export function shareSingleton<T>(name: string, factory: () => T): T {
  if (!shareScope.has(name)) shareScope.set(name, factory());
  return shareScope.get(name) as T;
}

// A "remote" exposes named modules. In real MF this lives on another origin and
// is fetched over the network; here a Promise + delay stands in for that fetch.
type RemoteModule = () => Promise<{ render: () => string }>;

const remotes: Record<string, Record<string, RemoteModule>> = {
  checkout: {
    './Widget': async () => {
      await new Promise((r) => setTimeout(r, 300));
      const v = shareSingleton('design-version', () => '2.1.0');
      return { render: () => `<div>💳 Checkout widget (shared design ${v})</div>` };
    },
  },
};

// loadRemote(remote, module): resolve an exposed module at runtime. The host
// chooses *when* and *whether* to load it — lazy by default, no route required.
export async function loadRemote(remote: string, module: string) {
  const exposed = remotes[remote]?.[module];
  if (!exposed) throw new Error(`Remote ${remote} has no module ${module}`);
  return exposed();
}
