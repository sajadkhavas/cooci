# Winimi Bakery frontend deployment

The production frontend is a static Vite build served by Nginx from:

```text
/var/www/winimi/frontend/current/dist
```

## Important boundary

`public/_headers` is metadata for hosting platforms that explicitly support that file. A self-hosted Nginx server does not read it. Production cache and security headers must be configured in Nginx using `deploy/nginx/winimi-frontend.conf.example`.

## Production build

```bash
npm ci
SITE_URL=https://winimibakery.com \
VITE_SITE_ORIGIN=https://winimibakery.com \
VITE_USE_BACKEND=true \
VITE_API_BASE_URL=https://api.winimibakery.com \
VITE_ALLOW_DEV_MOCKS=false \
VITE_AUTH_MODE=disabled \
VITE_PAYMENT_MODE=disabled \
npm run check
```

The `dist/` directory is the only frontend artifact copied to the release web root. Source files, `.env` files, node_modules and Git metadata are not web-accessible.

## Nginx install

```bash
sudo cp deploy/nginx/winimi-frontend.conf.example /etc/nginx/sites-available/winimi-frontend
sudo ln -sfn /etc/nginx/sites-available/winimi-frontend /etc/nginx/sites-enabled/winimi-frontend
sudo nginx -t
sudo systemctl reload nginx
```

Certificate paths in the example must exist before enabling the TLS server blocks.

## Header verification

Run after HTTPS is live:

```bash
curl -I https://winimibakery.com/
curl -I https://winimibakery.com/index.html
curl -I https://winimibakery.com/sw.js
curl -I https://winimibakery.com/manifest.webmanifest
curl -I https://winimibakery.com/assets/<hashed-file>.js
```

Expected behavior:

- HTML and SPA routes: no-cache / must-revalidate
- service worker: no-cache, no-store
- hashed assets: one-year immutable cache
- browser security headers are present on production responses

HSTS stays commented until certificates, redirects and both public hostnames have been verified. CSP starts in report-only mode and is enforced only after checking all required image, font, API and analytics origins.
