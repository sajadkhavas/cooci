import { getLegacyRedirectTarget } from "@/lib/seo/url-policy";

const target = getLegacyRedirectTarget("/categories") || "/products";

const redirectDocument = `<!doctype html>
<html lang="fa-IR" dir="rtl">
  <head>
    <meta charset="utf-8" />
    <meta name="robots" content="noindex,follow" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>انتقال به فروشگاه وینیمی</title>
  </head>
  <body>
    <main>
      <h1>دسته‌بندی محصولات وینیمی</h1>
      <p>دسته‌بندی‌ها داخل صفحه فروشگاه قرار گرفته‌اند.</p>
      <a href="${target}">ورود به فروشگاه و دسته‌بندی‌ها</a>
    </main>
  </body>
</html>`;

export const loader = () =>
  new Response(redirectDocument, {
    status: 301,
    headers: {
      Location: target,
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
      "X-Robots-Tag": "noindex, follow",
    },
  });

export default function CategoriesRedirectRoute() {
  return null;
}
