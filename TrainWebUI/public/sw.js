// Service Worker for PWA
const CACHE_NAME = 'gorail-v1';
const urlsToCache = [
  '/',
  '/search',
  '/login',
  '/register',
  '/manifest.json',
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  try {
    const url = new URL(event.request.url);

    // Do not intercept cross-origin requests (e.g., backend API on different port)
    if (url.origin !== self.location.origin) {
      return; // Let the network handle it
    }

    // For non-GET requests, bypass cache and hit network
    if (event.request.method !== 'GET') {
      event.respondWith(fetch(event.request));
      return;
    }

    event.respondWith(
      caches.match(event.request).then((response) => {
        if (response) return response;

        const fetchRequest = event.request.clone();
        return fetch(fetchRequest)
          .then((networkResponse) => {
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }

            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
            return networkResponse;
          })
          .catch(() => {
            // Only fall back to app shell for navigations (HTML documents)
            if (event.request.mode === 'navigate') {
              return caches.match('/');
            }
            // For other requests (e.g., JSON, images), signal failure
            return Response.error();
          });
      })
    );
  } catch (err) {
    // In case of any unexpected error in SW, don't block the request
    // Allow browser to perform default fetch
  }
});
