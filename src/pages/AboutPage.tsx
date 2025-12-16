import { Heart, Leaf, Award } from "lucide-react";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { brandConfig, generateWhatsAppUrl } from "@/config/brand";
import galleryBaking from "@/assets/cookies/gallery-baking-process.jpg";
import galleryBakery from "@/assets/cookies/gallery-bakery-interior.jpg";
import lifestyleBreaking from "@/assets/cookies/lifestyle-breaking.jpg";

const values = [
  {
    icon: Heart,
    title: "عشق به پخت",
    description: "هر کوکی با عشق و دقت ساخته می‌شود. ما به کارمان عشق می‌ورزیم.",
  },
  {
    icon: Leaf,
    title: "مواد طبیعی",
    description: "فقط از مواد اولیه طبیعی و تازه استفاده می‌کنیم، بدون هیچ افزودنی مصنوعی.",
  },
  {
    icon: Award,
    title: "کیفیت بی‌نظیر",
    description: "هر محصول قبل از ارسال چک کیفیت می‌شود تا بهترین تجربه را داشته باشید.",
  },
];

const AboutPage = () => {
  return (
    <>
      <SEO
        title="درباره ما"
        description="داستان شیرینی‌فروشی کوکی: با عشق به پخت شروع کردیم و امروز افتخار می‌کنیم که بهترین کوکی‌های دست‌ساز را تقدیم شما می‌کنیم."
      />

      {/* Hero */}
      <section className="bg-secondary/50 section-padding">
        <div className="container-custom text-center">
          <h1 className="heading-1 text-foreground mb-4">درباره کوکی</h1>
          <p className="body-large text-muted-foreground max-w-3xl mx-auto">
            داستان ما با یک فر کوچک و عشق به پخت شروع شد
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in">
              <h2 className="heading-2 text-foreground">داستان ما</h2>
              <div className="space-y-4 body-base text-muted-foreground">
                <p>
                  همه چیز از یک آشپزخانه کوچک شروع شد. سال‌ها پیش، وقتی اولین کوکی‌های خانگی را
                  برای دوستان و خانواده پختم، هیچ‌وقت فکر نمی‌کردم روزی این عشق کوچک به یک
                  کسب‌وکار تبدیل شود.
                </p>
                <p>
                  امروز، با تیمی از علاقه‌مندان به هنر شیرینی‌پزی، هر روز صبح کوکی‌های تازه
                  می‌پزیم. ما فقط از بهترین مواد اولیه استفاده می‌کنیم: شکلات بلژیکی، پسته
                  کرمان، گردوی چهارمحال، و وانیل ماداگاسکار.
                </p>
                <p>
                  هدف ما ساده است: لبخند بر لبان شما با هر گاز از کوکی‌هایمان. چه برای
                  خودتان بخرید، چه هدیه بدهید، می‌خواهیم تجربه‌ای فراموش‌نشدنی داشته باشید.
                </p>
              </div>
            </div>

            <div className="aspect-square rounded-2xl overflow-hidden animate-fade-in delay-200 shadow-lg">
              <img
                src={galleryBakery}
                alt="فضای داخلی نانوایی کوکی"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-secondary/50">
        <div className="container-custom">
          <h2 className="heading-2 text-foreground text-center mb-12">ارزش‌های ما</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-card p-8 rounded-xl text-center space-y-4 shadow-soft animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-16 h-16 mx-auto bg-accent/20 rounded-full flex items-center justify-center">
                  <value.icon className="text-accent" size={28} />
                </div>
                <h3 className="heading-3">{value.title}</h3>
                <p className="body-base text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 rounded-2xl overflow-hidden shadow-lg animate-fade-in">
              <img
                src={galleryBaking}
                alt="فرآیند پخت کوکی"
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="order-1 lg:order-2">
              <h2 className="heading-2 text-foreground mb-8">فرآیند پخت ما</h2>
              <div className="space-y-6">
                {[
                  { title: "انتخاب مواد اولیه", desc: "هر ماده اولیه با دقت انتخاب و تست می‌شود" },
                  { title: "آماده‌سازی خمیر", desc: "خمیر هر روز صبح تازه آماده می‌شود" },
                  { title: "پخت با دقت", desc: "دما و زمان پخت برای هر نوع کوکی متفاوت است" },
                  { title: "بسته‌بندی با عشق", desc: "هر بسته با دقت و ظرافت آماده می‌شود" },
                ].map((step, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold flex-shrink-0">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{step.title}</h3>
                      <p className="text-muted-foreground">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fresh Cookies */}
      <section className="section-padding bg-secondary/30">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in">
              <h2 className="heading-2 text-foreground">تازگی در هر گاز</h2>
              <p className="body-base text-muted-foreground">
                ما معتقدیم که کوکی باید تازه باشد. به همین دلیل، کوکی‌های ما هر روز صبح پخته می‌شوند
                و همان روز به دست شما می‌رسند. وقتی کوکی را از بسته درمی‌آورید، گرمای تازه‌پخت
                آن را احساس خواهید کرد.
              </p>
              <p className="body-base text-muted-foreground">
                شکلات آب‌شده داخل کوکی‌هایمان، لحظه‌ای است که هر عاشق شیرینی منتظر آن است.
              </p>
            </div>

            <div className="aspect-square rounded-2xl overflow-hidden animate-fade-in delay-200 shadow-lg">
              <img
                src={lifestyleBreaking}
                alt="کوکی تازه با شکلات آب‌شده"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container-custom text-center">
          <h2 className="heading-2 mb-4">آماده امتحان کردن هستید؟</h2>
          <p className="body-large mb-8 opacity-90">
            همین حالا سفارش دهید و طعم واقعی کوکی خانگی را تجربه کنید
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={generateWhatsAppUrl("سلام، می‌خواهم سفارش بدهم.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp px-8 py-4 rounded-lg text-lg font-medium"
            >
              سفارش در واتساپ
            </a>
            <Link
              to="/products"
              className="px-8 py-4 rounded-lg text-lg font-medium border border-primary-foreground/30 hover:bg-primary-foreground/10 transition-colors"
            >
              مشاهده محصولات
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutPage;
