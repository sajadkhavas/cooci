const BUILD_VERSION = "__WINIMI_BUILD_VERSION__";
const CACHE_PREFIX = "winimi";
const SHELL_CACHE = `${CACHE_PREFIX}-shell-${BUILD_VERSION}`;
const ASSET_CACHE = `${CACHE_PREFIX}-assets-${BUILD_VERSION}`;
const IMAGE_CACHE = `${CACHE_PREFIX}-images-${BUILD_VERSION}`;
const MAX_IMAGE_ENTRIES = 48;
const NAVIGATION_TIMEOUT_MS = 6000;

const SHELL_FILES = [
  "/index.html",
  "/offline.html",
  "/manifest.webmanifest",
  "/brand/winimi-logo.svg",
  "/icons/winimi-192.png",
  "/icons/winimi-512.png",
  "/icons/winimi-apple-touch.png",
];

const SENSITIVE_NAVIGATION_PREFIXES = [
  "/account",
  "/checkout",
  "/payment",
];

const isSensitiveNavigation = (pathname) =>
  SENSITIVE_NAVIGATION_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

const matchCache = async (cacheName, request) => {
  const cache = await caches.open(cacheName);
  return cache.match(request);
};

const putIfCacheable = async (cacheName, request, response) => {
  if (
    !response ||
    response.status !== 200 ||
    response.type !== "basic"
  ) {
    return response;
  }

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
  const cached = await matchCache(cacheName, request);
  if (cached) return cached;

  const response = await fetch(request);
  await putIfCacheable(cacheName, request, response);
  return response;
};

const staleWhileRevalidate = async (request, cacheName) => {
  const cached = await matchCache(cacheName, request);
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

const offlineResponse = async () =>
  (await matchCache(SHELL_CACHE, "/offline.html")) || Response.error();

const networkFirstNavigation = async (request) => {
  const url = new URL(request.url);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), NAVIGATION_TIMEOUT_MS);

  try {
    const response = await fetch(request, {
      cache: "no-store",
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const contentType = response.headers.get("content-type") || "";
    if (
      response.status === 200 &&
      response.type === "basic" &&
      contentType.includes("text/html")
    ) {
      await putIfCacheable(SHELL_CACHE, "/index.html", response);
    }

    return response;
  } catch {
    clearTimeout(timeoutId);

    if (isSensitiveNavigation(url.pathname)) {
      return offlineResponse();
    }

    return (
      (await matchCache(SHELL_CACHE, request)) ||
      (await matchCache(SHELL_CACHE, "/index.html")) ||
      (await offlineResponse())
    );
  }
};

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(SHELL_CACHE);
      await Promise.all(
        SHELL_FILES.map(async (path) => {
          const response = await fetch(path, { cache: "reload" });
          if (!response.ok) throw new Error(`Unable to precache ${path}`);
          await cache.put(path, response);
        }),
      );
    })(),
  );
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
  if (request.method !== "GET" || request.headers.has("range")) return;

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
