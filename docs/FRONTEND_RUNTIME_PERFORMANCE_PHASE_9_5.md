# Frontend runtime performance — Phase 9.5

Marker: `frontend_runtime_performance_audited=ready`

## Conclusion

The slow editor preview was not solely a Lovable hosting problem.

Lovable instrumentation is restricted to Vite development mode through `mode === "development" && componentTagger()`. A production deployment removes the editor iframe, HMR, development transforms and component tagging, and it adds minification, compression and long-lived asset caching. Those changes improve startup and transfer time.

They do not move paint, compositing, sticky layers or scroll-linked JavaScript to the server. The pre-fix production build reproduced severe scroll jank behind the same HTTPS/Laravel topology used by acceptance CI, proving that deployment alone would not have fixed the problem.

## Static bundle evidence

The project was already within its static budgets before this phase:

- 42 JavaScript chunks
- entry JavaScript: about 57 KiB gzip
- total JavaScript: about 231 KiB gzip
- CSS: about 20 KiB gzip
- largest image: about 262 KiB
- no source maps and no performance-budget warning

After the fixes and the new mobile navigation, the production bundle remains within budget:

- entry JavaScript: about 58 KiB gzip
- total JavaScript: about 230 KiB gzip
- CSS: about 21 KiB gzip
- largest image unchanged

The primary bottleneck was therefore runtime rendering rather than network payload size.

## Root causes

1. repeated `backdrop-filter`/glass effects across cards, controls and the sticky header
2. large ambient blur layers and continuously floating decorations on mobile GPUs
3. `ScrollProgress` writing React state during the scroll animation-frame path
4. each `Reveal` observer causing a React render while the page was moving
5. development/editor overhead making the underlying client-side rendering cost more visible

## Fixes

- add a last-mile runtime stylesheet with a cheaper mobile/coarse-pointer paint path
- remove expensive backdrop filters from mobile cards and sticky surfaces
- suppress large ambient blur layers and non-essential infinite floating motion on mobile
- change horizontal overflow handling from a hidden scroll container to `overflow-x: clip`
- update scroll progress through one compositor transform per animation frame with no React state
- cache the scroll range and refresh it through `ResizeObserver`
- make one-shot reveal transitions add a DOM class without component re-renders
- preserve full `prefers-reduced-motion` behavior
- retain the richer desktop visual language while reducing scroll-linked work

## Runtime comparison

Both runs used the production Vite build, the real Laravel acceptance backend, HTTPS proxies, Chromium desktop/mobile projects and 4x CPU throttling.

| Route | Baseline p95 frame | Fixed p95 frame | Change | Frames over 50 ms |
|---|---:|---:|---:|---:|
| Mobile home | 66.8 ms | 16.8 ms | 74.9% lower | 14 → 0 |
| Mobile products | 66.7 ms | 16.8 ms | 74.8% lower | 16 → 0 |
| Desktop home | 116.6 ms | 83.2 ms | 28.6% lower | 32 → 26 |
| Desktop products | 150.0 ms | 66.8 ms | 55.5% lower | 32 → 27 |

Mobile scrolling reached an approximately 60 FPS cadence in the throttled production test. Desktop keeps more of the rich visual treatment, so its improvement is intentionally more conservative.

## Mobile bottom navigation

A new five-destination bottom navigation is included for widths below the `md` breakpoint:

- home
- gift
- emphasized store action
- cart with a live item-count badge
- authenticated account or login destination

The component uses a solid high-opacity surface rather than backdrop blur, respects the bottom safe area, exposes `aria-current`, remains hidden on desktop, and moves the floating WhatsApp control above it to prevent overlap. Browser acceptance verifies visibility, route changes, account destination, viewport placement and WhatsApp separation.

## Validation boundary

This phase tests a production build and production-like HTTPS topology, not Lovable's editor preview. A live physical-device smoke test should still be repeated after Phase 19 deployment because browser versions, thermal throttling and low-end Android GPUs cannot be fully represented by CI.
