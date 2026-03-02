const STATIC_CACHE = "poc-static-v2";
const API_CACHE = "poc-api-v2";

const STATIC_FILES = ["/", "/index.html", "/styles.css", "/app.js"];

// --- Install: pre-cache all static assets ---
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      // Pre-caching on install ensures these files are available offline immediately
      console.log("[SW] Pre-caching static assets");
      return cache.addAll(STATIC_FILES);
    })
  );
  // Skip waiting forces the new SW to activate without waiting for old tabs to close
  self.skipWaiting();
});

// --- Activate: clean up old caches from previous SW versions ---
self.addEventListener("activate", (event) => {
  const validCaches = [STATIC_CACHE, API_CACHE];
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((name) => !validCaches.includes(name))
          .map((name) => {
            console.log("[SW] Deleting old cache:", name);
            return caches.delete(name);
          })
      )
    )
  );
  // Claim all open clients immediately so the new SW takes effect without reload
  self.clients.claim();
});

// --- Fetch: route requests to the right strategy ---
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Strategy 1: Cache-First for static assets (JS, CSS, images)
  // These rarely change — serve from cache immediately, fast and offline-safe
  if (STATIC_FILES.includes(url.pathname)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // Strategy 2: Network-First for API requests
  // Always try network first to get fresh data; fall back to cache if offline
  if (url.pathname.startsWith("/api")) {
    event.respondWith(networkFirst(request, API_CACHE));
    return;
  }

  // Default: Stale-While-Revalidate — serve cache instantly, update in background
  event.respondWith(staleWhileRevalidate(request, STATIC_CACHE));
});

// Cache-First: return cached response immediately; only fetch if not cached
async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  return cached || fetch(request).then((response) => {
    const clone = response.clone();
    caches.open(cacheName).then((cache) => cache.put(request, clone));
    return response;
  });
}

// Network-First: always try the network; use cache only as offline fallback
async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request);
    const clone = response.clone();
    caches.open(cacheName).then((cache) => cache.put(request, clone));
    return response;
  } catch {
    const cached = await caches.match(request);
    return cached || new Response("Offline", { status: 503 });
  }
}

// Stale-While-Revalidate: serve from cache immediately, then update cache in background
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  // Kick off a background fetch to update the cache for next time
  const networkFetch = fetch(request).then((response) => {
    cache.put(request, response.clone());
    return response;
  });

  // Return cached immediately if available; otherwise wait for network
  return cached || networkFetch;
}
