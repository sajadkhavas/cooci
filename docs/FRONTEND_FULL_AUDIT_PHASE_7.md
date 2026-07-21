# Frontend full audit — Phase 7

Phase 7 audits production bundling, route splitting, PWA installation, offline behavior, cache invalidation and measurable asset budgets.

## Threat and failure model

- Development-only tooling and mock catalog values must never become production entry dependencies.
- Secondary routes must remain lazy so a visitor does not pay the JavaScript cost of account, checkout, payment and content pages before navigation.
- A service worker must change whenever the production artifact changes; static cache versions can preserve obsolete behavior indefinitely.
- Authenticated and transactional routes must not execute a cached application shell after the network fails.
- HTML, the web manifest and the service worker must never receive immutable caching.
- Hashed Vite assets may be cached immutably, but cache lookup must stay inside the intended versioned cache.
- Cross-origin API requests, non-GET requests and range requests must not be intercepted by the storefront worker.
- Install icons must include broadly supported PNG sizes and a dedicated Apple touch icon.
- Production source maps and unexpectedly large entry, route, CSS or image artifacts must fail CI.

## Completion gates

1. Vite keeps development tagging behind a development-only condition and emits no production source maps.
2. Every secondary page route remains a dynamic import while the home route stays optimized for initial rendering.
3. `dist/sw.js` is generated after Vite from the exact production artifact fingerprint.
4. Shell, asset and image caches include the generated build version and old versions are removed on activation.
5. Account, checkout and payment navigations use the offline document instead of cached application JavaScript after a network failure.
6. Manifest, Android icons, maskable icon and Apple touch icon pass deterministic validation.
7. Root HTML, service worker and manifest caching rules prevent stale releases while hashed assets remain immutable.
8. Performance and PWA reports are uploaded by CI and Phase 7 cannot merge unless all earlier audits, tests, types and the production build pass.
