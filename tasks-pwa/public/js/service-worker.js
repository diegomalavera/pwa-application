const CACHE_NAME = "tasks-pwa-v1";

const urls = [
  "/",
  "/tareas",
  "/manifest.json",
  "/script.js",
  "/style.css",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urls).then(() => self.skipWaiting());
      })
      .catch((error) => console.log("Fallo registro de cache", error)),
  );
});

self.addEventListener("activate", (event) => {
  const cacheWhiteList = [CACHE_NAME];
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        cacheNames.map((cacheName) => {
          if (cacheWhiteList.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        });
      })
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    }),
  );
});
