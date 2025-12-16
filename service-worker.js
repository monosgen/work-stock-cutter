const CACHE = "wsc-cache-v7.1a";
const ASSETS = ["./", "./index.html", "./manifest.json", "./service-worker.js"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then(
      (res) =>
        res ||
        fetch(e.request)
          .then((net) => {
            const copy = net.clone();
            caches
              .open(CACHE)
              .then((c) => c.put(e.request, copy))
              .catch(() => {});
            return net;
          })
          .catch(() => res)
    )
  );
});
