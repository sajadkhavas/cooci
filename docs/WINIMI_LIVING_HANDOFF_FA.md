# سند مرجع زنده پروژه WINIMI

به‌روزرسانی نهایی F31: 2026-09-10

## وضعیت

```text
PROJECT=WINIMI_COOCI
F31=COMPLETED
WINIMI_FINAL_DELIVERY=PASS
PRODUCTION=READY
HANDOFF=COMPLETE
UNRESOLVED_ADMIN_P0=0
UNRESOLVED_ADMIN_P1=0
```

## Source / Production lock

```text
FRONTEND_DEPLOYED_SOURCE=7d5e3fe03b11bc007652908b5f2fff2e78504b31
FRONTEND_RELEASE=b0d20cd656e5e5d680c3
FRONTEND_FREEZE=freeze/winimi-f31-final-20260910

BACKEND_DEPLOYED_SOURCE=a2e5c48e8c73c49caaac1f5c9cbb0f608f066e3b
BACKEND_RELEASE=49045150d53cd2be5c2b
BACKEND_FREEZE=freeze/winimi-f31-final-20260910

PRODUCTION_HOST=hwsrv-1332134.hostwindsdns.com
RECONCILIATION_RESULT=PASS
```

Frontend PR #54 and Backend PR #17 are merged. Post-merge frontend gates are 4/4 SUCCESS and backend gates are 3/3 SUCCESS. There are no open delivery PRs or review threads.

## Final Production evidence

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
- final reconciliation was read-only

## معماری تحویلی

هر داده محتوایی، تجاری، عمومی یا عملیاتی که مالک فروشگاه باید مدیریت کند از Backend/Filament می‌آید و Frontend از API/SSR مصرف می‌کند. Secrets، payment/auth internals، DB/server configuration، Service Worker logic، validationهای امنیتی و layout/accessibility mechanics code-controlled می‌مانند.

F31 موارد Footer authority، specialized StoreSetting، PWA managed metadata/shortcuts/offline copy، static sensitive offline fallback، Push read-only inventory، consent-aware GA4/GTM، Search Console token، legacy resource cleanup، bulk pricing editor، eNAMAD safe editor/parser و desktop Decision Support jitter repair را بسته است.

## شواهد تاریخی که بدون regression تکرار نمی‌شوند

- Google Login واقعی Production
- authenticated checkout
- پرداخت واقعی و verified زرین‌پال
- Web Push live delivery
- backup/restore/reboot/rollback Phase19B

## قانون ادامه بعد از تحویل

از این نقطه F31 دوباره باز نمی‌شود مگر regression یا نیاز تجاری جدید با evidence مشخص ایجاد شود. تغییرات آینده باید phase/issue جدید داشته باشند و از freezeهای بالا به‌عنوان مرجع source تحویلی استفاده کنند.

```text
NEXT=POST_HANDOFF_MAINTENANCE_OR_NEW_PHASE_ONLY
DEPLOY_REPEAT=NO
REAL_PAYMENT_REPEAT=NO_UNLESS_NEW_ACCEPTANCE_REQUIRES_IT
BACKUP_RESTORE_REPEAT=NO_UNLESS_NEW_RISK_REQUIRES_IT
```

«کشف‌های سایت زنده» ردشده توسط مالک پروژه بخشی از source of truth این closure نیستند.