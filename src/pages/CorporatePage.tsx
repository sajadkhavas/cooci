import { Briefcase, Building2, CheckCircle2, MessageCircle, Package, Users } from "lucide-react";
import { SEO } from "@/components/SEO";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { brandConfig, generateWhatsAppUrl } from "@/config/brand";

const benefits = [
  { icon: Package, title: "چاپ لوگو روی جعبه و کارت", desc: "برای هدایای شرکتی از ۲۰ عدد به بالا" },
  { icon: Users, title: "تخفیف حجمی", desc: "تخفیف ویژه برای سفارش‌های بالای ۵۰ عدد" },
  { icon: Briefcase, title: "پیش‌فاکتور رسمی", desc: "امکان ارائه فاکتور رسمی برای شرکت‌ها" },
  { icon: Building2, title: "قرارداد دوره‌ای", desc: "پذیرایی هفتگی/ماهانه برای دفاتر و کافه‌ها" },
];

const usecases = [
  "پذیرایی جلسات و همایش",
  "هدیه پایان سال به کارکنان",
  "بسته خوشامدگویی مشتریان",
  "پک تبلیغاتی و رویداد",
  "همکاری با کافه‌ها و رستوران‌ها",
];

const CorporatePage = () => {
  const message = `سلام، برای سفارش شرکتی/سازمانی از ${brandConfig.brandName} با شما تماس گرفتم. لطفاً راهنمایی کنید.`;
  return (
    <>
      <SEO
        title="سفارش شرکتی و هدیه سازمانی"
        description="سفارش شرکتی کوکی و شیرینی وینیمی؛ چاپ لوگو، پیش‌فاکتور، تخفیف حجمی و قرارداد پذیرایی دوره‌ای."
      />
      <section className="section-padding bg-gradient-to-b from-primary/10 to-background">
        <div className="container-custom max-w-4xl">
          <Breadcrumbs className="mb-8" items={[{ name: "خانه", href: "/" }, { name: "سفارش شرکتی" }]} />
          <h1 className="heading-1 text-foreground mb-6">هدیه و پذیرایی سازمانی</h1>
          <p className="body-large text-muted-foreground leading-9 mb-8">
            {brandConfig.brandName} در کنار شرکت‌ها و برندهای ایرانی است. از پذیرایی جلسات و هدایای پایان سال تا قراردادهای دوره‌ای پذیرایی، تیم ما با شفافیت کامل همراه شماست.
          </p>
          <a href={generateWhatsAppUrl(message)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-whatsapp text-white px-8 py-4 rounded-xl font-bold shadow-lg">
            <MessageCircle size={20} /> درخواست پیش‌فاکتور
          </a>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((b) => (
              <div key={b.title} className="bg-card border border-border rounded-3xl p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                  <b.icon className="text-primary" size={24} />
                </div>
                <h3 className="font-bold text-foreground mb-2">{b.title}</h3>
                <p className="text-sm text-muted-foreground leading-7">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-secondary/30">
        <div className="container-custom max-w-3xl">
          <h2 className="heading-2 text-foreground mb-8 text-center">کاربردهای سفارش سازمانی</h2>
          <ul className="grid sm:grid-cols-2 gap-3">
            {usecases.map((u) => (
              <li key={u} className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3">
                <CheckCircle2 className="text-primary flex-shrink-0" size={20} />
                <span className="text-foreground">{u}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
};

export default CorporatePage;
