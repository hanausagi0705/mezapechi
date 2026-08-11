const CACHE_NAME = "mezapechi-runtime-v2";

self.addEventListener("install", () => {
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            return self.clients.claim();
        })
    );
});

self.addEventListener("fetch", (event) => {
    if (event.request.method !== "GET") return;

    event.respondWith(
        fetch(event.request, {
            cache: "no-store"
        })
            .then((response) => {
                const copy = response.clone();

                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, copy);
                });

                return response;
            })
            .catch(() => {
                return caches.match(event.request);
            })
    );
});