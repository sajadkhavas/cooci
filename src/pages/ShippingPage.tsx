import { Link } from "react-router-dom";
import { CreditCard, PackageCheck, Snowflake, Truck } from "lucide-react";
import { SEO } from "@/components/SEO";
import { brandConfig } from "@/config/brand";
import { deliveryMethods } from "@/lib/orders";

const ShippingPage = () => (
  <>
    <SEO
      title="شرایط ارسال"
      description="قوانین ارسال محصولات وینیمی؛ ارسال سراسری برای محصولات خشک، ارسال یخچالی تهران و کرج، هزینه ارسال و زمان آماده‌سازی."
    />
    <section className="section-padding">
      <div className="container-custom max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="heading-1 text-foreground mb-6">شرایط ارسال و تحویل</h1>
          <p className="body-large text-muted-foreground max-w-3xl mx-auto">
            وینیمی برای هر محصول، شرایط نگهداری و ارسال را جداگانه مشخص می‌کند تا سفارش با کیفیت مناسب به دست شما برسد.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <article className="rounded-3xl bg-card p-6 shadow-soft border border-border">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
              <Truck size={24} />
            </div>
            <h2 className="heading-3 text-foreground mb-3">ارسال محصولات خشک</h2>
            <p className="text-muted-foreground leading-8">
              کوکی‌ها، مینی کوکی‌ها، محصولات خشک و بسیاری از باکس‌های هدیه با بسته‌بندی محافظ به سراسر ایران ارسال می‌شوند.
            </p>
          </article>

          <article className="rounded-3xl bg-card p-6 shadow-soft border border-border">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-800 flex items-center justify-center mb-4">
              <Snowflake size={24} />
            </div>
            <h2 className="heading-3 text-foreground mb-3">ارسال محصولات یخچالی</h2>
            <p className="text-muted-foreground leading-8">
              کیک‌ها، چیزکیک‌ها، تیرامیسو و دسرهای یخچالی فقط در تهران، کرج و محدوده‌های قابل ارسال یخچالی قابل ثبت هستند و باید در یخچال نگهداری شوند.
            </p>
          </article>

          <article className="rounded-3xl bg-card p-6 shadow-soft border border-border">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
              <PackageCheck size={24} />
            </div>
            <h2 className="heading-3 text-foreground mb-3">زمان آماده‌سازی</h2>
            <p className="text-muted-foreground leading-8">
              زمان آماده‌سازی معمولاً {brandConfig.preparationTime} است. برای سفارش‌های تعداد بالا، سازمانی یا باکس هدیه، زمان دقیق بعد از ثبت سفارش و بررسی ظرفیت تولید مشخص می‌شود.
            </p>
          </article>

          <article className="rounded-3xl bg-card p-6 shadow-soft border border-border">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
              <CreditCard size={24} />
            </div>
            <h2 className="heading-3 text-foreground mb-3">هزینه ارسال در Checkout</h2>
            <p className="text-muted-foreground leading-8">
              روش ارسال در صفحه تکمیل سفارش انتخاب می‌شود و هزینه ارسال همان‌جا به جمع محصولات اضافه می‌شود.
            </p>
          </article>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {(Object.entries(deliveryMethods) as Array<[keyof typeof deliveryMethods, (typeof deliveryMethods)[keyof typeof deliveryMethods]]>).map(([method, option]) => (
            <div key={method} className="rounded-2xl bg-secondary/60 p-5 border border-border">
              <h3 className="font-bold text-foreground mb-2">{option.label}</h3>
              <p className="text-sm text-muted-foreground leading-7 mb-3">{option.description}</p>
              <strong className="text-primary">{option.fee ? option.fee.toLocaleString("fa-IR") + " تومان" : "رایگان"}</strong>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl bg-primary/10 p-6 border border-primary/20 text-primary leading-8">
          محل فعالیت وینیمی: {brandConfig.address}. تحویل حضوری، ارسال شهری و ارسال سراسری بر اساس نوع محصول، شهر و شرایط نگهداری در Checkout مشخص می‌شود.
        </div>

        <div className="mt-8 text-center">
          <Link to="/products" className="btn-primary px-8 py-4 rounded-xl inline-block font-bold">
            شروع سفارش از محصولات
          </Link>
        </div>
      </div>
    </section>
  </>
);

export default ShippingPage;
