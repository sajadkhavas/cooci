# سند مرجع زنده پروژه WINIMI

به‌روزرسانی: 2026-09-10

## قانون ادامه در چت جدید

1. `WINIMI_PROJECT_STATUS_FA.md` را بخوان.
2. سپس همین فایل، `docs/F31_FINAL_ACCEPTANCE_HANDOFF_WORKLOG_FA.md` و `docs/F31_FILAMENT_CONTROL_COVERAGE_AUDIT_FA.md` را بخوان.
3. PRهای Frontend #54 و Backend #17 و CI HEADهای واقعی GitHub را دوباره بررسی کن.
4. checkpoint تاریخی را بر GitHub فعلی مقدم ندان.
5. «کشف‌های سایت زنده» ردشده توسط مالک پروژه را وارد گزارش/تصمیم نکن.
6. Phase28/F29S/F29/F30/Phase19B/Phase20 را بدون evidence تازه باز نکن.

## Project identity

```text
FRONTEND=sajadkhavas/cooci
BACKEND=sajadkhavas/winimi-bakery-backend
STOREFRONT=https://winimibakery.com
API=https://api.winimibakery.com
CURRENT_PHASE=F31_FINAL_ACCEPTANCE_HANDOFF
```

Frontend: React Router Framework Mode + React + TypeScript + Vite + SSR.  
Backend: Laravel + Filament + Sanctum/session + Queue/Scheduler + MySQL/Redis production topology.

## اصل معماری

هر چیز محتوایی، تجاری، عمومی یا عملیاتی که مالک فروشگاه باید مدیریت کند از Backend/Filament می‌آید و Frontend از API/SSR مصرف می‌کند. Secrets، payment/auth internals، DB/server configuration، Service Worker logic، validationهای امنیتی و layout/accessibility mechanics code-controlled می‌مانند.

## Accepted F31 candidates

```text
FRONTEND_IMPLEMENTATION_HEAD=584aecf5bafac9fa6b757fdd937495be25ab989d
FRONTEND_EXACT_HEAD_CI=5_OF_5_SUCCESS
BACKEND_IMPLEMENTATION_HEAD=96170b03c28548e627e4bf9255addaef745d9df1
BACKEND_EXACT_HEAD_CI=4_OF_4_SUCCESS
REVIEW_THREADS=0
ADMIN_P0_P1=0
```

## چیزهایی که در F31 بسته شدند

- desktop Decision Support paint jitter
- managed Header/Footer/navigation
- specialized StoreSetting editors
- PWA installed manifest `/app.webmanifest`
- PWA shortcuts/name/colors/offline copy
- refreshable admin-managed offline cache
- static/no-script sensitive offline fallback
- consent-aware GA4/GTM public IDs
- Search Console public verification token
- masked/read-only Web Push subscription inventory
- legacy Filament menu cleanup without data deletion
- safe bulk-discount category editor
- eNAMAD operator editor + strict frontend fail-closed parser
- value-preserving/non-destructive migrations for operator-owned settings

## Retained evidence — DO NOT REPEAT

- real Google Login Production acceptance
- authenticated checkout acceptance
- real Zarinpal paid/verified order
- Web Push live delivery acceptance
- Phase19B backup/restore/reboot/rollback evidence

این شواهد فقط با regression/evidence جدید invalidate می‌شوند.

## Remaining path

```text
DOCS_HEAD_EXACT_CI
-> READY/MERGE PR #17 + #54
-> POST-MERGE MAIN CI
-> ONE FINAL immutable Backend + Frontend Production deploy
-> read-only health/readiness/source/PWA smoke
-> final tag/freeze
-> close cooci#55
-> HANDOFF=COMPLETE
```

No server deploy was performed by the GitHub reconciliation checkpoint in this document.
