import { Link } from "react-router-dom";
import { ArrowLeft, Check, Star, Sparkles, Cookie, Heart, Truck } from "lucide-react";
import { SEO } from "@/components/SEO";
import { ProductCard } from "@/components/ProductCard";
import { getFeaturedProducts } from "@/data/products";
import { brandConfig, generateWhatsAppUrl } from "@/config/brand";
import heroImage from "@/assets/cookies/hero-main.jpg";
import heroAssorted from "@/assets/cookies/hero-assorted.jpg";
import heroBreaking from "@/assets/cookies/hero-breaking.jpg";
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
    icon: Cookie,
    image: galleryBaking,
  },
  {
    title: "تازه‌پخت روزانه",
    description: "هر روز صبح کوکی‌های تازه پخته می‌شوند",
    icon: Heart,
    image: lifestyleBreaking,
  },
  {
    title: "بسته‌بندی هدیه",
    description: "بسته‌بندی‌های زیبا برای هدیه دادن",
    icon: Truck,
    image: galleryGiftBoxes,
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

      {/* Hero Section - Stunning Dark Overlay Design */}
      <section className="relative min-h-[100vh] flex items-center overflow-hidden">
        {/* Background Image with Dark Overlay */}
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="کوکی‌های تازه"
            className="w-full h-full object-cover"
          />
          {/* Dark gradient overlay for better text visibility */}
          <div className="absolute inset-0 bg-gradient-to-l from-black/80 via-black/60 to-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-40 h-40 bg-accent/30 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 right-20 w-52 h-52 bg-gold/20 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-rose/20 rounded-full blur-[80px]" />

        <div className="container-custom relative z-10">
          <div className="max-w-3xl mr-auto space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/20 animate-fade-in shadow-lg">
              <Sparkles size={18} className="text-gold" />
              <span className="text-sm font-semibold text-white/90 tracking-wide">تازه‌پخت هر روز</span>
            </div>

            {/* Main Heading with Text Shadow */}
            <div className="space-y-3 animate-fade-in delay-100">
              <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-[1.1] drop-shadow-2xl">
                <span className="block">کوکی‌های</span>
                <span className="block relative inline-block">
                  <span className="bg-gradient-to-l from-gold via-amber-300 to-gold bg-clip-text text-transparent">
                    دست‌ساز
                  </span>
                  <svg
                    className="absolute -bottom-2 right-0 w-full h-4 text-gold/60"
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
                <span className="block text-white/95">با عشق</span>
              </h1>
            </div>

            {/* Subtitle with better contrast */}
            <p className="text-xl md:text-2xl text-white/85 max-w-xl animate-fade-in delay-200 leading-relaxed font-light drop-shadow-lg">
              {brandConfig.slogan}
              <br />
              <span className="text-gold/90 font-medium">با بهترین مواد اولیه، از شکلات بلژیکی تا پسته کرمان</span>
            </p>

            {/* Stats with glass morphism */}
            <div className="flex gap-6 md:gap-10 py-6 animate-fade-in delay-300">
              {[
                { value: "+۱۰۰۰", label: "مشتری راضی" },
                { value: "۱۰+", label: "طعم متنوع" },
                { value: "۴۸h", label: "تحویل سریع" },
              ].map((stat, i) => (
                <div key={i} className="text-center bg-white/5 backdrop-blur-sm px-5 py-3 rounded-xl border border-white/10">
                  <div className="text-3xl md:text-4xl font-bold text-gold drop-shadow-lg">{stat.value}</div>
                  <div className="text-sm text-white/70 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Beautiful CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in delay-400 pt-4">
              <a
                href={generateWhatsAppUrl("سلام، می‌خواهم سفارش بدهم.")}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden bg-[#25D366] px-10 py-5 rounded-2xl text-lg font-bold text-white text-center transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(37,211,102,0.4)] shadow-xl"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <span className="relative z-10 flex items-center justify-center gap-3">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  سفارش در واتساپ
                </span>
              </a>
              <Link
                to="/products"
                className="group px-10 py-5 rounded-2xl text-lg font-bold text-center bg-white/10 backdrop-blur-md border-2 border-white/30 text-white hover:bg-white/20 hover:border-gold/50 transition-all duration-300 flex items-center justify-center gap-3 shadow-xl"
              >
                مشاهده محصولات
                <ArrowLeft size={20} className="group-hover:-translate-x-2 transition-transform duration-300" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-8 h-12 rounded-full border-2 border-white/40 flex items-start justify-center p-2 backdrop-blur-sm bg-white/5">
            <div className="w-2 h-3 bg-gold rounded-full animate-pulse" />
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

      {/* Why Us - With Beautiful Images */}
      <section className="section-padding bg-gradient-to-b from-secondary/20 to-background">
        <div className="container-custom">
          <div className="text-center mb-16 space-y-4">
            <span className="inline-block bg-accent/20 text-accent-foreground px-4 py-1.5 rounded-full text-sm font-semibold">چرا ما؟</span>
            <h2 className="heading-2 text-foreground">کوکی‌های ما متفاوتند</h2>
            <p className="body-base text-muted-foreground max-w-2xl mx-auto">
              با اشتیاق و عشق به پخت، بهترین کوکی‌های دست‌ساز را برای شما آماده می‌کنیم
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-card rounded-3xl overflow-hidden shadow-card hover:shadow-hover transition-all duration-500 animate-fade-in border border-border/50 hover:border-accent/30"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Image */}
                <div className="relative h-52 overflow-hidden">
                  <img 
                    src={feature.image} 
                    alt={feature.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                  
                  {/* Icon Badge */}
                  <div className="absolute bottom-4 right-4 w-14 h-14 bg-accent rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="text-accent-foreground" size={28} />
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-6 space-y-3">
                  <h3 className="heading-3 text-foreground group-hover:text-primary transition-colors">{feature.title}</h3>
                  <p className="body-base text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
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
