# Frontend full audit — Phase 4

Phase 4 audits the complete checkout, order and payment lifecycle without changing the frozen Laravel API contract.

## Authoritative boundaries

- Laravel is authoritative for product price, stock, delivery eligibility, fees, discounts, totals, order ownership, cancellation eligibility and payment status.
- The frontend sends only address/customer selection, delivery method, Variant IDs and quantities.
- Gateway callback query parameters are untrusted hints. They are never treated as payment proof.
- The cart and checkout draft may be cleared only after a runtime-validated backend response proves that the payment attempt is verified and the order payment status is paid.
- Browser-stored mock orders are development-only and never become a production fallback.

## Threats reviewed

1. Reload or ambiguous network failure losing the checkout Idempotency key and creating a duplicate order.
2. Reusing one Idempotency key after the checkout payload changes.
3. Executing an unsafe or unexpected payment redirect URL returned by an upstream response.
4. Trusting TypeScript interfaces for malformed Order or Payment payloads at runtime.
5. Clearing the cart from callback query parameters or an internally inconsistent verification response.
6. Retrying payment against a different order, a paid order, or an order not owned by the current session.
7. Showing cancellation controls beyond the server-provided `canCancel` boundary.
8. Allowing development mock storage or mock payment routes in production.
9. Leaking recipient, gateway or payment data through URLs, logs or persistent browser storage.

## Completion gates

- persistent payload-bound checkout intent with expiration and deterministic tests
- strict payment redirect policy for same-origin testing callbacks and approved HTTPS gateway hosts
- runtime Order, Payment Attempt, Checkout and verification response schemas
- verified-success predicate requiring consistent order and payment truth
- source audit and unit tests for duplicate submission, redirect attacks and malformed payloads
- coordinated desktop/mobile browser acceptance against Laravel testing payment provider
- full lint, TypeScript and production build success
