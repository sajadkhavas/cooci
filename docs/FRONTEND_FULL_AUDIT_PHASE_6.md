# Frontend full audit — Phase 6

Phase 6 audits shared components, navigation semantics, keyboard/focus behavior, live regions, dialogs, motion preferences and component-level resilience.

## Threat and failure model

- Navigation state must not announce the wrong page as current.
- Mobile dialogs must trap focus, close with Escape, restore focus only for dismissals, and never strand body scroll.
- Route announcements must not race after rapid navigation or announce a previous page.
- Skip links and route changes must lead keyboard and screen-reader users to meaningful content.
- Dynamic status, loading and error messages must use appropriate live-region semantics without duplicate announcements.
- Decorative icons must remain hidden from assistive technology; icon-only controls need stable accessible names.
- Programmatic smooth scrolling and animation must respect `prefers-reduced-motion`.
- Shared components must not generate nested interactive controls, duplicate IDs, invalid current-page semantics or horizontal overflow.
- Error and loading boundaries must expose recoverable actions and move focus to the new status when appropriate.

## Completion gates

1. Header desktop/mobile current-page semantics are route-accurate.
2. Mobile navigation focus trapping and restoration are deterministic and covered by browser tests.
3. Route announcer timers are cancelled and the main landmark receives focus after route navigation without stealing focus on initial load.
4. Reduced-motion behavior covers programmatic scrolling and shared animations.
5. Shared status/error/loading components have explicit accessible roles and focus behavior.
6. Static audit and unit tests lock navigation matching and focus/motion helpers.
7. Desktop and mobile Chromium verify keyboard opening, focus cycling, Escape dismissal, route navigation and no horizontal overflow.
