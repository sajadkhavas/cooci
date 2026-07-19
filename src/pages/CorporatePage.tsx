import {
  Briefcase,
  Building2,
  CheckCircle2,
  FileQuestion,
  MessageCircle,
  Package,
  Users,
} from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SEO } from "@/components/SEO";
import { brandConfig, generateWhatsAppUrl } from "@/config/brand";

const requestItems = [
  {
    icon: Package,
    title: "بسته‌بندی و شخصی‌سازی",
    description:
      "نوع جعبه، کارت، روبان، چاپ یا درج لوگو براساس تعداد، زمان و موجودی بسته‌بندی استعلام می‌شود.",
  },
  {
    icon: Users,
    title: "قیمت سفارش تعداد بالا",
    description:
      "قیمت و حداقل تعداد ثابت نیست و بعد از مشخص‌شدن محصول، تعداد، زمان و مقصد اعلام می‌شود.",
  },
  {
    icon: FileQuestion,
    title: "پیش‌فاکتور و نوع فاکتور",
    description:
      "امکان ارائه پیش‌فاکتور یا فاکتور با مشخصات موردنیاز باید پیش از تأیید سفارش بررسی شود.",
  },
  {
    icon: Building2,
    title: "همکاری دوره‌ای",
    description:
      "ظرفیت تولید، بازه تحویل، شرایط پرداخت و دوره همکاری برای هر درخواست جداگانه ارزیابی می‌شود.",
  },
];

const useCases = [
  "پذیرایی جلسه یا رویداد",
  "هدیه کارکنان یا مشتریان",
  "پک خوشامدگویی",
  "سفارش مناسبتی تعداد بالا",
  "درخواست همکاری کافه یا مجموعه پذیرایی",
];

const CorporatePage = () => {
  const message = `سلام، برای بررسی سفارش شرکتی یا سازمانی از ${brandConfig.brandName} تماس گرفتم. محصول، تعداد، تاریخ تحویل و شهر مقصد را اعلام می‌کنم.`;

  return (
    <>
      <SEO
        title="استعلام سفارش شرکتی و سازمانی"
        description="ثبت درخواست سفارش شرکتی وینیمی؛ بررسی محصول، تعداد، زمان تحویل، بسته‌بندی، نوع فاکتور و قیمت پس از استعلام."
      />

      <section className="section-padding bg-gradient-to-b from-primary/10 to-background">
        <div className="container-custom max-w-4xl">
          <Breadcrumbs
            className="mb-8"
            items={[{ name: "خانه", href: "/" }, { name: "سفارش شرکتی" }]}
          />
          <h1 className="heading-1 mb-6 text-foreground">
            استعلام هدیه و پذیرایی سازمانی
          </h1>
          <p className="body-large mb-5 leading-9 text-muted-foreground">
            این صفحه فرم استعلام است، نه وعده قطعی خدمات. محصول، تعداد، بودجه، تاریخ و مقصد را بفرستید تا قابلیت اجرا و شرایط نهایی بررسی شود.
          </p>
          <div className="mb-8 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm leading-7 text-amber-950">
            چاپ لوگو، تخفیف حجمی، فاکتور رسمی و قرارداد دوره‌ای فقط بعد از تأیید کتبی جزئیات سفارش معتبر هستند.
          </div>
          <a
            href={generateWhatsAppUrl(message)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-whatsapp px-8 py-4 font-bold text-white shadow-lg"
          >
            <MessageCircle size={20} aria-hidden="true" />
            ارسال درخواست بررسی
          </a>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {requestItems.map((item) => (
              <article
                key={item.title}
                className="rounded-3xl border border-border bg-card p-6"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                  <item.icon className="text-primary" size={24} aria-hidden="true" />
                </div>
                <h2 className="mb-2 font-bold text-foreground">{item.title}</h2>
                <p className="text-sm leading-7 text-muted-foreground">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-secondary/30">
        <div className="container-custom max-w-3xl">
          <div className="mb-8 flex items-center justify-center gap-3">
            <Briefcase className="text-primary" size={26} aria-hidden="true" />
            <h2 className="heading-2 text-center text-foreground">
              موارد قابل بررسی
            </h2>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {useCases.map((useCase) => (
              <li
                key={useCase}
                className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4"
              >
                <CheckCircle2
                  className="shrink-0 text-primary"
                  size={20}
                  aria-hidden="true"
                />
                <span className="text-foreground">{useCase}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
};

export default CorporatePage;
