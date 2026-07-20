# Winimi Bakery single-server topology

Status: accepted for Phase 19 deployment.

The storefront and Laravel backend remain separate repositories, but they are deployed on one Linux server. Nginx separates the public surfaces while both release trees share the same machine.

```text
One production server
├── winimibakery.com
│   └── /var/www/winimi/frontend/current/dist
└── api.winimibakery.com
    ├── /var/www/winimi/backend/current/public
    ├── /admin -> Filament
    └── /storage -> persistent media
```

The frontend is an immutable Vite build. Laravel runs through PHP-FPM. Queue workers, the scheduler, database access, media, backups and private configuration belong to the backend side of the same server.

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

`VITE_AUTH_MODE` and `VITE_PAYMENT_MODE` remain disabled as safe fallback values; when `VITE_USE_BACKEND=true`, the typed backend mode is used. No server credential is included in the Vite environment.

## Backend production values

The Laravel server configures allowed storefront origins, Sanctum stateful domains, secure shared-domain cookies and external provider credentials. These values are never copied into this repository.

## Phase boundaries

- Phase 18 runs Laravel and Vite on two loopback ports of one GitHub Actions runner and validates desktop/mobile Chromium journeys.
- Phase 19 deploys both artifacts on one Linux server, configures Nginx, DNS, TLS, PHP-FPM, workers, scheduler, backups, monitoring and rollback.
- Phase 20 supplies only the Zarinpal credential, eNAMAD badge code and SMS API key/template.
