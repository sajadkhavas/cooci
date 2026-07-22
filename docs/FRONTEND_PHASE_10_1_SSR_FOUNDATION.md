# Frontend Phase 10.1 — SSR foundation

Marker: `frontend_ssr_foundation=ready`

## Delivered runtime

- React 19.2.7 with React Router Framework Mode 7.18.1 and Vite 7.3.6
- typed route modules with server rendering and client hydration
- Persian RTL root document rendered on the server
- per-response CSP nonces for framework scripts and JSON-LD
- hydration-safe cart persistence and unchanged Laravel transaction authority
- private/no-store account, cart, checkout and payment surfaces
- deterministic SSR release format containing client, server and bundled Node runtime
- Nginx immutable asset serving plus streamed SSR proxying
- hardened systemd unit, atomic restart hooks, health checks and rollback
- source-HTML acceptance before hydration in deployment and Laravel browser topology

## Deployment boundary

The repository is ready for a Node 22 SSR process behind Nginx. Live activation still requires server access, DNS/TLS installation and the external provider credentials already documented for Phase 19.
