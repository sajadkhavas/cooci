import { randomBytes } from "node:crypto";
import path from "node:path";
import process from "node:process";
import express from "express";
import { createRequestHandler } from "@react-router/express";
import * as build from "./build/server/index.js";

const app = express();
const host = process.env.HOST || "127.0.0.1";
const port = Number.parseInt(process.env.PORT || "4173", 10);
const clientDirectory = path.resolve(process.cwd(), "build/client");
const publicApiOrigin = "https://api.winimibakery.com";
const apiOrigin = (() => {
  try {
    return new URL(
      process.env.WINIMI_API_ORIGIN || publicApiOrigin,
    ).origin;
  } catch {
    return publicApiOrigin;
  }
})();
const sensitivePrefixes = [
  "/account",
  "/cart",
  "/checkout",
  "/payment",
];
const webVitalNames = new Set(["LCP", "INP", "CLS"]);
const webVitalRatings = new Set(["good", "needs-improvement", "poor"]);

const nativeFetch = globalThis.fetch.bind(globalThis);
if (apiOrigin !== publicApiOrigin) {
  globalThis.fetch = (input, init) => {
    const sourceUrl = new URL(
      input instanceof Request ? input.url : String(input),
    );
    if (sourceUrl.origin !== publicApiOrigin) {
      return nativeFetch(input, init);
    }

    const targetUrl = new URL(
      `${sourceUrl.pathname}${sourceUrl.search}`,
      apiOrigin,
    );
    if (input instanceof Request) {
      return nativeFetch(new Request(targetUrl, input), init);
    }
    return nativeFetch(targetUrl, init);
  };
}

app.disable("x-powered-by");
app.set("trust proxy", 1);

const sharedHeaders = (response, nonce) => {
  const scriptSource = nonce
    ? "script-src 'self' 'nonce-" + nonce + "'"
    : "script-src 'self'";
  response.setHeader(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "object-src 'none'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "style-src 'self' 'unsafe-inline'",
      scriptSource,
      "connect-src 'self' " + apiOrigin,
      "manifest-src 'self'",
      "worker-src 'self'",
      "upgrade-insecure-requests",
    ].join("; "),
  );
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  response.setHeader(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );
  response.setHeader("X-Frame-Options", "DENY");
  response.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  response.setHeader("Cross-Origin-Resource-Policy", "same-site");
};

const isValidWebVitalPayload = (payload) => {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return false;
  }
  if (!webVitalNames.has(payload.name) || !webVitalRatings.has(payload.rating)) {
    return false;
  }
  if (
    typeof payload.value !== "number" ||
    !Number.isFinite(payload.value) ||
    payload.value < 0 ||
    payload.value > 120_000
  ) {
    return false;
  }
  if (
    typeof payload.route !== "string" ||
    !payload.route.startsWith("/") ||
    payload.route.length > 512
  ) {
    return false;
  }
  if (
    typeof payload.pageId !== "string" ||
    payload.pageId.length < 8 ||
    payload.pageId.length > 128
  ) {
    return false;
  }
  if (
    !payload.viewport ||
    typeof payload.viewport !== "object" ||
    !Number.isFinite(payload.viewport.width) ||
    !Number.isFinite(payload.viewport.height) ||
    payload.viewport.width < 1 ||
    payload.viewport.height < 1 ||
    payload.viewport.width > 20_000 ||
    payload.viewport.height > 20_000
  ) {
    return false;
  }
  return true;
};

app.get("/__ssr_health", (_request, response) => {
  sharedHeaders(response, null);
  response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  response.setHeader("X-Robots-Tag", "noindex, nofollow");
  response.json({ status: "ok", surface: "winimi-ssr" });
});

app.post(
  "/__web_vitals",
  express.json({ limit: "8kb", type: "application/json" }),
  (request, response) => {
    sharedHeaders(response, null);
    response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    response.setHeader("X-Robots-Tag", "noindex, nofollow");

    if (!isValidWebVitalPayload(request.body)) {
      response.status(400).json({ accepted: false });
      return;
    }

    const payload = request.body;
    console.log(
      "WINIMI_WEB_VITAL " +
        JSON.stringify({
          name: payload.name,
          value: payload.value,
          rating: payload.rating,
          route: payload.route,
          navigationType:
            typeof payload.navigationType === "string"
              ? payload.navigationType.slice(0, 32)
              : "unknown",
          viewport: {
            width: payload.viewport.width,
            height: payload.viewport.height,
          },
          pageId: payload.pageId,
          recordedAt:
            typeof payload.recordedAt === "string"
              ? payload.recordedAt.slice(0, 40)
              : new Date().toISOString(),
        }),
    );
    response.status(204).end();
  },
);

app.use(
  "/assets",
  express.static(path.join(clientDirectory, "assets"), {
    immutable: true,
    maxAge: "1y",
    fallthrough: false,
    setHeaders(response) {
      sharedHeaders(response, null);
      response.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    },
  }),
);

app.use(
  express.static(clientDirectory, {
    index: false,
    maxAge: 0,
    fallthrough: true,
    setHeaders(response, filePath) {
      sharedHeaders(response, null);
      if (filePath.endsWith("sw.js")) {
        response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        response.setHeader("Service-Worker-Allowed", "/");
      } else {
        response.setHeader("Cache-Control", "no-cache, must-revalidate");
      }
    },
  }),
);

app.use((request, response, next) => {
  const nonce = randomBytes(18).toString("base64url");
  request.headers["x-winimi-csp-nonce"] = nonce;
  sharedHeaders(response, nonce);
  const sensitive = sensitivePrefixes.some(
    (prefix) =>
      request.path === prefix || request.path.startsWith(prefix + "/"),
  );
  response.setHeader(
    "Cache-Control",
    sensitive
      ? "private, no-store, max-age=0"
      : "no-cache, must-revalidate",
  );
  if (sensitive) {
    response.setHeader("X-Robots-Tag", "noindex, nofollow");
  }
  next();
});

app.use(
  createRequestHandler({
    build,
    mode: process.env.NODE_ENV || "production",
  }),
);

const server = app.listen(port, host, () => {
  console.log(
    "Winimi SSR listening on http://" + host + ":" + port +
      " with API origin " + apiOrigin,
  );
});

const shutdown = (signal) => {
  console.log("Received " + signal + "; closing Winimi SSR server.");
  server.close((error) => {
    if (error) {
      console.error(error);
      process.exitCode = 1;
    }
    process.exit();
  });
};

process.once("SIGTERM", () => shutdown("SIGTERM"));
process.once("SIGINT", () => shutdown("SIGINT"));
