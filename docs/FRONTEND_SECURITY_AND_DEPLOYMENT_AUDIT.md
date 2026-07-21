# Winimi frontend security and deployment audit

Audit version: `2026-07-21-phase-9`

Final marker: `frontend_security_and_deployment_audited=ready`

## Covered surfaces

- React/TypeScript storefront and all public/protected routes
- frozen Laravel API contract `2026-07-20-phase-16`
- authentication, CSRF, session expiry and rate limiting
- server-authoritative catalog, cart, delivery, checkout, orders and payment
- PWA installation, versioned caches, offline and reconnect behavior
- deterministic production bundle and secret scan
- content-addressed releases, Nginx, TLS, security headers, compression and rollback
- desktop and mobile Chromium acceptance

## Evidence policy

The marker is valid only while all of these remain green on the marker commit:

1. Frontend CI phases 1–9, unit tests, lint, TypeScript and production build
2. Phase 8 Deployment Readiness with real Nginx, TLS smoke, release A/B and rollback
3. coordinated Laravel production-build browser acceptance
4. Phase 9 coordinated source audit of backend stock, delivery, idempotency, payment replay and rate-limit tests
5. Phase 9 adversarial browser tests for 429 recovery and hostile URL/query handling
6. PWA real-network fail-closed and reconnect acceptance

## External activation boundary

This marker does not claim that live providers have been activated. These values remain external and absent from the frontend repository and bundle:

- Zarinpal Merchant ID
- eNAMAD badge code
- Kavenegar API key and approved OTP template

Production DNS/server deployment and live-provider verification are operational launch activities outside this frontend audit marker.
