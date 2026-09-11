# سند مرجع زنده پروژه WINIMI

به‌روزرسانی: 2026-09-11 — Admin Audit 32 GitHub closure

## وضعیت

```text
PROJECT=WINIMI_COOCI
F31=COMPLETED
F31_PRODUCTION_DELIVERY=PASS
F31_HANDOFF=COMPLETE

ADMIN_AUDIT32_CODE_SCOPE=32_OF_32_RECONCILED
ADMIN_AUDIT32_GITHUB_MERGE=PASS
ADMIN_AUDIT32_POST_MERGE_CI=PASS
ADMIN_AUDIT32_PRODUCTION_SYNC=PENDING
UNRESOLVED_ADMIN_P0=0
UNRESOLVED_ADMIN_P1=0
```

## دو Source Lock مستقل — Runtime implementation و Production

### A) Accepted Runtime implementation source

این دو SHA Source کد Runtime پذیرفته‌شدهٔ maintenance هستند. آن‌ها عمداً با عنوان `main` ثبت نمی‌شوند، چون docs-only commitهای بعدی می‌توانند branch `main` را جلو ببرند بدون آنکه Runtime code عوض شود.

```text
FRONTEND_RUNTIME_SOURCE=ca074dbd0664c88a7d618299ba04d8d20d729b07
FRONTEND_MAINTENANCE_PR=58 MERGED
FRONTEND_IMPLEMENTATION_HEAD=506519ced3d68e4c42991c848faf05d376063782

BACKEND_RUNTIME_SOURCE=fc93669455d9bf22fe41260b192d76fb1e65f284
BACKEND_MAINTENANCE_PR=20 MERGED
BACKEND_FINAL_PR_HEAD=e3d46ccec2a037f4226f5db10a07977ca08349a4
```

Docs-only closure commits بعد از این SHAها Runtime tree را تغییر نداده‌اند. برای Deploy فقط همین source lockها یا descendant اثبات‌شده با Runtime tree یکسان معتبر است؛ «آخرین main» به‌تنهایی source lock نیست.

### B) Last proven Production runtime — historical F31

Production فعلی تا زمان اجرای واقعی sync جدید، همان F31 قبلی است:

```text
FRONTEND_DEPLOYED_SOURCE=7d5e3fe03b11bc007652908b5f2fff2e78504b31
FRONTEND_RELEASE=b0d20cd656e5e5d680c3
FRONTEND_FREEZE=freeze/winimi-f31-final-20260910

BACKEND_DEPLOYED_SOURCE=a2e5c48e8c73c49caaac1f5c9cbb0f608f066e3b
BACKEND_RELEASE=49045150d53cd2be5c2b
BACKEND_FREEZE=freeze/winimi-f31-final-20260910

PRODUCTION_HOST=hwsrv-1332134.hostwindsdns.com
F31_RECONCILIATION_RESULT=PASS
```

**قانون:** Runtime implementation source و deployed source فقط پس از اجرای واقعی deploy روی Hostwinds و ثبت release/health evidence می‌توانند برابر اعلام شوند.

## Admin Audit 32 — GitHub acceptance evidence

Backend PR #20:

```text
EXACT_HEAD=e3d46ccec2a037f4226f5db10a07977ca08349a4
MERGE_SHA=fc93669455d9bf22fe41260b192d76fb1e65f284
EXACT_HEAD_BACKEND_CI=34541429972 SUCCESS
EXACT_HEAD_PHASE18=34541429968 SUCCESS
EXACT_HEAD_F30=34541430019 SUCCESS
EXACT_HEAD_PHASE19=34541429944 SUCCESS
POST_MERGE_BACKEND_CI=34541614246 SUCCESS
POST_MERGE_PHASE18=34541614236 SUCCESS
POST_MERGE_PHASE19=34541614252 SUCCESS
```

Frontend PR #58:

```text
EXACT_HEAD=506519ced3d68e4c42991c848faf05d376063782
MERGE_SHA=ca074dbd0664c88a7d618299ba04d8d20d729b07
EXACT_HEAD_FRONTEND_CI=34540720209 SUCCESS
EXACT_HEAD_PHASE8=34540720042 SUCCESS
EXACT_HEAD_PHASE19=34540720081 SUCCESS
EXACT_HEAD_PHASE18=34540720028 SUCCESS
COORDINATED_PHASE18_RERUN_JOB=103085747602 SUCCESS
POST_MERGE_FRONTEND_CI=34542268389 SUCCESS
POST_MERGE_PHASE8=34542268400 SUCCESS
POST_MERGE_PHASE19=34542268410 SUCCESS
POST_MERGE_PHASE18=34542268430 SUCCESS
```

Phase18 coordinated rerun بعد از Backend merge، Backend Runtime source `fc936694...` را از `main` همان زمان checkout کرد و Laravel migrations/seed، backend adversarial، delivery contract، SSR production build، desktop/mobile browser، SEO 10.3–10.9، PWA، final adversarial و scroll baseline را PASS کرد. Post-merge Phase18 #635 نیز روی Frontend Runtime source `ca074dbd...` کامل SUCCESS است.

## Audit closure

`AUDIT_CODE_SCOPE = 32/32 RECONCILED`.

تمام موارد کدنویسی، UX پنل، permissions، Media authority، Tiptap/sanitization، Navigation allowlist، customer privacy، Store Settings، Push consent/preview، payment/outbox UX و responsive/editor integration در GitHub بسته شده‌اند.

دو مورد فقط runtime/business باقی می‌مانند:

1. **Audit #4 — Historical media derivatives:** بعد از deploy واقعی Backend جدید، فقط `thumb` و `preview` با Spatie regeneration و `--force` بازسازی شوند؛ Original حفظ شود.
2. **Audit #26 — Real Delivery Zone:** فقط دادهٔ واقعی کسب‌وکار ثبت شود؛ اگر اطلاعات واقعی آماده نیست، feature باید fail-closed/غیرفعال بماند و دادهٔ آزمایشی ساخته نشود.

## Final Production evidence تاریخی F31

آخرین evidence اثبات‌شدهٔ Production مربوط به F31 است:

- backend active release: `49045150d53cd2be5c2b`
- frontend active release: `b0d20cd656e5e5d680c3`
- Backend readiness + health: PASS
- PHP-FPM, queue, scheduler timer, frontend SSR service and Nginx: active
- public `/`, `/products`, `/app.webmanifest`, `/sw.js`: HTTP 200
- PWA manifest Content-Type: `application/manifest+json; charset=utf-8`
- orders: `4 -> 4`
- payment attempts: `4 -> 4`
- backend shared env checksum unchanged
- frontend runtime env checksum unchanged
- final reconciliation read-only

این evidence برای maintenance جدید reuse نمی‌شود تا زمانی که deploy جدید واقعاً اجرا شود.

## معماری تحویلی

هر داده محتوایی، تجاری، عمومی یا عملیاتی که مالک فروشگاه باید مدیریت کند از Backend/Filament می‌آید و Frontend از API/SSR مصرف می‌کند. Secrets، payment/auth internals، DB/server configuration، Service Worker logic، validationهای امنیتی و layout/accessibility mechanics code-controlled می‌مانند.

Admin Audit 32 این قرارداد را با Media Library مرکزی، managed Tiptap، internal links، sanitizer، safe Callout rendering، owner-facing Store Settings، شش گروه ثابت Navigation، نقش‌های حساس، customer privacy/audit و consent-aware Push تکمیل کرده است.

## Production sync procedure boundary

مخازن scriptهای versioned برای deploy دارند، اما GitHub Actions فعلی فقط CI/readiness/package simulation هستند و SSH deploy به Hostwinds ندارند.

Frontend source-of-truth:
- `deploy/README.md`
- `deploy/bin/preflight-frontend-server.sh`
- `deploy/bin/deploy-production-frontend.sh`
- `deploy/bin/smoke-production-surfaces.sh`
- rollback scripts

Backend source-of-truth:
- `deploy/bin/preflight-backend-server.sh`
- `deploy/bin/deploy-production-backend.sh`
- `deploy/bin/smoke-backend-production.sh`
- `deploy/bin/rollback-backend.sh`

Production sync باید یک‌بار، با قفل دقیق `FRONTEND_RUNTIME_SOURCE` و `BACKEND_RUNTIME_SOURCE` بالا، بدون Order/Payment mutation انجام شود؛ سپس release IDها، health/smoke، media regeneration و Delivery Zone decision همین سند را به‌روزرسانی می‌کنند.

نکتهٔ ایمنی: preflight تاریخی Backend شامل expectationهای قدیمی برای disabled بودن checkout/payment است و نباید کورکورانه روی Production فعلی اعمال شود. قبل از هر mutation، env زنده فقط read-only بررسی می‌شود و وضعیت payment/auth پذیرفته‌شدهٔ F31 حفظ می‌شود؛ این maintenance مجوز خاموش‌کردن یا بازطراحی payment/auth نیست.

## شواهد تاریخی که بدون regression تکرار نمی‌شوند

- Google Login واقعی Production
- authenticated checkout
- پرداخت واقعی و verified زرین‌پال
- Web Push live delivery
- backup/restore/reboot/rollback Phase19B

## قانون ادامه

```text
NEXT=ADMIN_AUDIT32_SINGLE_PRODUCTION_SYNC
DEPLOY_REPEAT=NO
ORDER_MUTATION=NO
PAYMENT_MUTATION=NO
FAKE_DELIVERY_ZONE=NO
```

«کشف‌های سایت زنده» ردشده توسط مالک پروژه بخشی از source of truth این closure نیستند.
