import { Link } from "react-router-dom";
import { ArrowLeft, Check, Cookie, Heart, MessageCircle, Package, ShieldCheck, Snowflake, Sparkles, Truck } from "lucide-react";
import { generateWhatsAppUrl, SUPPORT_WHATSAPP_MESSAGE } from "@/config/brand";
import { SEO } from "@/components/SEO";
import { ProductCard } from "@/components/ProductCard";
import { brandConfig } from "@/config/brand";
import { useCatalogProducts } from "@/hooks/useCatalog";
import heroImage from "@/assets/cookies/hero-main.jpg";
import lifestyleBreaking from "@/assets/cookies/lifestyle-breaking.jpg";
import lifestyleMilk from "@/assets/cookies/lifestyle-milk.jpg";
import lifestyleTwine from "@/assets/cookies/lifestyle-twine.jpg";
import galleryBakery from "@/assets/cookies/gallery-bakery-interior.jpg";
import galleryGiftBoxes from "@/assets/cookies/gallery-gift-boxes.jpg";
import galleryBaking from "@/assets/cookies/gallery-baking-process.jpg";

const features = [
  {
    title: "مواد اولیه باکیفیت",
    description: "مواد اولیه تازه و شفاف؛ انتخاب‌شده با همان وسواسی که برای خانواده خودمان داریم.",
    icon: Cookie,
    image: galleryBaking,
  },
  {
    title: "پخت نزدیک به سفارش",
    description: "محصولات با زمان آماده‌سازی مشخص ثبت می‌شوند تا تازگی و کیفیت بهتر حفظ شود.",
    icon: Heart,
    image: lifestyleBreaking,
  },
  {
    title: "ارسال و نگهداری روشن",
    description: "محصولات خشک سراسری ارسال می‌شوند و دسرهای یخچالی فقط تهران و کرج دارند.",
    icon: Truck,
    image: galleryGiftBoxes,
  },
];

const steps = [
  { num: "۱", title: "انتخاب محصول", desc: "محصول، سایز یا نوع دلخواه را از صفحه محصولات انتخاب کنید", icon: Cookie },
  { num: "۲", title: "پیام در واتساپ", desc: "روی دکمه سفارش در واتساپ بزنید تا پیام آماده ارسال شود", icon: MessageCircle },
  { num: "۳", title: "هماهنگی و تحویل", desc: "زمان آماده‌سازی و ارسال را با تیم پشتیبانی هماهنگ کنید", icon: Package },
];

const instagramImages = [
  lifestyleBreaking,
  lifestyleMilk,
  lifestyleTwine,
  galleryBakery,
  galleryGiftBoxes,
  galleryBaking,
];

const HomePage = () => {
  const { products } = useCatalogProducts();
  const featuredProducts = products.filter((product) => product.isFeatured).slice(0, 6);

  return (
    <>
      <SEO />

      <section className="relative min-h-[100vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="محصولات تازه وینیمی بیکری"
            className="w-full h-full object-cover"
            loading="eager"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
        </div>

        <div className="absolute top-20 right-10 w-40 h-40 bg-accent/30 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 left-20 w-52 h-52 bg-gold/20 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-rose/20 rounded-full blur-[80px]" />

        <div className="w-full px-4 sm:px-8 lg:px-16 relative z-10">
          <div className="max-w-xl lg:max-w-2xl space-y-8">
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/20 animate-fade-in shadow-lg">
              <Sparkles size={18} className="text-amber-400" />
              <span className="text-sm font-semibold text-white/90 tracking-wide">{brandConfig.brandNameEn} — {brandConfig.brandName}</span>
            </div>

            <div className="space-y-3 animate-fade-in delay-100">
              <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-[1.1] drop-shadow-2xl">
                <span className="block">همه‌چیز از</span>
                <span className="block relative inline-block">
                  <span className="bg-gradient-to-l from-amber-400 via-yellow-300 to-orange-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(251,191,36,0.6)]">
                    بوی کیک تازه
                  </span>
                </span>
                <span className="block text-white/95">شروع شد</span>
              </h1>
            </div>

            <p className="text-xl md:text-2xl text-white/85 animate-fade-in delay-200 leading-relaxed font-light drop-shadow-lg">
              {brandConfig.slogan}
              <br />
              <span className="text-gold/90 font-medium">مواد اولیه تازه، وسواس در بهداشت، پخت با عشق و ثبت سفارش آنلاین</span>
            </p>

            <div className="flex flex-wrap gap-3 md:gap-4 py-6 animate-fade-in delay-300">
              {[
                { value: "پخت تازه", label: "نزدیک به زمان سفارش" },
                { value: "ارسال سراسری", label: "برای محصولات خشک" },
                { value: "تهران و کرج", label: "برای دسرهای یخچالی" },
              ].map((stat) => (
                <div key={stat.value} className="bg-white/5 backdrop-blur-sm px-5 py-3 rounded-xl border border-white/10">
                  <div className="text-lg md:text-xl font-bold text-gold drop-shadow-lg">{stat.value}</div>
                  <div className="text-xs text-white/70 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row flex-wrap gap-4 animate-fade-in delay-400 pt-4">
              <Link
                to="/products"
                className="group relative overflow-hidden bg-gold text-primary px-10 py-5 rounded-2xl text-lg font-black text-center transition-all duration-300 hover:scale-105 shadow-xl flex items-center justify-center gap-3"
              >
                مشاهده و انتخاب محصولات
                <ArrowLeft size={20} className="group-hover:-translate-x-2 transition-transform duration-300" />
              </Link>
              <a
                href={generateWhatsAppUrl(SUPPORT_WHATSAPP_MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
                className="group px-10 py-5 rounded-2xl text-lg font-bold text-center bg-whatsapp text-white hover:bg-whatsapp/90 transition-all duration-300 flex items-center justify-center gap-3 shadow-xl"
              >
                <MessageCircle size={21} />
                سفارش در واتساپ
              </a>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      <section className="section-padding bg-gradient-to-b from-background to-secondary/30">
        <div className="container-custom">
          <div className="text-center mb-12 space-y-4">
            <span className="text-accent font-medium">انتخاب‌های محبوب وینیمی</span>
            <h2 className="heading-2 text-foreground">محصولات منتخب</h2>
            <p className="body-base text-muted-foreground max-w-2xl mx-auto">
              از کوکی‌های روزانه تا دسرهای یخچالی، هر محصول با قیمت، واحد فروش و شرایط ارسال مشخص نمایش داده می‌شود.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product, index) => (
              <div
                key={product.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 btn-primary px-8 py-3 rounded-lg font-medium"
            >
              مشاهده همه محصولات
              <ArrowLeft size={18} />
            </Link>
          </div>
        </div>
      </section>

      <section className="section-padding bg-gradient-to-b from-secondary/20 to-background">
        <div className="container-custom">
          <div className="text-center mb-16 space-y-4">
            <span className="inline-block bg-accent/20 text-accent-foreground px-4 py-1.5 rounded-full text-sm font-semibold">چرا وینیمی؟</span>
            <h2 className="heading-2 text-foreground">فروشگاه باید زیبا باشد، اما اعتماد هم بسازد</h2>
            <p className="body-base text-muted-foreground max-w-2xl mx-auto">
              وینیمی فقط تصویر قشنگ نیست؛ محصول، ارسال، نگهداری و آلرژن‌ها باید شفاف باشند.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group bg-card rounded-3xl overflow-hidden shadow-card hover:shadow-hover transition-all duration-500 animate-fade-in border border-border/50 hover:border-accent/30"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="relative h-52 overflow-hidden">
                  <img 
                    src={feature.image} 
                    alt={feature.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                  <div className="absolute bottom-4 right-4 w-14 h-14 bg-accent rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="text-accent-foreground" size={28} />
                  </div>
                </div>
                <div className="p-6 space-y-3">
                  <h3 className="heading-3 text-foreground group-hover:text-primary transition-colors">{feature.title}</h3>
                  <p className="body-base text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-gradient-to-b from-background via-secondary/30 to-background overflow-hidden relative">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-accent/20 to-transparent rounded-full blur-[150px]" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-tl from-gold/15 to-transparent rounded-full blur-[180px]" />
        </div>

        <div className="container-custom relative z-10">
          <div className="text-center mb-20 space-y-6">
            <div className="inline-flex items-center gap-3 bg-gradient-to-l from-accent/30 via-gold/20 to-accent/30 backdrop-blur-sm px-6 py-3 rounded-full border border-gold/30 shadow-lg">
              <div className="w-2 h-2 bg-gold rounded-full animate-pulse" />
              <span className="text-sm font-bold bg-gradient-to-l from-gold to-amber-600 bg-clip-text text-transparent">سفارش آنلاین</span>
              <Sparkles size={16} className="text-gold" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              مسیر <span className="bg-gradient-to-l from-primary via-cocoa to-primary bg-clip-text text-transparent">سفارش</span>
            </h2>
            <p className="body-large text-muted-foreground max-w-xl mx-auto leading-relaxed">
              خرید از وینیمی از انتخاب محصول شروع می‌شود، با سبد خرید ادامه پیدا می‌کند و با ثبت اطلاعات ارسال تکمیل می‌شود.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10 md:gap-8">
            {steps.map((step, index) => (
              <div
                key={step.num}
                className="relative text-center space-y-8 animate-fade-in group"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="relative z-10 mx-auto">
                  <div className="absolute inset-0 w-36 h-36 mx-auto border-2 border-dashed border-primary/30 rounded-full animate-spin" style={{ animationDuration: "20s" }} />
                  <div className="relative w-32 h-32 mx-auto">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary via-cocoa to-primary rounded-full shadow-2xl group-hover:shadow-[0_0_60px_rgba(139,90,43,0.4)] transition-all duration-700" />
                    <div className="absolute inset-2 bg-gradient-to-br from-primary/90 to-cocoa/90 rounded-full" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-6xl font-black text-primary-foreground drop-shadow-lg">{step.num}</span>
                    </div>
                  </div>
                  <div className="absolute inset-0 w-32 h-32 mx-auto bg-gold/40 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10" />
                </div>

                <div className="relative bg-card/90 backdrop-blur-md p-8 rounded-3xl border border-border/50 shadow-xl group-hover:shadow-2xl group-hover:border-gold/30 transition-all duration-500 group-hover:-translate-y-2">
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 bg-gradient-to-br from-gold to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
                    <step.icon size={20} className="text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors pt-4">{step.title}</h3>
                  <p className="body-base text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-gradient-to-br from-primary via-cocoa to-primary text-primary-foreground overflow-hidden relative">
        <div className="container-custom relative z-10">
          <div className="text-center mb-16 space-y-4">
            <span className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm px-5 py-2 rounded-full text-sm font-semibold border border-primary-foreground/20">
              <Sparkles size={16} className="text-gold" />
              تعهد ما به شما
            </span>
            <h2 className="text-3xl md:text-4xl font-bold">چهار اصل ثابت در هر سفارش</h2>
            <p className="text-primary-foreground/70 max-w-lg mx-auto leading-8">
              در هر سفارش تلاش می‌کنیم این اصول را با دقت رعایت کنیم.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {brandConfig.trustPillars.map((pillar, index) => (
              <div
                key={pillar}
                className="group relative bg-gradient-to-br from-primary-foreground/15 to-primary-foreground/5 backdrop-blur-md p-7 rounded-3xl space-y-4 animate-fade-in border border-primary-foreground/10 hover:border-gold/40 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl text-right"
                style={{ animationDelay: `${index * 120}ms` }}
              >
                <div className="w-12 h-12 bg-gold/20 border border-gold/30 rounded-2xl flex items-center justify-center">
                  <Check size={22} className="text-gold" />
                </div>
                <p className="text-lg leading-relaxed text-primary-foreground/90 font-medium">
                  {pillar}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12 space-y-4">
            <span className="text-accent font-medium">اینستاگرام</span>
            <h2 className="heading-2 text-foreground">ما را دنبال کنید</h2>
            <a
              href={brandConfig.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary font-medium link-underline text-lg"
            >
              @{brandConfig.instagramHandle}
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {instagramImages.map((image, index) => (
              <div
                key={image}
                className="aspect-square rounded-xl overflow-hidden card-hover group"
              >
                <img
                  src={image}
                  alt={`تصویر برند و محصولات وینیمی ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-cocoa to-primary" />
        <div className="absolute top-0 left-0 w-80 h-80 bg-gold/20 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-[180px]" />

        <div className="container-custom relative z-10 text-center">
          <div className="inline-flex items-center gap-3 bg-primary-foreground/10 backdrop-blur-md px-6 py-3 rounded-full border border-primary-foreground/20 mb-8 shadow-lg">
            <CreditCard className="text-gold" size={20} />
            <span className="text-primary-foreground font-semibold">سبد خرید و ثبت سفارش آنلاین</span>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-primary-foreground mb-6 leading-tight">
            آماده <span className="bg-gradient-to-l from-gold via-amber-300 to-gold bg-clip-text text-transparent">ثبت سفارش</span> هستید؟
          </h2>
          
          <p className="text-xl md:text-2xl text-primary-foreground/80 mb-12 max-w-2xl mx-auto leading-relaxed">
            محصولات را انتخاب کنید، سبد خرید را تکمیل کنید و اطلاعات ارسال را برای ثبت سفارش وارد کنید.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link
              to="/products"
              className="group relative overflow-hidden bg-gold text-primary px-12 py-6 rounded-2xl text-xl font-black shadow-2xl transition-all duration-500 hover:scale-105 flex items-center gap-3"
            >
              مشاهده محصولات
              <ArrowLeft size={22} className="group-hover:-translate-x-2 transition-transform duration-300" />
            </Link>
            <Link
              to="/checkout"
              className="group px-10 py-6 rounded-2xl text-xl font-bold text-primary-foreground bg-primary-foreground/10 backdrop-blur-md border-2 border-primary-foreground/30 hover:bg-primary-foreground/20 hover:border-gold/50 transition-all duration-500 flex items-center gap-3"
            >
              تکمیل سفارش
              <CreditCard size={22} />
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 mt-14 text-primary-foreground/70">
            <div className="flex items-center gap-2">
              <ShieldCheck size={20} className="text-gold" />
              <span>مواد اولیه شفاف</span>
            </div>
            <div className="flex items-center gap-2">
              <Snowflake size={20} className="text-gold" />
              <span>قانون ارسال یخچالی</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck size={20} className="text-gold" />
              <span>ارسال سراسری محصولات خشک</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
