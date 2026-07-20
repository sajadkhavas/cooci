const CACHE_PREFIX = "winimi";
const SHELL_CACHE = `${CACHE_PREFIX}-shell-v2`;
const ASSET_CACHE = `${CACHE_PREFIX}-assets-v2`;
const IMAGE_CACHE = `${CACHE_PREFIX}-images-v2`;
const MAX_IMAGE_ENTRIES = 48;

const SHELL_FILES = [
  "/",
  "/index.html",
  "/offline.html",
  "/manifest.webmanifest",
  "/brand/winimi-logo.svg",
  "/icons/winimi-192.svg",
  "/icons/winimi-512.svg",
];

const putIfCacheable = async (cacheName, request, response) => {
  if (!response || !response.ok || response.type !== "basic") return response;
  const cache = await caches.open(cacheName);
  await cache.put(request, response.clone());
  return response;
};

const trimCache = async (cacheName, maxEntries) => {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  const overflow = keys.length - maxEntries;
  if (overflow <= 0) return;
  await Promise.all(keys.slice(0, overflow).map((request) => cache.delete(request)));
};

const cacheFirst = async (request, cacheName) => {
  const cached = await caches.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  await putIfCacheable(cacheName, request, response);
  return response;
};

const staleWhileRevalidate = async (request, cacheName) => {
  const cached = await caches.match(request);
  const networkPromise = fetch(request)
    .then((response) => putIfCacheable(cacheName, request, response))
    .then(async (response) => {
      if (cacheName === IMAGE_CACHE) await trimCache(IMAGE_CACHE, MAX_IMAGE_ENTRIES);
      return response;
    })
    .catch(() => undefined);

  if (cached) return cached;
  return (await networkPromise) || Response.error();
};

const networkFirstNavigation = async (request) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);

  try {
    const response = await fetch(request, { signal: controller.signal });
    clearTimeout(timeoutId);
    await putIfCacheable(SHELL_CACHE, "/index.html", response);
    return response;
  } catch {
    clearTimeout(timeoutId);
    return (
      (await caches.match(request)) ||
      (await caches.match("/index.html")) ||
      (await caches.match("/offline.html")) ||
      Response.error()
    );
  }
};

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(SHELL_CACHE).then((cache) => cache.addAll(SHELL_FILES)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter(
              (key) =>
                key.startsWith(CACHE_PREFIX) &&
                ![SHELL_CACHE, ASSET_CACHE, IMAGE_CACHE].includes(key),
            )
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(networkFirstNavigation(request));
    return;
  }

  if (url.pathname.startsWith("/assets/")) {
    event.respondWith(cacheFirst(request, ASSET_CACHE));
    return;
  }

  if (request.destination === "image") {
    event.respondWith(staleWhileRevalidate(request, IMAGE_CACHE));
    return;
  }

  if (["style", "script", "font"].includes(request.destination)) {
    event.respondWith(staleWhileRevalidate(request, ASSET_CACHE));
  }
});
