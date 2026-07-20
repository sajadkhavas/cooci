import { Briefcase, Building2, CheckCircle2, FileQuestion, MessageCircle, Package, Users } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { SEO } from "@/components/SEO";
import { brandConfig, generateWhatsAppUrl } from "@/config/brand";

const requestItems = [
  { icon: Package, title: "بسته‌بندی و شخصی‌سازی", description: "نوع جعبه، کارت، روبان یا درج لوگو براساس تعداد و زمان استعلام می‌شود." },
  { icon: Users, title: "قیمت سفارش تعداد بالا", description: "قیمت بعد از مشخص‌شدن محصول، تعداد، تاریخ و مقصد محاسبه می‌شود." },
  { icon: FileQuestion, title: "پیش‌فاکتور و نوع فاکتور", description: "امکان ارائه نوع فاکتور موردنیاز پیش از تأیید سفارش بررسی می‌شود." },
  { icon: Building2, title: "همکاری دوره‌ای", description: "ظرفیت تولید، بازه تحویل و شرایط همکاری برای هر درخواست جداگانه ارزیابی می‌شود." },
];

const useCases = [
  "پذیرایی جلسه یا رویداد",
  "هدیه کارکنان یا مشتریان",
  "پک خوشامدگویی",
  "سفارش مناسبتی تعداد بالا",
  "درخواست همکاری کافه یا مجموعه پذیرایی",
];

const CorporatePage = () => {
  const supportMessage = `سلام، درباره ثبت درخواست سازمانی در ${brandConfig.brandName} سؤال دارم.`;

  return (
    <>
      <SEO
        title="استعلام سفارش شرکتی و سازمانی"
        description="ثبت و پیگیری درخواست سفارش سازمانی وینیمی از طریق بک‌اند فروشگاه."
      />

      <section className="bg-gradient-to-b from-primary/10 to-background section-padding">
        <div className="container-custom max-w-4xl">
          <Breadcrumbs className="mb-8" items={[{ name: "خانه", href: "/" }, { name: "سفارش شرکتی" }]} />
          <h1 className="heading-1 mb-6 text-foreground">استعلام هدیه و پذیرایی سازمانی</h1>
          <p className="body-large mb-5 leading-9 text-muted-foreground">
            محصول، تعداد، بودجه، تاریخ و مقصد را در فرم ثبت کنید تا قابلیت اجرا و شرایط نهایی در پنل فروشگاه بررسی شود.
          </p>
          <div className="mb-6 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm leading-7 text-amber-950">
            چاپ لوگو، تخفیف حجمی، نوع فاکتور و همکاری دوره‌ای فقط پس از تأیید کتبی جزئیات معتبر هستند.
          </div>
          <a href={generateWhatsAppUrl(supportMessage)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-whatsapp px-6 py-3 font-bold text-white">
            <MessageCircle size={19} aria-hidden="true" /> سؤال از پشتیبانی
          </a>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {requestItems.map((item) => (
              <article key={item.title} className="rounded-3xl border border-border bg-card p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                  <item.icon className="text-primary" size={24} aria-hidden="true" />
                </div>
                <h2 className="mb-2 font-bold text-foreground">{item.title}</h2>
                <p className="text-sm leading-7 text-muted-foreground">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-secondary/30 section-padding">
        <div className="container-custom max-w-3xl">
          <div className="mb-8 flex items-center justify-center gap-3">
            <Briefcase className="text-primary" size={26} aria-hidden="true" />
            <h2 className="heading-2 text-center text-foreground">موارد قابل بررسی</h2>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {useCases.map((useCase) => (
              <li key={useCase} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
                <CheckCircle2 className="shrink-0 text-primary" size={20} aria-hidden="true" />
                <span>{useCase}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom max-w-4xl">
          <InquiryForm
            type="corporate"
            title="ثبت درخواست سازمانی"
            description="نام مجموعه، محصول یا نوع پذیرایی، تعداد، تاریخ تحویل، شهر مقصد و نیاز مربوط به فاکتور یا بسته‌بندی را ثبت کنید."
            defaultSubject="استعلام سفارش سازمانی"
            messageLabel="جزئیات سفارش یا همکاری"
            metadata={{ source: "corporate-page" }}
          />
        </div>
      </section>
    </>
  );
};

export default CorporatePage;
