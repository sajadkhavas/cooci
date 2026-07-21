# Frontend full audit — Phase 5

Phase 5 audits public content, SEO metadata, structured data, persisted inquiries and the eNAMAD trust boundary.

## Threat model

- Every store-settings, page, FAQ, gallery, post, city, review and inquiry response is untrusted runtime data until parsed.
- Backend-provided image and link URLs must not introduce executable, credential-bearing, protocol-relative or insecure production URLs.
- Canonical URLs must remain on the configured storefront origin; an API payload must not point search engines to another origin.
- JSON-LD must be serialized as inert script text and must not permit a `</script>` breakout.
- Public content remains plain structured text. Raw backend HTML is never rendered.
- eNAMAD code is data, not executable markup. Only exact HTTPS URLs on `trustseal.enamad.ir` may be extracted.
- Inquiry form metadata is bounded, contact fields are normalized, duplicate submissions are blocked in the UI, and backend validation/rate limits remain authoritative.

## Completion gates

1. Runtime Zod contracts cover all public content APIs and pagination metadata.
2. URL policies cover media, links, canonical URLs and trust-seal URLs.
3. SEO JSON-LD is escaped before insertion.
4. Inquiry success is based on a parsed persisted response, not a TypeScript assertion.
5. Unit tests exercise malicious URLs, malformed content, JSON-LD breakout attempts and inquiry contracts.
6. Desktop and mobile Laravel acceptance verifies blog/city content, an actual inquiry submission and the disabled eNAMAD placeholder.
