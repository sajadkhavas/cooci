import { SEO } from "@/components/SEO";
import { brandConfig } from "@/config/brand";

const PrivacyPage = () => (
  <>
    <SEO title="حریم خصوصی" description="سیاست حریم خصوصی وینیمی بیکری برای ثبت سفارش، سبد خرید، پرداخت آنلاین و اطلاعات ارسال." />
    <section className="section-padding">
      <div className="container-custom max-w-3xl">
        <h1 className="heading-1 text-foreground mb-8">حریم خصوصی</h1>
        <div className="space-y-6 text-muted-foreground leading-8">
          <p>
            وینیمی بیکری برای ثبت سفارش، ارسال و پیگیری خرید، فقط اطلاعات ضروری را دریافت می‌کند. این اطلاعات برای پردازش سفارش استفاده می‌شود و فروخته نمی‌شود.
          </p>

          <h2 className="heading-3 text-foreground">اطلاعاتی که دریافت می‌شود</h2>
          <ul className="list-disc pr-6 space-y-2">
            <li>نام و نام خانوادگی</li>
            <li>شماره موبایل برای هماهنگی سفارش و ارسال</li>
            <li>شهر و آدرس تحویل</li>
            <li>اقلام سبد خرید، مبلغ سفارش و روش ارسال</li>
            <li>وضعیت پرداخت پس از اتصال درگاه بانکی</li>
          </ul>

          <h2 className="heading-3 text-foreground">پرداخت آنلاین</h2>
          <p>
            اطلاعات حساس کارت بانکی در سایت وینیمی ذخیره نمی‌شود. پس از اتصال درگاه، پرداخت در صفحه امن ارائه‌دهنده پرداخت انجام می‌شود و فقط نتیجه پرداخت برای ثبت سفارش استفاده خواهد شد.
          </p>

          <h2 className="heading-3 text-foreground">نگهداری اطلاعات</h2>
          <p>
            تا زمان اتصال بک‌اند، اطلاعات سفارش نمونه در مرورگر کاربر ذخیره می‌شود. در نسخه نهایی، سفارش‌ها در سرور فروشگاه ذخیره و مدیریت خواهند شد.
          </p>

          <h2 className="heading-3 text-foreground">تماس</h2>
          <p>
            برای سوالات مربوط به حریم خصوصی یا پیگیری سفارش، با شماره {brandConfig.phone} تماس بگیرید یا از ایمیل {brandConfig.email} استفاده کنید.
          </p>
        </div>
      </div>
    </section>
  </>
);

export default PrivacyPage;
