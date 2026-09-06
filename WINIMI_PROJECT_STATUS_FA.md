# وضعیت مرجع پروژه وینیمی

آخرین به‌روزرسانی: **۲۰۲۶-۰۹-۰۶**  
Project: **WINIMI / COOCI**  
Frontend: `sajadkhavas/cooci`  
Backend: `sajadkhavas/winimi-bakery-backend`  
نقش این فایل: **مرجع شماره ۱ برای ادامه کار در هر چت جدید**

> در چت جدید ابتدا این فایل، سپس `docs/WINIMI_FINAL_DELIVERY_ROADMAP_FA.md` و `docs/F29_GOOGLE_LOGIN_AUTH_CLOSURE_FA.md` خوانده شوند. GitHub و در زمان رسیدن به Phase19B خود سرور باید دوباره read-only تأیید شوند. هیچ مرحله‌ای از روی `main` قدیمی یا checkpoint تاریخی Production شروع نشود.

## CURRENT_STATUS

```text
PROJECT=WINIMI_COOCI
PHASE28=COMPLETED_MERGED_REGISTERED
F29S=PASS_MERGED_REGISTERED_CLOSED
F29=PASS_MERGED_REGISTERED
CURRENT_PHASE=F30_MAINLINE_GIT_STACK_CLOSURE
FINAL_DELIVERY=NOT_COMPLETE
PRODUCTION_MUTATION=NO
DEPLOY_PERFORMED_FOR_F29S_F29=NO
```

## F29S — SEO Content Strategy & Topical Authority

- Status: **DONE / MERGED / REGISTERED / TRACKER CLOSED**
- Frontend integration head before F29: `2cddf69e3a5e550b5acfff4729beffcb81a0ccea`
- Backend F29S integration head before F29: `ff6ad79c5c3ef1ffc69f77023a37a0a261ded8b0`
- Tracker: `cooci#38` — CLOSED / COMPLETED
- Production deployment: **NO**

## F29 — Google Login & Auth Closure

- Status: **PASS / MERGED / REGISTERED**
- Tracker: `cooci#48`
- Closure record: `docs/F29_GOOGLE_LOGIN_AUTH_CLOSURE_FA.md`

### Frontend evidence

- Base: `2cddf69e3a5e550b5acfff4729beffcb81a0ccea`
- Exact implementation head: `55fdb43c8a7e43186ffe89139739de7e3c7bfdf7`
- PR: `#49` — MERGED
- F29 Auth Closure: run `34041798526` — SUCCESS
- Full Frontend CI: run `34041798547` — SUCCESS
- F29S SEO regression: run `34041798554` — SUCCESS
- Merge SHA into `phase-29s/seo-content-strategy-authority`: `3539938dff37d788b11a532097145a2e87569915`

### Backend evidence

- Base: `ff6ad79c5c3ef1ffc69f77023a37a0a261ded8b0`
- Exact implementation head: `1bc34ade42b964351b517df9c94c7a79dbbfb781`
- PR: `#14` — MERGED
- F29 Auth Closure: run `34041754511` — SUCCESS
- F29S Content regression: run `34041754498` — SUCCESS
- F29S Trust regression: run `34041754502` — SUCCESS
- Merge SHA into `phase-29s/seo-content-strategy-authority`: `6c6874dfe3d616f8523601a83b0d2427b1b7f3ee`
- Composer security audit: PASS
- `livewire/livewire`: upgraded from vulnerable `3.8.2` to patched `3.8.3`

### Auth invariants locked by F29

1. Google identity key is provider `sub`, not email.
2. Existing accounts are never auto-linked merely because email/phone matches.
3. OAuth state validation is mandatory; no stateless bypass.
4. Google credentials remain server-env only; Frontend has no `VITE_GOOGLE_*` credentials.
5. New Google customers complete Iranian mobile; `mobile_verified_at` remains NULL until real OTP.
6. OTP infrastructure is preserved behind `OTP_ENABLED`, default fail-closed/off.
7. Production Google credential activation belongs to Phase20.
8. No Production mutation or deployment occurred in F29.

## Git stack فعلی

- Frontend F29/F29S source is integrated on `phase-29s/seo-content-strategy-authority`.
- Backend F29/F29S source is integrated on `phase-29s/seo-content-strategy-authority`.
- Frontend PR `#36` (`phase-27/cross-project-design-synthesis` → `phase-26/uir1-home-navigation-redesign`) remains OPEN / DRAFT and is intentionally handled in F30.
- Frontend `main` and Backend `main` are still old release baselines; they are **not** the final source yet.
- F30 must reconcile and close the complete Phase26/27/28/F29S/F29 stack to clean final `main` heads with exact-head CI.

## Production — historical checkpoint only

Frontend historical release:

- `/var/www/winimi/frontend/releases/bab4c34db478713465d1`
- Source SHA: `d9e44edc13c24427c2f4741b19ac4db98f257160`

Backend historical release:

- `/var/www/winimi/backend/releases/eb002a6d5f093e7780d3`
- Source SHA: `eb002a6d5f093e7780d3cf6333b3e5f83f96e57b`

این‌ها فقط checkpoint تاریخی‌اند. قبل از هر mutation در Phase19B باید `current`, process CWD, systemd state, health/ready, Git SHA، DB/media persistence و backup state از خود سرور read-only دوباره تأیید شوند.

## FINAL DELIVERY ROADMAP

ترتیب باقی‌مانده:

```text
F30 -> Phase19B -> Phase20 -> F31
```

### F30 — Mainline / Git Stack Closure

هدف:

- freeze کردن source نهایی Frontend/Backend؛
- بستن stack باز Phase26/27/28/F29S/F29؛
- حل conflict فقط به‌صورت surgical؛
- اجرای exact-head Frontend CI + Phase8 + Phase18 + Phase19 package؛
- اجرای Backend quality/security gates؛
- merge نهایی source به `main` هر دو repository؛
- ثبت END_SHA / PR / run IDs / hashes؛
- بدون Production mutation.

پس از F30 فقط source قابل بازتولید روی `main` داریم؛ Deploy واقعی در Phase19B انجام می‌شود.

## CURRENT_NEXT_ACTION

```text
NEXT=F30_MAINLINE_GIT_STACK_CLOSURE
PRODUCTION_MUTATION_ALLOWED=NO
```

F30 باید ابتدا Git stack هر دو repository را read-only دوباره audit کند، سپس final integration heads را freeze و stack را تا `main` ببندد. PR #36 در همین فاز تعیین تکلیف می‌شود. هیچ deployment زودهنگام انجام نشود.

## فایل‌های مرجع چت بعدی

1. `WINIMI_PROJECT_STATUS_FA.md`
2. `docs/WINIMI_FINAL_DELIVERY_ROADMAP_FA.md`
3. `docs/F29_GOOGLE_LOGIN_AUTH_CLOSURE_FA.md`
4. `docs/F29S_SEO_CONTENT_STRATEGY_AUTHORITY_FA.md`
5. `docs/PHASE_28_SEO_ROUTE_ARCHITECTURE_CLOSURE.md`
6. `docs/WINIMI_LIVING_HANDOFF_FA.md`
7. `docs/PHASE_19_PRODUCTION_DEPLOYMENT.md`

## Final delivery marker

فقط بعد از F31 مجاز است:

```text
WINIMI_FINAL_DELIVERY=PASS
PRODUCTION=READY
HANDOFF=COMPLETE
```
