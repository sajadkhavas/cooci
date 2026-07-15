import { Award, Heart, Leaf } from "lucide-react";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import galleryBaking from "@/assets/cookies/gallery-baking-process.jpg";
import galleryBakery from "@/assets/cookies/gallery-bakery-interior.jpg";
import lifestyleBreaking from "@/assets/cookies/lifestyle-breaking.jpg";

const values = [
  {
    icon: Heart,
    title: "عشق به پخت",
    description: "وینیمی از علاقه واقعی به پخت کیک و شیرینی شروع شد؛ هر محصول با دقتی شبیه پخت برای خانواده آماده می‌شود.",
  },
  {
    icon: Leaf,
    title: "مواد اولیه تازه",
    description: "مواد اولیه‌ای انتخاب می‌کنیم که خودمان هم با خیال راحت برای خانواده‌مان استفاده می‌کنیم.",
  },
  {
    icon: Award,
    title: "وسواس در بهداشت",
    description: "از انتخاب مواد اولیه تا پخت، بسته‌بندی و ارسال، تمیزی و کنترل کیفیت قبل از هر چیز اولویت دارد.",
  },
];

const AboutPage = () => {
  return (
    <>
      <SEO
        title="درباره ما"
        description="داستان وینیمی بیکری؛ از بوی کیک تازه در خانه تا ساخت کیک، کوکی و شیرینی با مواد اولیه تازه، بهداشت و عشق به پخت."
      />

      <section className="bg-secondary/50 section-padding">
        <div className="container-custom text-center">
          <h1 className="heading-1 text-foreground mb-4">درباره وینیمی بیکری</h1>
          <p className="body-large text-muted-foreground max-w-3xl mx-auto">
            همه‌چیز از بوی کیک تازه شروع شد؛ از خاطره‌های خانگی تا یک برند کوچک با وسواس روی کیفیت و بهداشت.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in">
              <h2 className="heading-2 text-foreground">داستان ما</h2>
              <div className="space-y-4 body-base text-muted-foreground">
                <p>
                  از کودکی، عطر کیک و شیرینی تازه همیشه در خانه ما می‌پیچید. شیرینی‌پزی برای ما فقط یک سرگرمی نبود؛ بخشی از زندگی و خاطرات خانوادگی‌مان بود. همان علاقه سال‌ها بعد به وینیمی تبدیل شد.
                </p>
                <p>
                  اما برای ما، خوشمزه بودن هیچ‌وقت کافی نبود. همیشه مهم بود مطمئن باشیم چیزی که می‌خوریم با مواد اولیه تازه، باکیفیت و در محیطی کاملاً تمیز و بهداشتی تهیه شده است.
                </p>
                <p>
                  به همین دلیل، در وینیمی روی تک‌تک مراحل کار نظارت می‌کنیم؛ از انتخاب مواد اولیه تا پخت، بسته‌بندی و ارسال. هر محصول قرار است همان دقتی را داشته باشد که اگر برای عزیزان خودمان می‌پختیم.
                </p>
              </div>
            </div>

            <div className="aspect-square rounded-2xl overflow-hidden animate-fade-in delay-200 shadow-lg">
              <img
                src={galleryBakery}
                alt="فضای پخت و بسته‌بندی وینیمی"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

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

      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 rounded-2xl overflow-hidden shadow-lg animate-fade-in">
              <img
                src={galleryBaking}
                alt="فرآیند پخت محصولات وینیمی"
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="order-1 lg:order-2">
              <h2 className="heading-2 text-foreground mb-8">فرآیند پخت و سفارش</h2>
              <div className="space-y-6">
                {[
                  { title: "انتخاب مواد اولیه", desc: "مواد تازه و باکیفیت انتخاب می‌شوند؛ همان چیزی که برای خانواده خودمان می‌پسندیم." },
                  { title: "آماده‌سازی با دقت", desc: "محصولات با زمان آماده‌سازی مشخص و نزدیک به سفارش تهیه می‌شوند." },
                  { title: "کنترل کیفیت و بسته‌بندی", desc: "طعم، بافت، ظاهر، بهداشت و بسته‌بندی در هر مرحله بررسی می‌شود." },
                  { title: "ثبت سفارش آنلاین", desc: "کاربر محصول را انتخاب می‌کند، وارد سبد خرید می‌شود و مسیر پرداخت آنلاین را ادامه می‌دهد." },
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

      <section className="section-padding bg-secondary/30">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in">
              <h2 className="heading-2 text-foreground">چرا گزینه‌های بدون قند افزوده؟</h2>
              <p className="body-base text-muted-foreground">
                بعضی از عزیزان ما با دیابت زندگی می‌کنند و همیشه دلمان می‌خواست آن‌ها هم بتوانند با انتخاب آگاهانه‌تری از طعم یک شیرینی خوب لذت ببرند. همین باعث شد کنار محصولات کلاسیک، روی کوکی‌های بدون قند افزوده و گزینه‌های رژیمی هم کار کنیم.
              </p>
              <p className="body-base text-muted-foreground">
                این محصولات توصیه پزشکی نیستند، اما ترکیبات و آلرژن‌ها با شفافیت نوشته می‌شوند تا انتخاب آگاهانه‌تری داشته باشید.
              </p>
            </div>

            <div className="aspect-square rounded-2xl overflow-hidden animate-fade-in delay-200 shadow-lg">
              <img
                src={lifestyleBreaking}
                alt="کوکی تازه وینیمی"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container-custom text-center">
          <h2 className="heading-2 mb-4">وینیمی را از محصول شروع کنید</h2>
          <p className="body-large mb-8 opacity-90">
            محصول دلخواه را انتخاب کنید، وارد سبد خرید شوید و سفارش را از مسیر آنلاین ادامه دهید.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="btn-primary px-8 py-4 rounded-lg text-lg font-medium bg-gold text-primary hover:bg-gold/90"
            >
              مشاهده محصولات
            </Link>
            <Link
              to="/cart"
              className="px-8 py-4 rounded-lg text-lg font-medium border border-primary-foreground/30 hover:bg-primary-foreground/10 transition-colors"
            >
              سبد خرید
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutPage;
