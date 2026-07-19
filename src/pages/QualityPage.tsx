import {
  AlertTriangle,
  CheckCircle2,
  ClipboardCheck,
  PackageCheck,
  ShieldCheck,
  ThermometerSnowflake,
} from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SEO } from "@/components/SEO";
import { brandConfig } from "@/config/brand";

const pillars = [
  {
    icon: ClipboardCheck,
    title: "اطلاعات قابل‌بررسی محصول",
    description:
      "قیمت، گزینه‌های محصول و نیاز به نگهداری سرد در کاتالوگ نمایش داده می‌شوند. ترکیبات و آلرژن فقط زمانی قطعی تلقی می‌شوند که از منبع تأییدشده بک‌اند دریافت شده باشند.",
  },
  {
    icon: PackageCheck,
    title: "بسته‌بندی متناسب با سفارش",
    description:
      "نوع بسته‌بندی به محصول، تعداد و روش تحویل بستگی دارد. عبارت «بسته‌بندی محافظ» تضمین مقاومت در برابر همه شرایط حمل نیست و وضعیت سفارش باید هنگام تحویل بررسی شود.",
  },
  {
    icon: ShieldCheck,
    title: "عدم ادعای گواهی بدون مدرک",
    description:
      "تا زمانی که شماره مجوز، گواهی یا سند قابل استعلام منتشر نشده باشد، سایت ادعای HACCP، استاندارد خاص، مواد اولیه وارداتی یا فرمول بدون یک ماده مشخص را نمایش نمی‌دهد.",
  },
  {
    icon: ThermometerSnowflake,
    title: "تفکیک محصولات نیازمند سرما",
    description:
      "محصولات علامت‌گذاری‌شده به‌عنوان یخچالی فقط با روش تحویل سازگار قابل ثبت هستند. محدوده و ظرفیت واقعی ارسال باید توسط بک‌اند یا پشتیبانی تأیید شود.",
  },
];

const commitments = [
  "حذف نظر، امتیاز، آمار فروش و نشان محبوبیت بدون منبع قابل بررسی",
  "عدم نمایش موجودی دقیق تا زمان دریافت مقدار معتبر از بک‌اند",
  "عدم قطعی‌دانستن ترکیبات، آلرژن و ماندگاری ثبت‌شده در داده آزمایشی",
  "اعلام نمایشی‌بودن تصاویر غیرمتصل به رسانه واقعی همان محصول",
  "تأیید دوباره مبلغ، روش تحویل و قابلیت سفارش در سمت سرور",
];

const QualityPage = () => (
  <>
    <SEO
      title="سیاست شفافیت اطلاعات محصول"
      description={`سیاست ${brandConfig.brandName} برای انتشار اطلاعات قابل بررسی، حذف ادعاهای بدون مدرک و تأیید نهایی سفارش توسط بک‌اند.`}
    />

    <section className="section-padding bg-gradient-to-b from-secondary/30 to-background">
      <div className="container-custom max-w-4xl">
        <Breadcrumbs
          className="mb-8"
          items={[{ name: "خانه", href: "/" }, { name: "سیاست شفافیت" }]}
        />
        <h1 className="heading-1 mb-6 text-foreground">
          سیاست شفافیت و کنترل اطلاعات
        </h1>
        <p className="body-large leading-9 text-muted-foreground">
          کیفیت فقط یک عبارت تبلیغاتی نیست. سایت باید بین اطلاعات تأییدشده، برآورد فرانت‌اند و موارد نیازمند استعلام تفاوت روشن ایجاد کند.
        </p>
      </div>
    </section>

    <section className="section-padding">
      <div className="container-custom">
        <div className="mb-8 flex items-start gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-5 text-amber-950">
          <AlertTriangle className="mt-0.5 shrink-0" size={22} aria-hidden="true" />
          <p className="leading-8">
            فرانت‌اند فعلی پیش از اتصال کامل به بک‌اند از کاتالوگ داخلی استفاده می‌کند. اطلاعات حساس خرید باید در مرحله اتصال داده واقعی جایگزین و دوباره تأیید شوند.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {pillars.map((pillar) => (
            <article
              key={pillar.title}
              className="rounded-3xl border border-border bg-card p-6 shadow-card"
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                <pillar.icon className="text-primary" size={26} aria-hidden="true" />
              </div>
              <h2 className="mb-3 text-xl font-bold text-foreground">
                {pillar.title}
              </h2>
              <p className="leading-8 text-muted-foreground">
                {pillar.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>

    <section className="section-padding bg-secondary/30">
      <div className="container-custom max-w-3xl">
        <h2 className="heading-2 mb-8 text-center text-foreground">
          قواعد انتشار در سایت
        </h2>
        <ul className="space-y-3">
          {commitments.map((commitment) => (
            <li
              key={commitment}
              className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4"
            >
              <CheckCircle2
                className="mt-0.5 shrink-0 text-primary"
                size={22}
                aria-hidden="true"
              />
              <span className="leading-8 text-foreground">{commitment}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  </>
);

export default QualityPage;
