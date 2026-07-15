import { Link } from "react-router-dom";
import { ArrowLeft, Check, Star, Sparkles, Cookie, Heart, Truck, Phone } from "lucide-react";
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
          {/* Dark gradient overlay - lighter on right to show image */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 right-10 w-40 h-40 bg-accent/30 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 left-20 w-52 h-52 bg-gold/20 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-rose/20 rounded-full blur-[80px]" />

        <div className="w-full px-4 sm:px-8 lg:px-16 relative z-10">
          <div className="max-w-xl lg:max-w-2xl space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/20 animate-fade-in shadow-lg">
              <Sparkles size={18} className="text-amber-400" />
              <span className="text-sm font-semibold text-white/90 tracking-wide">تازه‌پخت هر روز</span>
            </div>

            {/* Main Heading with Text Shadow */}
            <div className="space-y-3 animate-fade-in delay-100">
              <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-[1.1] drop-shadow-2xl">
                <span className="block">کوکی‌های</span>
                <span className="block relative inline-block">
                  <span className="bg-gradient-to-l from-amber-400 via-yellow-300 to-orange-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(251,191,36,0.6)]">
                    دست‌ساز
                  </span>
                  <svg
                    className="absolute -bottom-2 right-0 w-full h-4 text-amber-400"
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
            <p className="text-xl md:text-2xl text-white/85 animate-fade-in delay-200 leading-relaxed font-light drop-shadow-lg">
              {brandConfig.slogan}
              <br />
              <span className="text-gold/90 font-medium">با بهترین مواد اولیه، از شکلات بلژیکی تا پسته کرمان</span>
            </p>

            {/* Trust pillars */}
            <div className="flex flex-wrap gap-3 md:gap-4 py-6 animate-fade-in delay-300">
              {[
                { value: "پخت تازه", label: "نزدیک به زمان سفارش" },
                { value: "ارسال سراسری", label: "برای محصولات خشک" },
                { value: "تهران و کرج", label: "برای دسرهای یخچالی" },
              ].map((stat, i) => (
                <div key={i} className="bg-white/5 backdrop-blur-sm px-5 py-3 rounded-xl border border-white/10">
                  <div className="text-lg md:text-xl font-bold text-gold drop-shadow-lg">{stat.value}</div>
                  <div className="text-xs text-white/70 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Beautiful CTAs */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-4 animate-fade-in delay-400 pt-4">
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
                  پشتیبانی واتساپ
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

      {/* How to Order - Ultra Beautiful & Advanced */}
      <section className="section-padding bg-gradient-to-b from-background via-secondary/30 to-background overflow-hidden relative">
        {/* Background Decorations */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-accent/20 to-transparent rounded-full blur-[150px]" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-tl from-gold/15 to-transparent rounded-full blur-[180px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-rose/10 rounded-full blur-[100px]" />
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 right-10 w-4 h-4 bg-gold rounded-full animate-bounce opacity-60" style={{ animationDuration: '3s' }} />
        <div className="absolute bottom-32 left-16 w-3 h-3 bg-accent rounded-full animate-bounce opacity-50" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }} />
        <div className="absolute top-1/3 left-10 w-2 h-2 bg-primary rounded-full animate-pulse opacity-40" />
        
        <div className="container-custom relative z-10">
          <div className="text-center mb-20 space-y-6">
            <div className="inline-flex items-center gap-3 bg-gradient-to-l from-accent/30 via-gold/20 to-accent/30 backdrop-blur-sm px-6 py-3 rounded-full border border-gold/30 shadow-lg">
              <div className="w-2 h-2 bg-gold rounded-full animate-pulse" />
              <span className="text-sm font-bold bg-gradient-to-l from-gold to-amber-600 bg-clip-text text-transparent">سفارش آسان</span>
              <Sparkles size={16} className="text-gold" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              چطور <span className="bg-gradient-to-l from-primary via-cocoa to-primary bg-clip-text text-transparent">سفارش</span> بدهم؟
            </h2>
            <p className="body-large text-muted-foreground max-w-xl mx-auto leading-relaxed">
              تنها در سه قدم ساده، کوکی‌های تازه و خوشمزه را درب منزل تحویل بگیرید
            </p>
          </div>

          <div className="relative max-w-6xl mx-auto">
            {/* Connection Line - Animated Gradient */}
            <div className="hidden md:block absolute top-28 left-[20%] right-[20%] h-1.5 rounded-full overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-l from-gold/20 via-primary/30 to-gold/20" />
              <div className="absolute inset-0 bg-gradient-to-l from-gold via-primary to-gold animate-pulse" style={{ animationDuration: '2s' }} />
              {/* Moving dot */}
              <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-gold rounded-full shadow-[0_0_20px_rgba(251,191,36,0.8)] animate-[slide-in-right_4s_ease-in-out_infinite]" />
            </div>
            
            <div className="grid md:grid-cols-3 gap-10 md:gap-8">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="relative text-center space-y-8 animate-fade-in group"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  {/* Step Number Circle - Enhanced */}
                  <div className="relative z-10 mx-auto">
                    {/* Outer ring */}
                    <div className="absolute inset-0 w-36 h-36 mx-auto border-2 border-dashed border-primary/30 rounded-full animate-spin" style={{ animationDuration: '20s' }} />
                    
                    {/* Main circle */}
                    <div className="relative w-32 h-32 mx-auto">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary via-cocoa to-primary rounded-full shadow-2xl group-hover:shadow-[0_0_60px_rgba(139,90,43,0.4)] transition-all duration-700" />
                      <div className="absolute inset-2 bg-gradient-to-br from-primary/90 to-cocoa/90 rounded-full" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-6xl font-black text-primary-foreground drop-shadow-lg">{step.num}</span>
                      </div>
                    </div>
                    
                    {/* Glow Effect */}
                    <div className="absolute inset-0 w-32 h-32 mx-auto bg-gold/40 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10" />
                    
                    {/* Small decorative circles */}
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-gold rounded-full shadow-lg group-hover:scale-125 transition-transform duration-500" />
                    <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-accent rounded-full shadow-md group-hover:scale-125 transition-transform duration-500 delay-100" />
                  </div>
                  
                  {/* Content Card - Enhanced */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative bg-card/90 backdrop-blur-md p-8 rounded-3xl border border-border/50 shadow-xl group-hover:shadow-2xl group-hover:border-gold/30 transition-all duration-500 group-hover:-translate-y-2">
                      {/* Icon */}
                      <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 bg-gradient-to-br from-gold to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
                        {index === 0 && <Cookie size={20} className="text-primary" />}
                        {index === 1 && <Phone size={20} className="text-primary" />}
                        {index === 2 && <Truck size={20} className="text-primary" />}
                      </div>
                      
                      <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors pt-4">{step.title}</h3>
                      <p className="body-base text-muted-foreground leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-16">
            <Link
              to="/faq"
              className="group inline-flex items-center gap-3 bg-gradient-to-l from-primary/15 via-cocoa/10 to-primary/15 hover:from-primary/25 hover:via-cocoa/20 hover:to-primary/25 text-primary px-10 py-5 rounded-2xl font-bold transition-all duration-500 border border-primary/30 hover:border-gold/50 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <span>سوالات متداول و راهنمای سفارش</span>
              <ArrowLeft size={22} className="group-hover:-translate-x-2 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials - Advanced Design */}
      <section className="section-padding bg-gradient-to-br from-primary via-cocoa to-primary text-primary-foreground overflow-hidden relative">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 w-60 h-60 border-2 border-primary-foreground/10 rounded-full" />
          <div className="absolute top-20 right-20 w-40 h-40 border border-primary-foreground/20 rounded-full" />
          <div className="absolute bottom-10 left-20 w-80 h-80 border-2 border-primary-foreground/10 rounded-full" />
          <div className="absolute bottom-20 left-40 w-48 h-48 border border-primary-foreground/15 rounded-full" />
          <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-gold/10 rounded-full blur-[80px]" />
          <div className="absolute bottom-1/3 right-1/4 w-40 h-40 bg-accent/10 rounded-full blur-[100px]" />
        </div>
        
        <div className="container-custom relative z-10">
          <div className="text-center mb-16 space-y-4">
            <span className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm px-5 py-2 rounded-full text-sm font-semibold border border-primary-foreground/20">
              <Sparkles size={16} className="text-gold" />
              تعهد ما به شما
            </span>
            <h2 className="text-3xl md:text-4xl font-bold">چهار وعده‌ای که در هر سفارش رعایت می‌کنیم</h2>
            <p className="text-primary-foreground/70 max-w-lg mx-auto leading-8">
              وینیمی بیکری با هر سفارش این چهار اصل را ضمانت می‌کند.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {brandConfig.trustPillars.map((pillar, index) => (
              <div
                key={index}
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
              @winimi.bakery
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

      {/* Final CTA - Ultra Premium Design */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        {/* Background with gradient and pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-cocoa to-primary" />
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
        
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-80 h-80 bg-gold/20 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-[180px]" />
        <div className="absolute top-1/2 left-1/4 w-40 h-40 border-2 border-primary-foreground/10 rounded-full" />
        <div className="absolute bottom-1/3 right-1/4 w-60 h-60 border border-primary-foreground/10 rounded-full" />
        
        {/* Floating cookies decoration */}
        <div className="absolute top-10 right-[15%] w-16 h-16 bg-gold/30 rounded-full blur-sm animate-bounce" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-20 left-[10%] w-12 h-12 bg-accent/30 rounded-full blur-sm animate-bounce" style={{ animationDuration: '3s', animationDelay: '1s' }} />
        
        <div className="container-custom relative z-10 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-3 bg-primary-foreground/10 backdrop-blur-md px-6 py-3 rounded-full border border-primary-foreground/20 mb-8 shadow-lg">
            <Cookie className="text-gold" size={20} />
            <span className="text-primary-foreground font-semibold">سفارش فوری</span>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          </div>
          
          {/* Main Heading */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-primary-foreground mb-6 leading-tight">
            آماده <span className="bg-gradient-to-l from-gold via-amber-300 to-gold bg-clip-text text-transparent">سفارش</span> هستید؟
          </h2>
          
          <p className="text-xl md:text-2xl text-primary-foreground/80 mb-12 max-w-2xl mx-auto leading-relaxed">
            همین حالا سفارش دهید و طعم واقعی کوکی <span className="text-gold font-semibold">دست‌ساز</span> را تجربه کنید
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <a
              href={generateWhatsAppUrl("سلام، می‌خواهم سفارش بدهم.")}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden bg-[#25D366] px-12 py-6 rounded-2xl text-xl font-black text-white shadow-2xl hover:shadow-[0_0_60px_rgba(37,211,102,0.5)] transition-all duration-500 hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <span className="relative flex items-center justify-center gap-3">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                پشتیبانی واتساپ
              </span>
            </a>
            
            <Link
              to="/products"
              className="group px-10 py-6 rounded-2xl text-xl font-bold text-primary-foreground bg-primary-foreground/10 backdrop-blur-md border-2 border-primary-foreground/30 hover:bg-primary-foreground/20 hover:border-gold/50 transition-all duration-500 flex items-center gap-3"
            >
              مشاهده محصولات
              <ArrowLeft size={22} className="group-hover:-translate-x-2 transition-transform duration-300" />
            </Link>
          </div>
          
          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-8 mt-14 text-primary-foreground/70">
            <div className="flex items-center gap-2">
              <Check size={20} className="text-gold" />
              <span>ضمانت کیفیت</span>
            </div>
            <div className="flex items-center gap-2">
              <Check size={20} className="text-gold" />
              <span>ارسال سریع</span>
            </div>
            <div className="flex items-center gap-2">
              <Check size={20} className="text-gold" />
              <span>پشتیبانی ۲۴/۷</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
