import { CheckCircle2, Leaf, ShieldCheck, Sparkles, ThermometerSnowflake } from "lucide-react";
import { SEO } from "@/components/SEO";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { brandConfig } from "@/config/brand";

const pillars = [
  { icon: Leaf, title: "مواد اولیه شفاف", desc: "کره طبیعی، تخم‌مرغ تازه، آرد باکیفیت و شکلات اروپایی. لیست مواد هر محصول در صفحه‌اش شفاف اعلام شده است." },
  { icon: Sparkles, title: "پخت تازه", desc: "تولید نزدیک به زمان سفارش. هیچ محصولی از قبل انبار نمی‌شود." },
  { icon: ShieldCheck, title: "وسواس در بهداشت", desc: "رعایت اصول HACCP در آشپزخانه؛ استفاده از دستکش، ابزار ضدعفونی‌شده و آب فیلترشده." },
  { icon: ThermometerSnowflake, title: "زنجیره سرد", desc: "دسرهای یخچالی با پیک یخچالی و باکس ایزوله ارسال می‌شوند تا دمای مناسب حفظ شود." },
];

const commitments = [
  "بدون روغن نباتی هیدروژنه و مواد نگهدارنده مصنوعی",
  "بدون پالم و مارگارین در هیچ محصولی",
  "درج آلرژن‌ها به‌صورت واضح روی هر محصول",
  "استفاده از شیرین‌کننده طبیعی در محصولات دیابتی",
  "ماندگاری واقعی درج‌شده روی هر محصول",
];

const QualityPage = () => (
  <>
    <SEO
      title="استاندارد کیفیت و بهداشت"
      description={`تعهد ${brandConfig.brandName} به کیفیت: مواد اولیه شفاف، پخت تازه، وسواس در بهداشت و رعایت زنجیره سرد.`}
    />
    <section className="section-padding bg-gradient-to-b from-secondary/30 to-background">
      <div className="container-custom max-w-4xl">
        <Breadcrumbs className="mb-8" items={[{ name: "خانه", href: "/" }, { name: "استاندارد کیفیت" }]} />
        <h1 className="heading-1 text-foreground mb-6">تعهد کیفیت وینیمی</h1>
        <p className="body-large text-muted-foreground leading-9">
          کیفیت بالاترین اولویت ماست. هر محصولی که به دست شما می‌رسد، از انتخاب مواد اولیه تا لحظه تحویل با وسواس دنبال می‌شود.
        </p>
      </div>
    </section>

    <section className="section-padding">
      <div className="container-custom">
        <div className="grid md:grid-cols-2 gap-6">
          {pillars.map((p) => (
            <div key={p.title} className="bg-card border border-border rounded-3xl p-6 shadow-card">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                <p.icon className="text-primary" size={26} />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-3">{p.title}</h2>
              <p className="text-muted-foreground leading-8">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="section-padding bg-secondary/30">
      <div className="container-custom max-w-3xl">
        <h2 className="heading-2 text-foreground text-center mb-8">تعهدات ثابت ما</h2>
        <ul className="space-y-3">
          {commitments.map((c) => (
            <li key={c} className="bg-card border border-border rounded-2xl p-4 flex items-start gap-3">
              <CheckCircle2 className="text-primary flex-shrink-0 mt-0.5" size={22} />
              <span className="text-foreground leading-8">{c}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  </>
);

export default QualityPage;
