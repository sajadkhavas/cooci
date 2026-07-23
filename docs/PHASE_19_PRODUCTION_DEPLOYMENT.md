# Phase 19 — Winimi Production Deployment

Preparation marker: `production_server_package=ready`

Final live marker: `production_deployed=ready`

This runbook deploys the React Router Node SSR storefront and Laravel API as separate immutable releases on one Linux server. Phase 19A prepares and verifies the package in GitHub. Phase 19B executes it on the real VPS.

Do not report `production_deployed=ready` until DNS, TLS, database, persistent media, workers, scheduler, backups, restore drill, public smoke tests and rollback have all passed on the live server.

## 19A — repository package

The repositories provide:

- deterministic frontend SSR release manifest and SHA-256 verification
- atomic frontend release activation and rollback
- hardened frontend systemd service bound to `127.0.0.1:4173`
- frontend and API Nginx virtual-host templates
- backend immutable release, shared storage and atomic current symlink
- Laravel queue worker and one-minute scheduler services
- daily encrypted backup service/timer and restore-drill checklist
- server preflight and disabled-provider production smoke checks
- no external provider credential in either release artifact

Status after CI and merge: `production_server_package=ready`.

## 19B — live server execution

### 1. Required DNS

Before issuing certificates:

```text
winimibakery.com      A/AAAA -> production server
www.winimibakery.com  A/AAAA -> production server
api.winimibakery.com  A/AAAA -> production server
```

The `www` host permanently redirects to the canonical apex host. The API remains on its own host.

### 2. Operating-system baseline

Use a supported 64-bit Linux distribution with:

- Node.js 22
- Nginx
- PHP 8.3 CLI/FPM and required extensions
- Composer 2
- MySQL 8 or MariaDB 10.6+
- Python 3, curl, OpenSSL, rsync, unzip and systemd
- an unprivileged `winimi` deployment/runtime user
- the web-server group `www-data`

Only ports 22, 80 and 443 are public. Node SSR, PHP-FPM and the database bind to loopback/private sockets.

### 3. Filesystem topology

```text
/var/www/winimi/
├── frontend/
│   ├── releases/<frontend-release-id>/
│   ├── current -> releases/<frontend-release-id>
│   └── active-release
├── backend/
│   ├── releases/<backend-release-id>/
│   ├── current -> releases/<backend-release-id>
│   ├── shared/.env
│   ├── shared/storage/
│   └── active-release
└── backups/
```

Create directories as root, then grant the `winimi` user ownership while preserving `www-data` read/access where required.

### 4. Private runtime configuration

Install the frontend runtime file:

```text
/etc/winimi/frontend-runtime.env
```

Use `deploy/systemd/frontend-runtime.env.example`; owner `root:winimi`, mode `0640`.

Install the backend `.env` only at:

```text
/var/www/winimi/backend/shared/.env
```

It must never be inside an immutable release or Git repository. Before Phase 20, payment, SMS and eNAMAD remain disabled and their credential values remain empty.

### 5. TLS bootstrap

1. Install HTTP-only ACME virtual hosts.
2. Confirm all three DNS names resolve to the server.
3. Issue certificates for the frontend apex/www names and API name.
4. Install rendered HTTPS virtual hosts.
5. Run `nginx -t` and reload Nginx.
6. Confirm automatic certificate renewal is enabled and perform a dry run.

Never use `--insecure` in the live smoke test.

### 6. Backend first deployment

Deploy the backend before the storefront because SSR depends on the API.

Required order:

1. verify the backend release manifest
2. link shared `.env` and persistent `storage`
3. install/verify optimized Composer dependencies
4. enable maintenance mode when replacing an active release
5. run `php artisan migrate --force`
6. run `php artisan config:cache` and `php artisan route:cache`
7. run `php artisan storage:link`
8. run `php artisan backend:readiness --json`
9. atomically activate the release
10. restart PHP-FPM and the queue worker
11. start/verify the scheduler timer
12. leave maintenance mode
13. verify `https://api.winimibakery.com/api/system/ready`

A failed migration, readiness check or health check must restore the previous current symlink and keep purchasing disabled.

### 7. Frontend deployment

Build with exactly:

```env
SITE_URL=https://winimibakery.com
VITE_SITE_ORIGIN=https://winimibakery.com
VITE_USE_BACKEND=true
VITE_API_BASE_URL=https://api.winimibakery.com
VITE_ALLOW_DEV_MOCKS=false
VITE_AUTH_MODE=disabled
VITE_PAYMENT_MODE=disabled
```

Then:

```bash
npm ci
npm run check
npm run release:create -- build .release
npm run release:verify -- <release-directory>
deploy/bin/deploy-production-frontend.sh <release-directory>
```

The wrapper restarts `winimi-frontend.service`, waits for `http://127.0.0.1:4173/__ssr_health` and automatically restores the prior symlink when activation fails.

### 8. Nginx and service verification

```bash
sudo systemd-analyze verify /etc/systemd/system/winimi-frontend.service
sudo systemctl daemon-reload
sudo systemctl enable --now winimi-frontend.service
sudo systemctl enable --now winimi-backend-queue.service
sudo systemctl enable --now winimi-backend-scheduler.timer
sudo nginx -t
sudo systemctl reload nginx
```

All application processes must be active after a reboot.

### 9. Disabled-provider production smoke

Before external activation:

- checkout disabled
- payment disabled and provider `disabled`
- OTP/SMS provider disabled
- test OTP exposure false
- staging seeding false
- eNAMAD disabled
- Laravel debug false

Run:

```bash
deploy/bin/preflight-frontend-server.sh
deploy/bin/smoke-production-surfaces.sh
```

Also verify the backend production preflight from the backend repository.

### 10. Backup and restore drill

A backup is not valid until restored in isolation.

Before the final marker:

1. create database and media backups
2. verify archive checksum and remote private copy
3. restore into an isolated database/storage directory
4. run migrations/status, readiness and representative catalog/order checks
5. record RPO, RTO, release IDs and operator
6. destroy decrypted drill material

### 11. Rollback drill

Frontend:

```bash
deploy/bin/rollback-production-frontend.sh /var/www/winimi/frontend <release-id>
```

Backend rollback must restore the previous release symlink only when its migrations remain compatible. Destructive or irreversible migration rollback requires the verified database backup and an incident decision.

After rollback, re-run internal health, public HTTPS smoke and order/inventory reconciliation.

### 12. Observability

At minimum collect and alert on:

- Nginx 5xx rate
- frontend systemd restart/failure count
- API readiness failure
- PHP-FPM saturation/errors
- queue failed jobs and queue age
- scheduler timer failure
- backup age/failure
- disk, inode, memory and database capacity
- structured `WINIMI_WEB_VITAL` LCP/INP/CLS logs

Core Web Vitals dashboards must report mobile and desktop 75th percentiles separately. Application RUM payloads must remain free of customer, order, form, IP and user-agent fields.

### 13. Search activation inside Phase 19

After public HTTPS smoke succeeds:

- verify Search Console ownership
- submit `https://winimibakery.com/sitemap.xml`
- inspect representative home, category, product, article and city URLs
- run live Rich Results validation for Product and BlogPosting pages
- confirm robots and canonical URLs from the public internet

This does not guarantee rankings or rich-result display.

## Final evidence required

Record:

- frontend and backend release IDs/commit SHAs
- release manifest and SEO release-candidate hashes
- migration status
- service and timer status
- Nginx configuration test
- DNS and certificate names/expiry
- internal and public health responses
- backup archive checksum and restore-drill result
- rollback-drill result
- Search Console sitemap submission result
- unresolved operational warnings

Only then set:

```text
production_deployed=ready
```
