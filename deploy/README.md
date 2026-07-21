# Winimi Bakery frontend deployment

The frontend is a deterministic static release served from:

```text
/var/www/winimi/frontend/
├── releases/frontend-<content-hash>/
├── current -> releases/frontend-<content-hash>
└── active-release
```

Only `current/dist` is web-accessible. Source files, Git metadata, `.env`, dependency folders, TLS keys and backend credentials never enter a frontend release.

`public/_headers` is retained for compatible static hosts and local artifact checks. A self-hosted Nginx server does not read `public/_headers`; the rendered Nginx configuration below is the production source of truth.

## 1. Validate the public production environment

```bash
node scripts/validate-production-env.mjs \
  deploy/frontend.production.env.schema.json \
  deploy/frontend.production.env.example
```

The exact public values are:

```env
SITE_URL=https://winimibakery.com
VITE_SITE_ORIGIN=https://winimibakery.com
VITE_USE_BACKEND=true
VITE_API_BASE_URL=https://api.winimibakery.com
VITE_ALLOW_DEV_MOCKS=false
VITE_AUTH_MODE=disabled
VITE_PAYMENT_MODE=disabled
```

No payment, SMS, eNAMAD, database or Laravel credential belongs in a Vite variable.

## 2. Build and create the release

```bash
set -a
. deploy/frontend.production.env.example
set +a
npm ci
npm run check
npm run release:create
npm run release:verify -- "$(node -e 'const r=require("./release-output.json");process.stdout.write(r.releaseDir)')"
```

The Release ID is a SHA-256-derived content identifier. Rebuilding identical bytes produces the same release ID and manifest.

## 3. Deploy atomically

```bash
sudo KEEP_RELEASES=5 deploy/bin/deploy-frontend.sh \
  "$(node -e 'const r=require("./release-output.json");process.stdout.write(r.releaseDir)')" \
  /var/www/winimi/frontend
```

The deployment script verifies every file, copies to a staging directory, verifies again and atomically replaces the `current` symlink. A partial copy can never become active.

## 4. Render and install Nginx

```bash
node scripts/render-frontend-nginx.mjs
sudo install -d -m 0755 /etc/nginx/snippets
sudo install -m 0644 deploy/nginx/winimi-security-headers.conf \
  /etc/nginx/snippets/winimi-security-headers.conf
sudo install -m 0644 deploy/nginx/winimi-frontend.conf \
  /etc/nginx/sites-available/winimi-frontend
sudo ln -sfn /etc/nginx/sites-available/winimi-frontend \
  /etc/nginx/sites-enabled/winimi-frontend
sudo nginx -t
sudo systemctl reload nginx
```

The security-header snippet is included at server scope and inside every location that adds a cache or service-worker header. This avoids Nginx `add_header` inheritance removing CSP or HSTS from HTML, PWA and asset responses.

The rendered configuration enforces HTTPS, HSTS, CSP, security headers, gzip, SPA fallback, immutable hashed assets and no-cache HTML/PWA shell files.

## 5. Production smoke test

```bash
deploy/bin/smoke-test-frontend.sh https://winimibakery.com
```

The smoke test validates:

- root and deep SPA routes
- frontend health endpoint
- HSTS and enforced CSP
- frame, referrer, permissions and MIME protections
- service-worker scope and cache policy
- manifest content type and cache policy
- immutable asset caching and gzip
- denial of dotfiles and source maps

## 6. Rollback

```bash
sudo deploy/bin/rollback-frontend.sh /var/www/winimi/frontend
```

Without a release ID, rollback selects the newest verified release other than the active one. An explicit target may be supplied as the second argument. The selected manifest is verified before the atomic symlink switch.

## 7. Post-deployment checks

```bash
readlink -f /var/www/winimi/frontend/current
cat /var/www/winimi/frontend/active-release
sudo nginx -t
systemctl is-active nginx
deploy/bin/smoke-test-frontend.sh https://winimibakery.com
```

Rollback must be exercised once in staging before the first production switch and after any change to the release scripts or Nginx template.
