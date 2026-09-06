# Phase 27 — Cross-project design synthesis

## Scope

This phase reviews three existing storefronts and translates only reusable patterns into Winimi:

- LBB: `sajadkhavas/lbb@integration/final-pwa-reviewed`
- SOLE: `sajadkhavas/solemate-kickz@integration/sole-frontend-v2`
- Rosta: `sajadkhavas/of-rosta-coffee2@integration/rosta-release-candidate`
- Winimi base: `sajadkhavas/cooci@7dfc74d6904bb4e57b73fca43fa4f042d1ca09f4`

No dark streetwear palette, shoe-specific interaction, coffee-specific taxonomy, or heavy decorative motion is copied.

## Findings and decisions

| Source | Strong pattern | Winimi translation | Decision |
| --- | --- | --- | --- |
| LBB | Product-first narrative, quick category access, decision-support hierarchy | Keep the existing product-first hero and add a concise decision-support panel with clear paths | Adopt |
| LBB | Dense dark editorial art direction and drop/countdown language | Conflicts with Winimi's friendly bakery positioning | Reject |
| SOLE | Touch-first quick-shop paths, motion restraint, explicit reduced-motion handling | Add keyboard/pointer control to the draggable marquee and preserve large touch targets | Adopt |
| SOLE | Kinetic typography, 3D product behavior, hype-driven merchandising | Too heavy and category-specific for Winimi | Reject |
| Rosta | Structured guides, FAQ blocks, topical content that bridges education and commerce | Add visible FAQ content and matching FAQPage JSON-LD | Adopt |
| Rosta | Roast, origin, grinder and brewing taxonomy | Not relevant to Winimi | Reject |

## Global shell and commerce review

The navigation, mobile bottom navigation, product card and footer implementations were also compared. Winimi's current versions already provide stronger domain correctness for live stock, cooling requirements, price ranges, cart limits, safe-area spacing, mobile drawer coordination and business contact data. They remain the canonical implementation.

Patterns retained as review criteria—but not copied as new code—are:

- active-route clarity and explicit ARIA labelling from LBB and SOLE;
- minimum touch-target sizing and safe-area behavior from SOLE;
- readable product-media hierarchy from LBB;
- content-to-commerce links from Rosta.

This avoids replacing production-aware Winimi components with visually interesting but less complete demo components.

## Implemented synthesis

1. Added `DecisionSupportPanel`:
   - three intent-based entry paths;
   - four native, accessible FAQ disclosures;
   - no client-only data dependency;
   - content appropriate to active catalog, delivery, and checkout behavior.

2. Added homepage FAQ structured data through the existing CSP-safe `SEO` component.

3. Improved the hero category shortcuts:
   - horizontal scroll and snap on small screens;
   - wrapping on larger screens;
   - 44px-equivalent touch targets and visible focus state.

4. Improved `DraggableMarquee`:
   - ArrowLeft/ArrowRight/Home keyboard support;
   - pointer-cancel cleanup;
   - native touch scrolling;
   - reduced-motion-compatible programmatic scrolling.

5. Added isolated component styles using Winimi's existing pastel green and restrained terracotta tokens.

## Guardrails

- Dynamic catalog data continues to come from the existing backend hooks.
- Existing routes, cart behavior, authentication, checkout, footer, and deployment scripts are untouched.
- FAQ wording avoids promises about fixed delivery methods or inventory.
- Decorative motion remains optional and respects `prefers-reduced-motion`.
- New UI remains usable without JavaScript-only gesture behavior.

## Acceptance gates

Run the repository's standard commands before merge:

```bash
npm ci
npm run lint
npm run typecheck
npm test
npm run build
```

Then verify desktop and mobile for:

- homepage SSR status and content;
- category shortcut keyboard/touch behavior;
- marquee mouse, touch and keyboard behavior;
- FAQ expansion and focus order;
- product/catalog backend data;
- reduced-motion mode;
- no horizontal page overflow.
