// Service Worker for GoRail (Next.js-friendly)
const CACHE_NAME = "gorail-v3";          // bump when you deploy big changes
const SHELL_CACHE = `${CACHE_NAME}-shell`;
const STATIC_CACHE = `${CACHE_NAME}-static`;
const IMG_CACHE = `${CACHE_NAME}-img`;

const APP_SHELL_URLS = [
  "/",               // app shell
  "/manifest.json",
  // nếu bạn có icon trong public/ thì thêm:
  // "/icons/icon-192.png",
  // "/icons/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE)
      .then((cache) => cache.addAll(APP_SHELL_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => {
        if (![SHELL_CACHE, STATIC_CACHE, IMG_CACHE].includes(k)) return caches.delete(k);
      }))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;

  // only handle GET
  if (req.method !== "GET") return;

  let url;
  try {
    url = new URL(req.url);
  } catch {
    return;
  }

  // only same-origin
  if (url.origin !== self.location.origin) return;

  // ✅ NEVER cache APIs or sensitive flows
  if (url.pathname.startsWith("/api") ||
      url.pathname.startsWith("/Payment") ||
      url.pathname.startsWith("/Booking")) {
    return;
  }

  // 1) Navigations: network-first (always fresh) + offline fallback to "/"
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req).catch(() => caches.match("/"))
    );
    return;
  }

  // 2) Next static assets: cache-first
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(cacheFirst(req, STATIC_CACHE));
    return;
  }

  // 3) Images from public/ or same-origin: stale-while-revalidate
  if (req.destination === "image") {
    event.respondWith(staleWhileRevalidate(req, IMG_CACHE));
    return;
  }

  // 4) Default: network-first (avoid stale UI/data)
  event.respondWith(networkFirst(req, STATIC_CACHE));
});

// ---- strategies ----
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;

  const fresh = await fetch(request);
  if (fresh && fresh.ok) cache.put(request, fresh.clone());
  return fresh;
}

async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  try {
    const fresh = await fetch(request);
    if (fresh && fresh.ok) cache.put(request, fresh.clone());
    return fresh;
  } catch {
    const cached = await cache.match(request);
    if (cached) return cached;
    throw new Error("No response");
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  const networkPromise = fetch(request).then((fresh) => {
    if (fresh && fresh.ok) cache.put(request, fresh.clone());
    return fresh;
  }).catch(() => null);

  return cached || (await networkPromise) || Response.error();
}
