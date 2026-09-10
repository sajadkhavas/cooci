# وضعیت مرجع پروژه WINIMI

آخرین reconciliation نهایی: 2026-09-10

> مرجع شماره ۱ ادامه کار. F31 بسته شده است. برای بررسی تاریخی ابتدا همین فایل، سپس `docs/WINIMI_LIVING_HANDOFF_FA.md`، `docs/F31_FINAL_ACCEPTANCE_HANDOFF_WORKLOG_FA.md` و `docs/F31_FILAMENT_CONTROL_COVERAGE_AUDIT_FA.md` خوانده شوند.

## CURRENT_STATUS

```text
PROJECT=WINIMI_COOCI
CURRENT_PHASE=F31_FINAL_ACCEPTANCE_HANDOFF
PHASE28=CLOSED
F29S=CLOSED
F29=CLOSED
F30=CLOSED
PHASE19B=CLOSED
PHASE20=CLOSED
F31=COMPLETED
F31_IMPLEMENTATION_ACCEPTED=YES
WINIMI_FINAL_DELIVERY=PASS
PRODUCTION=READY
HANDOFF=COMPLETE
LIVE_SITE_DISCOVERY_AS_SOURCE=FORBIDDEN_BY_OWNER
UNRESOLVED_ADMIN_P0=0
UNRESOLVED_ADMIN_P1=0
```

## Final GitHub sources

```text
FRONTEND_REPO=sajadkhavas/cooci
FRONTEND_PR=54 MERGED
FRONTEND_IMPLEMENTATION_HEAD=584aecf5bafac9fa6b757fdd937495be25ab989d
FRONTEND_MERGED_DEPLOYED_SOURCE=7d5e3fe03b11bc007652908b5f2fff2e78504b31
FRONTEND_FREEZE_BRANCH=freeze/winimi-f31-final-20260910

BACKEND_REPO=sajadkhavas/winimi-bakery-backend
BACKEND_PR=17 MERGED
BACKEND_IMPLEMENTATION_HEAD=96170b03c28548e627e4bf9255addaef745d9df1
BACKEND_MERGED_DEPLOYED_SOURCE=a2e5c48e8c73c49caaac1f5c9cbb0f608f066e3b
BACKEND_FREEZE_BRANCH=freeze/winimi-f31-final-20260910

TRACKER=cooci#55
REVIEW_THREADS=0
OPEN_DELIVERY_PRS=0
```

## Final post-merge CI

Frontend merged `main`:

```text
FRONTEND_CI=34463202521 SUCCESS
PHASE19_PACKAGE=34463202553 SUCCESS
PHASE8_DEPLOYMENT=34463202560 SUCCESS
PHASE18_E2E=34463202542 SUCCESS
POST_MERGE_FRONTEND=4_OF_4_SUCCESS
```

Backend merged `main`:

```text
BACKEND_CI=34463190852 SUCCESS
PHASE19_PACKAGE=34463190793 SUCCESS
PHASE18_BACKEND=34463190823 SUCCESS
POST_MERGE_BACKEND=3_OF_3_SUCCESS
```

## Final Production alignment

Production host attested: `hwsrv-1332134.hostwindsdns.com`.

```text
FRONTEND_RELEASE=b0d20cd656e5e5d680c3
FRONTEND_SOURCE=7d5e3fe03b11bc007652908b5f2fff2e78504b31
FRONTEND_CURRENT=/var/www/winimi/frontend/releases/b0d20cd656e5e5d680c3

BACKEND_RELEASE=49045150d53cd2be5c2b
BACKEND_SOURCE=a2e5c48e8c73c49caaac1f5c9cbb0f608f066e3b
BACKEND_CURRENT=/var/www/winimi/backend/releases/49045150d53cd2be5c2b

RECONCILIATION_RESULT=PASS
DEPLOY_RESULT=PASS_CONFIRMED
ORDERS_BEFORE=4
ORDERS_AFTER=4
PAYMENT_ATTEMPTS_BEFORE=4
PAYMENT_ATTEMPTS_AFTER=4
BACKEND_SHARED_ENV_UNCHANGED=YES
FRONTEND_RUNTIME_ENV_UNCHANGED=YES
DB_MUTATION_DURING_RECONCILIATION=NO
ORDER_MUTATION_DURING_RECONCILIATION=NO
PAYMENT_MUTATION_DURING_RECONCILIATION=NO
```

Backend `/health` and `/api/system/ready`, frontend internal SSR health, public `/`, `/products`, `/app.webmanifest` and `/sw.js` all passed. PWA manifest returned `application/manifest+json; charset=utf-8`, name `وینیمی بیکری`, short name `وینیمی` and two icons.

## Architecture locked for delivery

- Backend/Filament is authoritative for owner-managed content, catalog, operational data and public settings.
- Frontend owns layout, responsive behavior, accessibility mechanics and security-safe system behavior.
- Footer navigation is Backend/API/SSR-managed.
- PWA name/colors/shortcuts/offline copy are StoreSetting-managed; Service Worker logic/icons stay release-managed.
- Search Console/GA4/GTM accept only public identifiers; Analytics remains consent-gated.
- Push subscription inventory is masked/read-only.
- Legacy duplicate Filament resources are hidden, not deleted.
- Operator-owned setting migrations preserve existing values and use non-destructive rollback semantics.

## Retained acceptance — do not repeat without regression evidence

- real Google Login Production acceptance
- authenticated checkout
- real paid/verified Zarinpal order
- live Web Push delivery acceptance
- Phase19B backup/restore/reboot/rollback evidence

## FINAL_MARKERS

```text
F31=COMPLETED
WINIMI_FINAL_DELIVERY=PASS
PRODUCTION=READY
HANDOFF=COMPLETE
FINAL_FREEZE=PASS
DEPLOY_REPEAT=NO
NEXT=POST_HANDOFF_MAINTENANCE_ONLY
```

The closure documentation commit may be newer than the deployed frontend source because documentation files are not runtime release input. The immutable Production source remains the deployed SHA pinned by `freeze/winimi-f31-final-20260910`.