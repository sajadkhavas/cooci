# Winimi Bakery Storefront

Production storefront for Winimi Bakery, built with React, TypeScript, Vite and Tailwind CSS.

The production backend lives in `sajadkhavas/winimi-bakery-backend` and is completed before the full integration phase.

## Current status

| Area | Status |
|---|---|
| Responsive storefront and route structure | Complete |
| Full modern editorial UI | Complete in Phase 9.5 |
| Cart, checkout, OTP, account and payment-state UX | Prepared |
| Backend catalog integration | Phase 17 |
| Backend authentication integration | Phase 17 |
| Backend checkout/order/payment integration | Phase 17 |
| End-to-end completion | Phase 18 |
| Production deployment | Phase 19 |
| External activation only | Phase 20 |

The complete audited roadmap and current integration gaps are documented in:

- `docs/FULL_LAUNCH_ROADMAP.md`
- `docs/checkout-api-contract.md`

## Locked delivery strategy

All internal frontend and backend work is completed before public activation. At the end of Phase 19, the only remaining supplied values are:

1. payment gateway credentials / Zarinpal Merchant ID
2. eNAMAD badge code
3. SMS provider API key and approved OTP template

No additional implementation work may be deferred to the activation phase.

## Technology

- React 18
- TypeScript
- Vite
- React Router
- TanStack Query
- Tailwind CSS
- Radix/shadcn UI primitives
- React Hook Form + Zod
- PWA service worker and performance budgets

## Local setup

```bash
npm ci
cp .env.example .env
npm run dev
```

## Validation

```bash
npm run check
```

The validation pipeline includes:

- route and content audit
- accessibility regression audit
- content integrity audit
- full modern UI audit
- full-launch roadmap audit
- ESLint
- TypeScript
- production build
- performance budget enforcement

## Safe environment defaults

```env
SITE_URL=https://winimibakery.com
VITE_SITE_ORIGIN=https://winimibakery.com
VITE_USE_BACKEND=false
VITE_API_BASE_URL=https://api.winimibakery.com
VITE_AUTH_MODE=disabled
VITE_PAYMENT_MODE=disabled
```

The frontend must never contain payment credentials, SMS API keys, verification secrets or trusted payment state.

## Current integration boundary

Before Phase 17:

- products are sourced from the verified static catalog
- mock authentication/payment may be used only for development
- local orders exist only as a development fallback
- production backend modes remain disabled

During Phase 17 these boundaries are replaced by one typed API client, Sanctum CSRF/session handling, server catalog data, server-authoritative checkout and customer-owned orders.

## Production domains

```text
https://winimibakery.com
https://www.winimibakery.com
https://api.winimibakery.com
```

Deployment, DNS, HTTPS, secure cookies, queue/scheduler, backups, monitoring and rollback are completed in Phase 19 while payment, eNAMAD and SMS remain disabled until their three external values are supplied.

## Locked phase roadmap

- Phase 1–9.5: storefront foundation and full-modern frontend — complete
- Phase 10–13: backend foundation, catalog, customer auth, checkout and orders — complete
- Phase 13.5: full-launch audit and roadmap lock — current
- Phase 14: provider-ready payment backend
- Phase 15: complete store operations backend
- Phase 16: backend completion and contract freeze
- Phase 17: full frontend/backend integration
- Phase 18: end-to-end completion
- Phase 19: production server deployment
- Phase 20: external activation only
