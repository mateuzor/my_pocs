import { registerApplication, start, type AppLifecycle } from './single-spa-lite';

// Two independently-authored "microfrontends", each owning a route.
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
