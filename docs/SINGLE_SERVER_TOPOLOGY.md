# Winimi Bakery single-server topology

Status: `production_server_package=ready` for Phase 19B live execution.

The storefront and Laravel backend remain separate repositories and separate immutable release artifacts, but they are deployed on one Linux server. Nginx separates the public surfaces while both release trees share the same machine.

```text
One production server
├── winimibakery.com
│   ├── Nginx immutable assets -> /var/www/winimi/frontend/current/app/build/client
│   └── Node SSR loopback      -> 127.0.0.1:4173
└── api.winimibakery.com
    ├── Nginx/PHP-FPM          -> /var/www/winimi/backend/current/public
    ├── /admin                 -> Filament
    └── /storage               -> /var/www/winimi/backend/shared/storage/app/public
```

Frontend releases live under `/var/www/winimi/frontend/releases/<release-id>` and backend releases under `/var/www/winimi/backend/releases/<release-id>`. Each `current` path is an atomic symlink. Laravel `.env`, writable storage and media live only under `backend/shared` and survive release replacement.

## Runtime ownership

- `winimi-frontend.service` runs Node as user `winimi`, group `www-data`.
- PHP-FPM serves Laravel through its Unix socket or loopback listener.
- `winimi-backend-queue.service` keeps the database queue worker alive.
- `winimi-backend-scheduler.timer` invokes `schedule:run` every minute.
- backup service/timer owns database/media archives and remote private copies.
- Nginx is the only process listening publicly on ports 80 and 443.

## Frontend build values

```env
SITE_URL=https://winimibakery.com
VITE_SITE_ORIGIN=https://winimibakery.com
VITE_USE_BACKEND=true
VITE_API_BASE_URL=https://api.winimibakery.com
VITE_ALLOW_DEV_MOCKS=false
VITE_AUTH_MODE=disabled
VITE_PAYMENT_MODE=disabled
```

The Node runtime uses only:

```env
HOST=127.0.0.1
PORT=4173
NODE_ENV=production
WINIMI_API_ORIGIN=https://api.winimibakery.com
```

No payment, SMS, eNAMAD, database or Laravel application secret is copied into the frontend build or runtime file.

## Backend production values

Laravel configures allowed storefront origins, Sanctum stateful domains, secure shared-domain cookies, database/cache/queue, persistent media and backup storage in `/var/www/winimi/backend/shared/.env`. Before Phase 20, checkout/payment/SMS/eNAMAD providers remain disabled and all provider credential values remain empty.

## Phase boundaries

- Phase 18 runs Laravel and the Node SSR storefront on one GitHub Actions runner and validates desktop/mobile Chromium journeys.
- Phase 19A prepares and verifies the immutable releases, Nginx/systemd files, preflight, smoke, backup and rollback runbooks.
- Phase 19B executes the package on the Linux server, completes DNS/TLS, database/media persistence, service startup, restore/rollback drills and public-domain acceptance.
- `production_deployed=ready` is forbidden before Phase 19B evidence exists.
- Phase 20 supplies only the Zarinpal credential, eNAMAD badge code and SMS API key/template.
