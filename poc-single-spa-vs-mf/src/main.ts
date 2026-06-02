import { registerApplication, start, type AppLifecycle } from './single-spa-lite';
import { loadRemote } from './mf-lite';

// ── Single-SPA demo: the orchestrator swaps whole apps by route ──────────────
const cartApp: AppLifecycle = {
  mount: (el) => (el.innerHTML = '<h2>🛒 Cart app</h2><p>route-owned by team A</p>'),
  unmount: (el) => (el.innerHTML = ''),
};
const profileApp: AppLifecycle = {
  mount: (el) => (el.innerHTML = '<h2>👤 Profile app</h2><p>route-owned by team B</p>'),
  unmount: (el) => (el.innerHTML = ''),
};

registerApplication({ name: 'cart', app: cartApp, activeWhen: (p) => p.startsWith('/cart') });
registerApplication({ name: 'profile', app: profileApp, activeWhen: (p) => p.startsWith('/profile') });

start(document.getElementById('root')!);

// ── Module Federation demo: the host pulls a remote MODULE at runtime ────────
// No route is involved — the host decides to embed the checkout widget inline.
async function mountFederatedWidget() {
  const host = document.createElement('section');
  host.innerHTML = '<h3>Host shell — loading remote module…</h3>';
  document.body.appendChild(host);
  const widget = await loadRemote('checkout', './Widget');
  host.innerHTML = `<h3>Host shell</h3>${widget.render()}`;
}
mountFederatedWidget();
