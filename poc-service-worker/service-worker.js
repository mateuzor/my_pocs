const CACHE_NAME = "poc-cache-v1";
const FILES_TO_CACHE = ["/", "/index.html", "/styles.css", "/app.js"];

// Listen for the install event which occurs when Service Worker is first installed
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Cache successfully created.");
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

// Listen for the activate event which occurs when a new Service Worker takes control
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("Old cache removed:", cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Listen for fetch events which occur when the browser makes network requests
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => response || fetch(event.request))
  );
});
