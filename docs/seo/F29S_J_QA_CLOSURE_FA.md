# F29S-J — QA / Closure

Status: **CLOSURE CANDIDATE — REQUIRES EXACT-HEAD GATES + SEQUENTIAL MERGE**

## Closure objective

F29S فقط وقتی بسته می‌شود که A تا I به‌صورت ثبت‌شده قابل ردیابی باشند، H و I روی integration branch وارد شده باشند، Closure Gate اختصاصی J و Full Frontend CI روی exact head سبز باشند و Tracker #38 با merge evidence نهایی بسته شود.

## Evidence ledger

| Subphase | Evidence | Closure state |
| --- | --- | --- |
| A — Keyword Intelligence | `docs/seo/F29S_A_KEYWORD_INTELLIGENCE_FA.md` | REGISTERED |
| B — Keyword-to-URL Map | `docs/seo/F29S_B_KEYWORD_TO_URL_MAP_FA.md` | REGISTERED |
| C — Topic Cluster Architecture | `docs/seo/F29S_C_TOPIC_CLUSTER_ARCHITECTURE_FA.md` | REGISTERED |
| D — First Real Content Cluster | Backend controlled 5-guide manifest + guarded sync + F29S Content Foundation gate | MERGED / REGISTERED |
| E — Commercial Content SEO | `docs/seo/F29S_E_COMMERCIAL_CONTENT_SEO_FA.md` | MERGED / REGISTERED |
| F — Product SEO Audit | `docs/seo/F29S_F_PRODUCT_SEO_AUDIT_FA.md` | MERGED / REGISTERED |
| G — Local/Merchant/Trust | Backend PR #13; exact-head `27287656b4cd5b7a37c512c1724e96e95d2cffec`; merge `ff6ad79c5c3ef1ffc69f77023a37a0a261ded8b0` | MERGED / EXACT-HEAD PASS |
| H — Internal Linking / IA | `CategoryGuideLinks`, unit contract, `docs/seo/F29S_H_INTERNAL_LINKING_INFORMATION_ARCHITECTURE_FA.md` | STACKED CANDIDATE; merge required |
| I — Measurement Plan | `docs/seo/F29S_I_MEASUREMENT_PLAN_FA.md` + CSV matrix | STACKED CANDIDATE; merge required |
| J — QA / Closure | `scripts/audit-f29s-closure.mjs` + `.github/workflows/f29s-closure.yml` + this ledger | exact-head gates required |

## URL-level QA contract

برای هر URL جدید یا اصلاح‌شده در F29S، acceptance از مجموعه Gateهای قبلی و این Closure به شکل زیر جمع می‌شود:

- Intent و keyword owner در F29S-B ثبت شده باشد.
- Title/description/H1 روی template/page ownership تعریف‌شده باقی بماند.
- SSR main content و canonical/robots policy توسط Phase 28 و Full Frontend CI regression نشکند.
- status handling واقعی 200/301/404 و crawl policy توسط auditهای Phase 10.4/10.9 حفظ شود.
- structured data فقط از evidence معتبر ساخته شود؛ Product/Merchant truth backend-authoritative بماند.
- internal links به مقصد canonical و مرتبط بروند.
- Local/city routes بدون demand + delivery truth + unique value در حالت HOLD/Conditional بمانند.
- Product/price/stock/shipping/allergen claim از static SEO copy جعل نشود.
- measurement baseline قبل از Production جعل نشود.
- mobile/accessibility/performance gates Full Frontend CI سبز باشند.
- sitemap فقط canonical indexable URL را هدف بگیرد.

## Dedicated closure audit

`node scripts/audit-f29s-closure.mjs` این invariantها را fail-closed بررسی می‌کند:

1. تمام artifactهای اصلی F29S frontend موجود باشند.
2. Local doorway guard از Keyword Map حذف نشده باشد.
3. Category → Guide contextual links و Home → Guide canonical links موجود باشند.
4. Guide → Topic و Guide → Guide navigation حذف نشده باشد.
5. Product → Guide تا نبود relation معتبر به لینک عمومی/حدسی تبدیل نشود.
6. Measurement plan همچنان `NOT COLLECTED — PRE-PRODUCTION` و `Search Console mutation: NO` باشد.
7. referenceهای رسمی URL Inspection و sitemap در plan حفظ شوند.

Workflow اختصاصی `F29S SEO Closure` علاوه بر این audit، focused SEO unit gates و TypeScript typecheck را روی exact head اجرا می‌کند. Full Frontend CI نیز به‌صورت مستقل regression سراسری پروژه را اجرا می‌کند.

## Merge order

1. H → `phase-29s/seo-content-strategy-authority`
2. I → همان integration branch بعد از H
3. J → همان integration branch بعد از I
4. ثبت exact source heads + merge SHAs + workflow run IDs در Tracker #38
5. close Tracker #38 با `completed`

Stacked بودن branchها مجاز است، اما Merge باید همین ترتیب را حفظ کند تا هیچ مرحله‌ای evidence مرحله قبل را دور نزند.

## Production / external boundary

- Deployment performed: **NO**
- Production mutation: **NO**
- Search Console mutation: **NO**
- Real post-launch measurement: **F31**
- Next project phase after F29S closure: **F29 — Google Login & Auth Closure**
