# وضعیت مرجع پروژه WINIMI

آخرین GitHub reconciliation: 2026-09-11

> مرجع شماره ۱ ادامه کار. F31 تاریخی بسته و Production آن قبلاً تحویل شده است. پس از F31، Admin Audit 32 به‌عنوان maintenance مستقل تکمیل و در GitHub پذیرفته شده؛ اما این maintenance هنوز روی Production فعال نشده است. برای جزئیات ابتدا همین فایل، سپس `docs/WINIMI_LIVING_HANDOFF_FA.md`، `docs/F31_FINAL_ACCEPTANCE_HANDOFF_WORKLOG_FA.md` و Backend `docs/ADMIN_AUDIT32_CONTINUATION_FA.md` خوانده شوند.

## CURRENT_STATUS

```text
PROJECT=WINIMI_COOCI
F31=COMPLETED
F31_PRODUCTION_DELIVERY=PASS
F31_HANDOFF=COMPLETE

ADMIN_AUDIT32_CODE_SCOPE=32_OF_32_RECONCILED
ADMIN_AUDIT32_GITHUB_MERGE=PASS
ADMIN_AUDIT32_POST_MERGE_CI=PASS
ADMIN_AUDIT32_PRODUCTION_SYNC=PENDING

LIVE_SITE_DISCOVERY_AS_SOURCE=FORBIDDEN_BY_OWNER
UNRESOLVED_ADMIN_P0=0
UNRESOLVED_ADMIN_P1=0
```

## Runtime implementation source lock — Admin Audit 32

این SHAها **Source کد Runtime پذیرفته‌شده** برای maintenance هستند؛ نه الزاماً SHA فعلی branch `main`. PRهای مستندی بعدی می‌توانند `main` را جلو ببرند بدون آنکه Runtime code تغییر کند. بنابراین Production sync باید روی همین Runtime source lockها یا یک descendant اثبات‌شده با Runtime tree یکسان قفل شود؛ هرگز صرفاً از «آخرین main» حدس نزند.

```text
FRONTEND_REPO=sajadkhavas/cooci
FRONTEND_MAINTENANCE_PR=58 MERGED
FRONTEND_IMPLEMENTATION_HEAD=506519ced3d68e4c42991c848faf05d376063782
FRONTEND_RUNTIME_SOURCE=ca074dbd0664c88a7d618299ba04d8d20d729b07

BACKEND_REPO=sajadkhavas/winimi-bakery-backend
BACKEND_MAINTENANCE_PR=20 MERGED
BACKEND_FINAL_PR_HEAD=e3d46ccec2a037f4226f5db10a07977ca08349a4
BACKEND_RUNTIME_SOURCE=fc93669455d9bf22fe41260b192d76fb1e65f284
```

Docs-only closure commits بعد از این Runtime source lockها هیچ تغییر Runtime ایجاد نکرده‌اند و نباید باعث شوند Source کد Deploy به اشتباه از روی عنوان «latest main» انتخاب شود.

### Backend exact-head / post-merge evidence

```text
EXACT_HEAD_BACKEND_CI=34541429972 SUCCESS          # Backend CI #742
EXACT_HEAD_PHASE18_BACKEND=34541429968 SUCCESS     # Phase18 #240
EXACT_HEAD_F30=34541430019 SUCCESS                 # F30 #162
EXACT_HEAD_PHASE19=34541429944 SUCCESS             # Phase19 #228

POST_MERGE_BACKEND_CI=34541614246 SUCCESS          # Backend CI #743
POST_MERGE_PHASE18_BACKEND=34541614236 SUCCESS     # Phase18 #241
POST_MERGE_PHASE19_BACKEND=34541614252 SUCCESS     # Phase19 #229
```

### Frontend exact-head / coordinated / post-merge evidence

```text
EXACT_HEAD_FRONTEND_CI=34540720209 SUCCESS          # Frontend CI #1818
EXACT_HEAD_PHASE8=34540720042 SUCCESS               # Phase8 #767
EXACT_HEAD_PHASE19=34540720081 SUCCESS              # Phase19 #202
EXACT_HEAD_PHASE18=34540720028 SUCCESS              # Phase18 #634
COORDINATED_PHASE18_JOB=103085747602 SUCCESS        # rerun after backend runtime source merge

POST_MERGE_FRONTEND_CI=34542268389 SUCCESS          # Frontend CI #1819
POST_MERGE_PHASE8=34542268400 SUCCESS               # Phase8 #768
POST_MERGE_PHASE19=34542268410 SUCCESS              # Phase19 #203
POST_MERGE_PHASE18=34542268430 SUCCESS              # Phase18 #635
```

Phase18 هماهنگ و post-merge شامل Laravel setup/migrations/seed، backend adversarial acceptance، delivery contract، Production SSR build، browser desktop/mobile، SEO 10.3–10.9، PWA، final adversarial و scroll baseline بوده و سبز است.

## Production runtime — آخرین وضعیت اثبات‌شده

Production فعلی همچنان همان runtime فریز‌شدهٔ F31 است. این مقادیر فقط با evidence اجرای واقعی سرور تغییر می‌کنند:

```text
PRODUCTION_HOST=hwsrv-1332134.hostwindsdns.com

FRONTEND_DEPLOYED_SOURCE=7d5e3fe03b11bc007652908b5f2fff2e78504b31
FRONTEND_RELEASE=b0d20cd656e5e5d680c3
FRONTEND_CURRENT=/var/www/winimi/frontend/releases/b0d20cd656e5e5d680c3
FRONTEND_FREEZE_BRANCH=freeze/winimi-f31-final-20260910

BACKEND_DEPLOYED_SOURCE=a2e5c48e8c73c49caaac1f5c9cbb0f608f066e3b
BACKEND_RELEASE=49045150d53cd2be5c2b
BACKEND_CURRENT=/var/www/winimi/backend/releases/49045150d53cd2be5c2b
BACKEND_FREEZE_BRANCH=freeze/winimi-f31-final-20260910

F31_RECONCILIATION_RESULT=PASS
F31_DEPLOY_RESULT=PASS_CONFIRMED
```

شواهد F31 شامل health/readiness، frontend SSR، Nginx/PWA public surfaces و business immutability بود و در `docs/F31_FINAL_ACCEPTANCE_HANDOFF_WORKLOG_FA.md` نگهداری می‌شود. این شواهد تاریخی برای maintenance جدید به‌معنای deploy شدن Runtime sourceهای `ca074dbd...` و `fc936694...` نیست.

## Admin Audit 32 closure

`AUDIT_CODE_SCOPE = 32/32 RECONCILED` است. دو مورد عمداً runtime/business action هستند و defect کد محسوب نمی‌شوند:

- **#4 Media regeneration:** بعد از deploy واقعی Backend جدید، derivativeهای تاریخی فقط برای `thumb` و `preview` با قرارداد Spatie و `--force` regenerate شوند؛ Original حذف نمی‌شود.
- **#26 Delivery Zone:** فقط دادهٔ واقعی کسب‌وکار روی Production ثبت شود. اگر دادهٔ واقعی موجود نیست، مسیر ارسال باید fail-closed/غیرفعال بماند؛ Zone جعلی ممنوع است.

## Architecture locked for delivery

- Backend/Filament authority برای owner-managed content، catalog، operational data و public settings حفظ شده است.
- Frontend مسئول layout، responsive behavior، accessibility mechanics و security-safe rendering است.
- Tiptap managed editor از Media Library مرکزی، internal link، sanitizer، Preview و native `hurdle` callout استفاده می‌کند.
- Frontend فقط قرارداد امن `filament-tiptap-hurdle` را render می‌کند و arbitrary class/tone را قبول نمی‌کند.
- Navigation پنل فقط شش گروه رسمی دارد: `فروشگاه`، `محتوا`، `بازاریابی و سئو`، `ارتباطات`، `تنظیمات فروشگاه`، `سیستم و امنیت`.
- هیچ fake Article/City Page/Review/Inquiry/Gallery/Category/Delivery Zone برای پرکردن پنل تولید نشده است.
- Order/Payment/Google Login در این maintenance باز یا mutate نشده‌اند.

## Production sync contract

GitHub Actions فعلی CI/readiness/package verification هستند و deployment واقعی Hostwinds را از راه SSH اجرا نمی‌کنند. deployment واقعی باید روی سرور و با اسکریپت‌های versioned خود مخازن انجام شود:

- Frontend: `deploy/bin/preflight-frontend-server.sh`, `deploy/bin/deploy-production-frontend.sh`, smoke/rollback scripts.
- Backend: `deploy/bin/preflight-backend-server.sh`, `deploy/bin/deploy-production-backend.sh`, `deploy/bin/smoke-backend-production.sh`, rollback script.

Source lock برای Deploy همان `FRONTEND_RUNTIME_SOURCE` و `BACKEND_RUNTIME_SOURCE` بالاست. Branch `main` ممکن است به‌خاطر docs-only commit جلوتر باشد و نباید بدون مقایسهٔ Runtime tree جایگزین این lock شود.

تا قبل از اجرای واقعی سرور و ثبت release ID/health/business-immutability evidence، `ADMIN_AUDIT32_PRODUCTION_SYNC=PENDING` باقی می‌ماند.

## Retained acceptance — بدون evidence جدید تکرار نشود

- real Google Login Production acceptance
- authenticated checkout
- real paid/verified Zarinpal order
- live Web Push delivery acceptance
- Phase19B backup/restore/reboot/rollback evidence

## NEXT

```text
NEXT=ADMIN_AUDIT32_SINGLE_PRODUCTION_SYNC
DEPLOY_COUNT_TARGET=ONE
ORDER_MUTATION=FORBIDDEN
PAYMENT_MUTATION=FORBIDDEN
FAKE_BUSINESS_DATA=FORBIDDEN
```

بعد از Production sync فقط runtime evidence واقعی، release IDها، health/smoke و نتیجهٔ #4/#26 در Living Handoff ثبت می‌شوند. هیچ SHA یا release جدیدی قبل از آن deployed فرض نمی‌شود.
