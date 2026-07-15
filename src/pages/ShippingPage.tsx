import { SEO } from "@/components/SEO";
import { brandConfig } from "@/config/brand";

const ShippingPage = () => (
  <>
    <SEO
      title="شرایط ارسال"
      description="قوانین ارسال محصولات وینیمی؛ ارسال سراسری برای محصولات خشک و ارسال یخچالی فقط تهران و کرج."
    />
    <section className="section-padding">
      <div className="container-custom max-w-4xl">
        <h1 className="heading-1 text-foreground mb-6">شرایط ارسال و تحویل</h1>
        <p className="body-large text-muted-foreground mb-10">
          وینیمی برای هر محصول، شرایط نگهداری و ارسال را جداگانه مشخص می‌کند تا سفارش با کیفیت مناسب به دست شما برسد.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <article className="rounded-2xl bg-card p-6 shadow-soft border border-border">
            <h2 className="heading-3 text-foreground mb-3">ارسال محصولات خشک</h2>
            <p className="text-muted-foreground leading-8">
              کوکی‌ها، مینی کوکی‌ها، محصولات خشک و بسیاری از باکس‌های هدیه با بسته‌بندی محافظ به سراسر ایران ارسال می‌شوند.
            </p>
          </article>

          <article className="rounded-2xl bg-card p-6 shadow-soft border border-border">
            <h2 className="heading-3 text-foreground mb-3">ارسال محصولات یخچالی</h2>
            <p className="text-muted-foreground leading-8">
              کیک‌ها، چیزکیک‌ها، تیرامیسو و دسرهای یخچالی فقط در تهران و کرج قابل ارسال هستند و باید در یخچال نگهداری شوند.
            </p>
          </article>

          <article className="rounded-2xl bg-card p-6 shadow-soft border border-border">
            <h2 className="heading-3 text-foreground mb-3">زمان آماده‌سازی</h2>
            <p className="text-muted-foreground leading-8">
              زمان آماده‌سازی معمولاً {brandConfig.preparationTime} است. برای سفارش‌های تعداد بالا، سازمانی یا باکس هدیه، زمان دقیق از طریق واتساپ هماهنگ می‌شود.
            </p>
          </article>

          <article className="rounded-2xl bg-card p-6 shadow-soft border border-border">
            <h2 className="heading-3 text-foreground mb-3">تحویل حضوری و محدوده</h2>
            <p className="text-muted-foreground leading-8">
              محل فعالیت وینیمی: {brandConfig.address}. تحویل حضوری و ارسال شهری با هماهنگی قبلی انجام می‌شود.
            </p>
          </article>
        </div>

        <div className="mt-8 rounded-2xl bg-secondary/60 p-6 border border-border text-muted-foreground leading-8">
          هزینه ارسال، روش دقیق ارسال و زمان تحویل، بعد از انتخاب محصول و ثبت پیام در واتساپ بر اساس شهر، نوع محصول و حجم سفارش اعلام می‌شود.
        </div>
      </div>
    </section>
  </>
);

export default ShippingPage;
