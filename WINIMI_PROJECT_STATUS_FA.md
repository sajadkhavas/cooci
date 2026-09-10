# وضعیت مرجع پروژه WINIMI

آخرین reconciliation: 2026-09-10

> این فایل مرجع شماره ۱ ادامه کار است. ابتدا همین فایل، سپس `docs/WINIMI_LIVING_HANDOFF_FA.md`، `docs/F31_FINAL_ACCEPTANCE_HANDOFF_WORKLOG_FA.md` و `docs/F31_FILAMENT_CONTROL_COVERAGE_AUDIT_FA.md` خوانده شوند. بعد وضعیت زنده PR/CI از GitHub دوباره بررسی شود.

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
F31_IMPLEMENTATION_ACCEPTED=YES
F31_FORMAL_HANDOFF=NOT_COMPLETE
LIVE_SITE_DISCOVERY_AS_SOURCE=FORBIDDEN_BY_OWNER
```

## Repositories and accepted implementation heads

```text
FRONTEND_REPO=sajadkhavas/cooci
FRONTEND_BRANCH=f31/final-acceptance-handoff
FRONTEND_PR=54
FRONTEND_IMPLEMENTATION_HEAD=584aecf5bafac9fa6b757fdd937495be25ab989d
FRONTEND_CI=5_OF_5_SUCCESS

BACKEND_REPO=sajadkhavas/winimi-bakery-backend
BACKEND_BRANCH=f31/final-acceptance-handoff
BACKEND_PR=17
BACKEND_IMPLEMENTATION_HEAD=96170b03c28548e627e4bf9255addaef745d9df1
BACKEND_CI=4_OF_4_SUCCESS

TRACKER=cooci#55
REVIEW_THREADS=0
UNRESOLVED_ADMIN_P0=0
UNRESOLVED_ADMIN_P1=0
```

### Frontend run IDs

```text
F30_AUTHORITY=34460666477 SUCCESS
FRONTEND_CI=34460666353 SUCCESS
PHASE18_E2E=34460666344 SUCCESS
PHASE8_DEPLOYMENT=34460666422 SUCCESS
PHASE19_PACKAGE=34460666319 SUCCESS
```

### Backend run IDs

```text
F30_AUTHORITY=34461694563 SUCCESS
BACKEND_CI=34461694652 SUCCESS
PHASE18_BACKEND=34461694575 SUCCESS
PHASE19_PACKAGE=34461694663 SUCCESS
```

## Architecture locked for delivery

- Backend/Filament is authoritative for owner-managed content, catalog, operational data and public settings.
- Frontend owns layout, responsive behavior, accessibility mechanics and security-safe system behavior.
- Footer navigation is Backend/API/SSR-managed.
- PWA name/colors/shortcuts/offline copy are StoreSetting-managed; Service Worker logic/icons stay release-managed.
- `/app.webmanifest` is the installed managed manifest and is covered by browser acceptance.
- Sensitive offline fallback is static/no-script.
- Search Console/GA4/GTM accept only public identifiers; Analytics remains consent-gated.
- Push subscription inventory is masked/read-only.
- Legacy duplicate Filament resources are hidden, not deleted.
- StoreSetting has specialized editors, including bulk category slugs and eNAMAD operator input.
- Migrations that seed operator-owned settings preserve existing values and do not destructively remove them on rollback.

## Decision Support jitter

The desktop-only Decision Support repair is intentionally local: the old Reveal transform wrapper was removed only there and the desktop paint path disables the heavy pseudo-layer/contain combination for that section. Previous component generations were compared before accepting this fix.

## Production boundary

Current GitHub candidates are newer than the last recorded Production source. No production mutation is claimed by this reconciliation. Formal delivery therefore still requires one final immutable production deployment after PR merge and post-merge CI.

Historical Production/payment/login/backup/restore/push evidence remains retained and must not be repeated merely for F31 closure.

## CURRENT_NEXT_ACTION

```text
NEXT=SYNC_DOCS_AND_RUN_EXACT_HEAD_CI
THEN=READY_AND_MERGE_PR17_PR54
THEN=POST_MERGE_MAIN_CI
THEN=ONE_FINAL_IMMUTABLE_PRODUCTION_DEPLOY
THEN=READ_ONLY_HEALTH_SOURCE_PWA_RECONCILIATION
THEN=FINAL_TAG_FREEZE_TRACKER_CLOSE_HANDOFF

REAL_PAYMENT_REPEAT=NO
REAL_ORDER_REPEAT=NO
GOOGLE_LOGIN_REPEAT=NO
PUSH_DELIVERY_REPEAT=NO
BACKUP_RESTORE_ROLLBACK_REPEAT=NO_UNLESS_INVALIDATED
```

Only after production source/release alignment may the final markers become:

```text
F31=COMPLETED
WINIMI_FINAL_DELIVERY=PASS
PRODUCTION=READY
HANDOFF=COMPLETE
```
