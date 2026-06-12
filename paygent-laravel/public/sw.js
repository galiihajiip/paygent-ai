const CACHE_NAME = "paygent-pwa-v3";
const STATIC_CACHE = "paygent-static-v3";
const IMAGE_CACHE = "paygent-images-v3";

// App shell — pre-cached on install
const APP_SHELL = [
  "/",
  "/chat",
  "/dashboard",
  "/manifest.webmanifest",
  "/favicon.ico",
  "/icons/paygent.svg",
  "/icons/icon-72.png",
  "/icons/icon-96.png",
  "/icons/icon-128.png",
  "/icons/icon-192.png",
  "/icons/icon-384.png",
  "/icons/icon-512.png",
  "/icons/apple-touch-icon.png",
];

// ---- INSTALL ----
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting()),
  );
});

// ---- ACTIVATE ----
self.addEventListener("activate", (event) => {
  const allowedCaches = [CACHE_NAME, STATIC_CACHE, IMAGE_CACHE];
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => !allowedCaches.includes(key))
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

// ---- FETCH ----
self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Skip non-GET and cross-origin
  if (request.method !== "GET" || url.origin !== self.location.origin) {
    return;
  }

  // ---- API calls: Network-first ----
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => caches.match(request)),
    );
    return;
  }

  // ---- Images: Cache-first with network fallback ----
  if (
    url.pathname.match(/\.(png|jpg|jpeg|webp|avif|gif|svg|ico)$/i) ||
    url.pathname.startsWith("/icons/")
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;

        return fetch(request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(IMAGE_CACHE).then((cache) => cache.put(request, clone));
          }
          return response;
        });
      }),
    );
    return;
  }

  // ---- Static assets (JS, CSS, fonts): Cache-first ----
  if (
    url.pathname.match(/\.(js|css|woff|woff2|ttf|eot)$/i) ||
    url.pathname.startsWith("/_next/static/")
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;

        return fetch(request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(STATIC_CACHE).then((cache) => cache.put(request, clone));
          }
          return response;
        });
      }),
    );
    return;
  }

  // ---- Navigations: Stale-while-revalidate ----
  if (request.mode === "navigate") {
    event.respondWith(
      caches.match(request).then((cached) => {
        const fetchPromise = fetch(request)
          .then((response) => {
            if (response.ok) {
              const clone = response.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
            }
            return response;
          })
          .catch(() => {
            // Offline fallback: serve cached version or root
            return cached || caches.match("/");
          });

        // Return cached immediately, update in background
        return cached || fetchPromise;
      }),
    );
    return;
  }

  // ---- Default: Stale-while-revalidate ----
  event.respondWith(
    caches.match(request).then((cached) => {
      const fetchPromise = fetch(request).then((response) => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return response;
      });

      return cached || fetchPromise;
    }),
  );
});
