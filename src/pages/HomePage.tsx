import { Link } from "react-router-dom";
import { ArrowLeft, Check, Star, Sparkles } from "lucide-react";
import { SEO } from "@/components/SEO";
import { ProductCard } from "@/components/ProductCard";
import { getFeaturedProducts } from "@/data/products";
import { brandConfig, generateWhatsAppUrl } from "@/config/brand";
import heroImage from "@/assets/cookies/hero-main.jpg";
import lifestyleBreaking from "@/assets/cookies/lifestyle-breaking.jpg";
import lifestyleMilk from "@/assets/cookies/lifestyle-milk.jpg";
import lifestyleTwine from "@/assets/cookies/lifestyle-twine.jpg";
import galleryBakery from "@/assets/cookies/gallery-bakery-interior.jpg";
import galleryGiftBoxes from "@/assets/cookies/gallery-gift-boxes.jpg";
import galleryBaking from "@/assets/cookies/gallery-baking-process.jpg";

const features = [
  {
    title: "مواد اولیه درجه یک",
    description: "فقط از بهترین مواد اولیه وارداتی و ایرانی استفاده می‌کنیم",
  },
  {
    title: "تازه‌پخت روزانه",
    description: "هر روز صبح کوکی‌های تازه پخته می‌شوند",
  },
  {
    title: "بسته‌بندی هدیه",
    description: "بسته‌بندی‌های زیبا برای هدیه دادن",
  },
];

const steps = [
  { num: "۱", title: "انتخاب محصول", desc: "از لیست محصولات انتخاب کنید" },
  { num: "۲", title: "تماس یا واتساپ", desc: "سفارش خود را اعلام کنید" },
  { num: "۳", title: "تحویل درب منزل", desc: "کوکی تازه را تحویل بگیرید" },
];

const testimonials = [
  {
    name: "مریم احمدی",
    text: "بهترین کوکی‌هایی که تا حالا خوردم. طعم واقعاً خانگی و با کیفیت داره.",
    rating: 5,
  },
  {
    name: "علی رضایی",
    text: "باکس هدیه رو برای تولد خانمم گرفتم. بسته‌بندی عالی و طعم فوق‌العاده.",
    rating: 5,
  },
  {
    name: "سارا محمدی",
    text: "کوکی پسته گلاب واقعاً خاصه. ترکیب عطر گلاب با پسته بی‌نظیره.",
    rating: 5,
  },
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
  const featuredProducts = getFeaturedProducts().slice(0, 6);

  return (
    <>
      <SEO />

      {/* Hero Section - Stunning Design */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="کوکی‌های تازه"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-background/95 via-background/70 to-background/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-accent/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-rose/20 rounded-full blur-3xl animate-pulse delay-1000" />

        <div className="container-custom relative z-10">
          <div className="max-w-2xl mr-auto space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-card/80 backdrop-blur-sm px-4 py-2 rounded-full border border-border/50 animate-fade-in">
              <Sparkles size={16} className="text-accent" />
              <span className="text-sm font-medium text-foreground">تازه‌پخت هر روز</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-4 animate-fade-in delay-100">
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-tight">
                <span className="block">کوکی‌های</span>
                <span className="block text-primary relative">
                  دست‌ساز
                  <svg
                    className="absolute -bottom-2 right-0 w-full h-3 text-accent/50"
                    viewBox="0 0 100 12"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0,6 Q25,0 50,6 T100,6"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="none"
                    />
                  </svg>
                </span>
                <span className="block">با عشق</span>
              </h1>
            </div>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-lg animate-fade-in delay-200">
              {brandConfig.slogan}
              <br />
              با بهترین مواد اولیه، از شکلات بلژیکی تا پسته کرمان
            </p>

            {/* Stats */}
            <div className="flex gap-8 py-4 animate-fade-in delay-300">
              {[
                { value: "+۱۰۰۰", label: "مشتری راضی" },
                { value: "۱۰+", label: "طعم متنوع" },
                { value: "۴۸h", label: "تحویل سریع" },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-primary">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in delay-400">
              <a
                href={generateWhatsAppUrl("سلام، می‌خواهم سفارش بدهم.")}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden btn-whatsapp px-8 py-4 rounded-xl text-lg font-medium text-center transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  سفارش در واتساپ
                </span>
              </a>
              <Link
                to="/products"
                className="group px-8 py-4 rounded-xl text-lg font-medium text-center bg-card/80 backdrop-blur-sm border border-border hover:bg-card hover:border-primary/30 transition-all duration-300 flex items-center justify-center gap-2"
              >
                مشاهده محصولات
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-primary/30 flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-primary/50 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section-padding bg-gradient-to-b from-background to-secondary/30">
        <div className="container-custom">
          <div className="text-center mb-12 space-y-4">
            <span className="text-accent font-medium">محبوب‌ترین‌ها</span>
            <h2 className="heading-2 text-foreground">محصولات منتخب</h2>
            <p className="body-base text-muted-foreground max-w-2xl mx-auto">
              بهترین و محبوب‌ترین کوکی‌های ما را ببینید
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

      {/* Why Us */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12 space-y-4">
            <span className="text-accent font-medium">چرا ما؟</span>
            <h2 className="heading-2 text-foreground">کوکی‌های ما متفاوتند</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-card p-8 rounded-2xl text-center space-y-4 shadow-soft hover:shadow-hover transition-all duration-300 animate-fade-in border border-transparent hover:border-accent/20"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-accent/20 to-pistachio-light/30 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Check className="text-accent" size={32} />
                </div>
                <h3 className="heading-3">{feature.title}</h3>
                <p className="body-base text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Order */}
      <section className="section-padding bg-secondary/30">
        <div className="container-custom">
          <div className="text-center mb-12 space-y-4">
            <span className="text-accent font-medium">سفارش آسان</span>
            <h2 className="heading-2 text-foreground">چطور سفارش بدهم؟</h2>
            <p className="body-base text-muted-foreground">
              در سه قدم ساده کوکی تازه تحویل بگیرید
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connection Line */}
            <div className="hidden md:block absolute top-16 left-1/4 right-1/4 h-0.5 bg-gradient-to-l from-accent/30 via-primary/30 to-accent/30" />
            
            {steps.map((step, index) => (
              <div
                key={index}
                className="relative text-center space-y-4 animate-fade-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="relative z-10 w-24 h-24 mx-auto bg-gradient-to-br from-primary to-cocoa rounded-full flex items-center justify-center text-4xl font-bold text-primary-foreground shadow-lg">
                  {step.num}
                </div>
                <h3 className="heading-3">{step.title}</h3>
                <p className="body-base text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/order"
              className="inline-flex items-center gap-2 text-primary font-medium link-underline"
            >
              اطلاعات بیشتر درباره سفارش
              <ArrowLeft size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-gradient-to-br from-primary via-cocoa to-primary text-primary-foreground overflow-hidden relative">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-40 h-40 border border-primary-foreground/30 rounded-full" />
          <div className="absolute bottom-10 left-20 w-60 h-60 border border-primary-foreground/20 rounded-full" />
        </div>
        
        <div className="container-custom relative z-10">
          <div className="text-center mb-12 space-y-4">
            <span className="text-accent font-medium">نظرات</span>
            <h2 className="heading-2">مشتریان ما چه می‌گویند</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-primary-foreground/10 backdrop-blur-sm p-8 rounded-2xl space-y-4 animate-fade-in border border-primary-foreground/10 hover:border-primary-foreground/20 transition-colors"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={20} fill="currentColor" className="text-gold" />
                  ))}
                </div>
                <p className="body-base leading-relaxed">&ldquo;{testimonial.text}&rdquo;</p>
                <p className="font-semibold">— {testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram */}
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
              @cookie_bakery
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {instagramImages.map((image, index) => (
              <div
                key={index}
                className="aspect-square rounded-xl overflow-hidden card-hover group"
              >
                <img
                  src={image}
                  alt={`تصویر اینستاگرام ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-accent/10 via-secondary to-accent/10">
        <div className="container-custom text-center">
          <h2 className="heading-2 text-foreground mb-4">آماده سفارش هستید؟</h2>
          <p className="body-large text-muted-foreground mb-8">
            همین حالا سفارش دهید و طعم واقعی کوکی دست‌ساز را تجربه کنید
          </p>
          <a
            href={generateWhatsAppUrl("سلام، می‌خواهم سفارش بدهم.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 btn-whatsapp px-10 py-5 rounded-xl text-xl font-medium hover:scale-105 transition-transform"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            سفارش در واتساپ
          </a>
        </div>
      </section>
    </>
  );
};

export default HomePage;
