const BUILD_VERSION = "__WINIMI_BUILD_VERSION__";
const CACHE_PREFIX = "winimi";
const SHELL_CACHE = `${CACHE_PREFIX}-shell-${BUILD_VERSION}`;
const ASSET_CACHE = `${CACHE_PREFIX}-assets-${BUILD_VERSION}`;
const IMAGE_CACHE = `${CACHE_PREFIX}-images-${BUILD_VERSION}`;
const MAX_IMAGE_ENTRIES = 48;
const MAX_NAVIGATION_ENTRIES = 16;
const NAVIGATION_TIMEOUT_MS = 6000;
const OFFLINE_REFRESH_INTERVAL_MS = 5 * 60_000;
let lastOfflineRefreshAt = 0;

const SHELL_FILES = [
  "/offline",
  "/app.webmanifest",
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

const navigationCacheKey = (url) =>
  new Request(`${url.origin}${url.pathname}`, { method: "GET" });

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
      if (cacheName === IMAGE_CACHE) {
        await trimCache(IMAGE_CACHE, MAX_IMAGE_ENTRIES);
      }
      return response;
    })
    .catch(() => undefined);

  if (cached) return cached;
  return (await networkPromise) || Response.error();
};

const stripOfflineRuntime = (html) =>
  html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<link\b(?=[^>]*\brel=["']modulepreload["'])[^>]*>/gi, "");

const refreshOfflineShell = async () => {
  const now = Date.now();
  if (now - lastOfflineRefreshAt < OFFLINE_REFRESH_INTERVAL_MS) return;
  lastOfflineRefreshAt = now;

  try {
    const response = await fetch("/offline", { cache: "no-store" });
    const contentType = response.headers.get("content-type") || "";
    if (!response.ok || !contentType.includes("text/html")) return;

    const cache = await caches.open(SHELL_CACHE);
    await cache.put("/offline", response);
  } catch {
    // Keep the last known-good offline shell when the refresh cannot reach the server.
  }
};

const offlineResponse = async () => {
  const cached = await matchCache(SHELL_CACHE, "/offline");
  if (!cached) return Response.error();

  const contentType = cached.headers.get("content-type") || "";
  if (!contentType.includes("text/html")) return cached;

  const headers = new Headers(cached.headers);
  headers.delete("content-encoding");
  headers.delete("content-length");
  headers.set("cache-control", "no-store");

  return new Response(stripOfflineRuntime(await cached.text()), {
    status: cached.status,
    statusText: cached.statusText,
    headers,
  });
};

const networkFirstNavigation = async (request) => {
  const url = new URL(request.url);
  const sensitive = isSensitiveNavigation(url.pathname);
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
      !sensitive &&
      response.status === 200 &&
      response.type === "basic" &&
      contentType.includes("text/html")
    ) {
      await putIfCacheable(
        SHELL_CACHE,
        navigationCacheKey(url),
        response,
      );
      await trimCache(SHELL_CACHE, MAX_NAVIGATION_ENTRIES + SHELL_FILES.length);
    }

    return response;
  } catch {
    clearTimeout(timeoutId);

    if (sensitive) return offlineResponse();

    return (
      (await matchCache(SHELL_CACHE, navigationCacheKey(url))) ||
      (await matchCache(SHELL_CACHE, navigationCacheKey(new URL("/", url)))) ||
      (await offlineResponse())
    );
  }
};

const resolveNotificationUrl = (value) => {
  try {
    const destination = new URL(
      typeof value === "string" && value.trim() ? value : "/",
      self.location.origin,
    );
    return destination.origin === self.location.origin
      ? destination.href
      : `${self.location.origin}/`;
  } catch {
    return `${self.location.origin}/`;
  }
};

const openNotificationDestination = async (safeUrl) => {
  const windows = await self.clients.matchAll({
    type: "window",
    includeUncontrolled: true,
  });

  const exactWindow = windows.find((client) => {
    try {
      return new URL(client.url).href === safeUrl;
    } catch {
      return false;
    }
  });

  if (exactWindow) {
    try {
      return await exactWindow.focus();
    } catch {
      // Fall through to another same-origin client or openWindow().
    }
  }

  for (const client of windows) {
    try {
      if (new URL(client.url).origin !== self.location.origin) continue;
      if (typeof client.navigate !== "function") continue;
      const navigated = await client.navigate(safeUrl);
      if (!navigated) continue;
      try {
        return await navigated.focus();
      } catch {
        return navigated;
      }
    } catch {
      // A stale/uncontrolled client must not prevent notification navigation.
    }
  }

  try {
    return await self.clients.openWindow(safeUrl);
  } catch {
    return undefined;
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
      await self.skipWaiting();
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

self.addEventListener("push", (event) => {
  let payload = {};
  try {
    payload = event.data ? event.data.json() : {};
  } catch {
    payload = {};
  }

  const title = typeof payload.title === "string" ? payload.title : "وینیمی بیکری";
  const body = typeof payload.body === "string" ? payload.body : "خبر تازه‌ای از وینیمی دارید.";
  const safeUrl = resolveNotificationUrl(payload.url);

  event.waitUntil(self.registration.showNotification(title, {
    body,
    dir: "rtl",
    lang: "fa-IR",
    icon: "/icons/winimi-192.png",
    badge: "/icons/winimi-96-monochrome.png",
    tag: typeof payload.tag === "string" ? payload.tag : "winimi-notification",
    renotify: Boolean(payload.renotify),
    requireInteraction: Boolean(payload.requireInteraction),
    silent: false,
    timestamp: typeof payload.timestamp === "number" ? payload.timestamp : Date.now(),
    vibrate: [160, 80, 160],
    actions: [
      { action: "open", title: "مشاهده" },
      { action: "dismiss", title: "بستن" },
    ],
    data: { url: safeUrl },
  }));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  if (event.action === "dismiss") return;

  const safeUrl = resolveNotificationUrl(event.notification.data?.url);
  event.waitUntil(openNotificationDestination(safeUrl));
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET" || request.headers.has("range")) return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    if (url.pathname !== "/offline") {
      event.waitUntil(refreshOfflineShell());
    }
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
