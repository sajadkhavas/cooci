# Frontend full audit — Phase 8

Phase 8 makes the storefront release reproducible, secret-free, atomically deployable and independently verifiable before any production credential is activated.

## Threat and failure model

- Vite environment variables are public build inputs, never a secret store.
- Unknown `VITE_*` values can silently expose credentials or enable development-only behavior.
- A green Vite build does not prove that the release directory contains only intended static files.
- Copying files directly into the active web root can expose a partially uploaded release.
- A rollback that does not verify the target artifact can replace one broken release with another.
- Nginx must implement SPA routing, cache boundaries, compression and security headers; hosting metadata files are not authoritative on a self-hosted server.
- HTML, the manifest and the service worker must remain revalidatable while hashed assets are immutable.
- CSP must be enforced without wildcard script, object or frame execution.
- Production smoke checks must validate deep routes, headers, compression, PWA assets and a health endpoint through HTTPS.

## Completion gates

1. The exact production environment schema accepts only seven public build values and rejects unknown `VITE_*` keys.
2. The release creator scans every built byte for private keys, provider credentials, source maps and secret-shaped values.
3. Every release has a deterministic content-addressed ID and SHA-256 manifest.
4. Deployment verifies the manifest before an atomic `current` symlink switch.
5. Rollback verifies the selected previous release and switches atomically.
6. Nginx enforces HTTPS, HSTS, CSP, security headers, gzip, immutable hashed assets and no-cache application shell files.
7. CI performs two deterministic deployments, verifies the active release, rolls back, validates Nginx syntax and runs HTTPS smoke tests.
8. No payment, SMS, eNAMAD, database, application or TLS private credential can enter the frontend artifact.
