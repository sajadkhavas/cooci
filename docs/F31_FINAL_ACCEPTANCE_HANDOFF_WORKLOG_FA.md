# WINIMI F31 — Final Acceptance & Handoff Worklog

Snapshot: 2026-09-10

این فایل وضعیت جاری F31 را نگه می‌دارد. checkpointهای تاریخی قبلی در Git history و اسناد فازهای بسته‌شده باقی مانده‌اند و نباید بر GitHub HEAD جاری مقدم شوند.

## قوانین ثابت

- هیچ phase بسته‌شده‌ای بدون evidence جدید دوباره باز نشود.
- خرید واقعی Zarinpal، Google Login واقعی، order creation، Push delivery acceptance، backup/restore/reboot/rollback قبلی تکرار نشوند مگر evidence تازه آن‌ها را invalidate کند.
- «کشف‌های سایت زنده» ردشده توسط مالک پروژه، source of truth این closure نیستند.
- Production mutation در مرحله GitHub closure انجام نمی‌شود.
- یک Deploy نهایی بعد از Merge/Post-merge CI انجام می‌شود.

## Accepted implementation candidates

```text
FRONTEND_HEAD=584aecf5bafac9fa6b757fdd937495be25ab989d
BACKEND_HEAD=96170b03c28548e627e4bf9255addaef745d9df1
FRONTEND_PR=54
BACKEND_PR=17
TRACKER=cooci#55
REVIEW_THREADS_FRONTEND=0
REVIEW_THREADS_BACKEND=0
```

### Frontend evidence

```text
F30_AUTHORITY_RUN=34460666477 SUCCESS
FRONTEND_CI_RUN=34460666353 SUCCESS
PHASE18_E2E_RUN=34460666344 SUCCESS
PHASE8_DEPLOYMENT_RUN=34460666422 SUCCESS
PHASE19_PACKAGE_RUN=34460666319 SUCCESS
FRONTEND_EXACT_HEAD=5_OF_5_SUCCESS
```

Phase18 #594 passed desktop/mobile Laravel acceptance, dynamic SSR, crawl/index, product/merchant SEO, content/topical authority, local SEO, CWV/media, SEO release candidate, PWA segment, final adversarial Phase9 and runtime scroll baseline.

### Backend evidence

```text
F30_AUTHORITY_RUN=34461694563 SUCCESS
BACKEND_CI_RUN=34461694652 SUCCESS
PHASE18_BACKEND_RUN=34461694575 SUCCESS
PHASE19_PACKAGE_RUN=34461694663 SUCCESS
BACKEND_EXACT_HEAD=4_OF_4_SUCCESS
```

Backend CI includes Composer install/security audit, Pint, migrations + staging seed smoke, cache/routes, Filament discovery/readiness and full tests.

## What changed in final completion batch

- Decision Support desktop paint-jitter isolated and animation wrapper removed only from that section.
- Footer navigation wired Panel → API → root SSR → Footer.
- PWA public values moved to StoreSetting-backed `/app.webmanifest`.
- Offline page copy is admin-managed and Service Worker refreshes its cache without requiring a new app deploy.
- Sensitive offline navigation is static/no-script to prevent hydration into checkout/account logic.
- Search Console and GA4/GTM public identifiers are panel-managed with consent-aware frontend loading.
- Web Push inventory is masked/read-only.
- Legacy Filament resources are hidden without deleting data.
- StoreSetting uses specialized safe editors instead of one generic textarea.
- Bulk-discount category slugs use TagsInput instead of raw JSON.
- eNAMAD has a dedicated operator editor while frontend keeps strict official-domain fail-closed parsing.
- Admin completion and bulk pricing seed migrations preserve existing operator values and use non-destructive rollback semantics.

## Current acceptance

```text
CODE_ADMIN_P0=0
CODE_ADMIN_P1=0
FRONTEND_CODE_GATES=PASS
BACKEND_CODE_GATES=PASS
PRODUCTION_MUTATION_DURING_THIS_CHECKPOINT=NO
DEPLOY_DURING_THIS_CHECKPOINT=NO
```

## Remaining closure sequence

```text
1. Commit synchronized F31 documentation.
2. Require exact-head CI on the documentation head.
3. Confirm review threads = 0 and PRs mergeable.
4. Mark PR #17 and PR #54 ready.
5. Merge with normal merge-commit convention used by F30.
6. Require post-merge main CI.
7. Execute ONE final immutable Backend + Frontend production deployment.
8. Run non-commerce health/readiness/PWA smoke and verify source/release SHAs.
9. Do not repeat real purchase/login/restore/rollback.
10. After production alignment: close tracker #55, create final tag/freeze and set HANDOFF=COMPLETE.
```

## NEXT

```text
CURRENT_PHASE=F31_FINAL_ACCEPTANCE_HANDOFF
GITHUB_IMPLEMENTATION_ACCEPTED=YES
FORMAL_HANDOFF_COMPLETE=NO
NEXT=DOCS_EXACT_HEAD_CI_THEN_MERGE_POSTMERGE_AND_SINGLE_FINAL_DEPLOY
DO_NOT_REPEAT=REAL_PURCHASE,ORDER_CREATION,GOOGLE_LOGIN,PUSH_DELIVERY_ACCEPTANCE,BACKUP,RESTORE,ROLLBACK
```
