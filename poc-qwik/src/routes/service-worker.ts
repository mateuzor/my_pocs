// Qwik City's prefetch service worker. setupServiceWorker() wires the logic that
// caches route/$-chunks ahead of time; skipWaiting/clients.claim make updates
// take effect immediately. This file is served at /service-worker.js.
import { setupServiceWorker } from '@builder.io/qwik-city/service-worker';

setupServiceWorker();

addEventListener('install', () => self.skipWaiting());
addEventListener('activate', () => self.clients.claim());

declare const self: ServiceWorkerGlobalScope;
