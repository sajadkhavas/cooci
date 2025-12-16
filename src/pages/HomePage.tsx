import { Link } from "react-router-dom";
import { ArrowLeft, Check, Star } from "lucide-react";
import { SEO } from "@/components/SEO";
import { ProductCard } from "@/components/ProductCard";
import { getFeaturedProducts } from "@/data/products";
import { brandConfig, generateWhatsAppUrl } from "@/config/brand";

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

const HomePage = () => {
  const featuredProducts = getFeaturedProducts().slice(0, 6);

  return (
    <>
      <SEO />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-secondary to-background section-padding overflow-hidden">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-4">
                <h1 className="heading-1 text-foreground">
                  {brandConfig.tagline}
                </h1>
                <p className="body-large text-muted-foreground">
                  {brandConfig.slogan}
                  <br />
                  کوکی‌های دست‌ساز با مواد اولیه درجه یک، تازه‌پخت هر روز
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href={generateWhatsAppUrl("سلام، می‌خواهم سفارش بدهم.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp px-8 py-4 rounded-lg text-lg font-medium text-center"
                >
                  سفارش در واتساپ
                </a>
                <Link
                  to="/products"
                  className="btn-secondary px-8 py-4 rounded-lg text-lg font-medium text-center border border-border"
                >
                  مشاهده محصولات
                </Link>
              </div>
            </div>

            {/* Hero Image Placeholder */}
            <div className="relative animate-fade-in delay-200">
              <div className="aspect-square bg-gradient-to-br from-pistachio-light/30 to-secondary rounded-2xl flex items-center justify-center">
                <span className="text-9xl">🍪</span>
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-accent/20 rounded-full blur-3xl" />
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-rose/30 rounded-full blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12 space-y-4">
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
      <section className="section-padding bg-secondary/50">
        <div className="container-custom">
          <div className="text-center mb-12 space-y-4">
            <h2 className="heading-2 text-foreground">چرا کوکی‌های ما؟</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-card p-8 rounded-xl text-center space-y-4 shadow-soft animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-16 h-16 mx-auto bg-accent/20 rounded-full flex items-center justify-center">
                  <Check className="text-accent" size={28} />
                </div>
                <h3 className="heading-3">{feature.title}</h3>
                <p className="body-base text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Order */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12 space-y-4">
            <h2 className="heading-2 text-foreground">چطور سفارش بدهم؟</h2>
            <p className="body-base text-muted-foreground">
              در سه قدم ساده کوکی تازه تحویل بگیرید
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className="relative text-center space-y-4 animate-fade-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="w-20 h-20 mx-auto bg-primary text-primary-foreground rounded-full flex items-center justify-center text-3xl font-bold">
                  {step.num}
                </div>
                <h3 className="heading-3">{step.title}</h3>
                <p className="body-base text-muted-foreground">{step.desc}</p>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-0 w-full">
                    <div className="w-1/2 h-0.5 bg-border mr-auto" />
                  </div>
                )}
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
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container-custom">
          <div className="text-center mb-12 space-y-4">
            <h2 className="heading-2">نظر مشتریان</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-primary-foreground/10 p-6 rounded-xl space-y-4 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={18} fill="currentColor" className="text-gold" />
                  ))}
                </div>
                <p className="body-base">{testimonial.text}</p>
                <p className="font-medium">— {testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12 space-y-4">
            <h2 className="heading-2 text-foreground">ما را در اینستاگرام دنبال کنید</h2>
            <a
              href={brandConfig.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary font-medium link-underline"
            >
              @cookie_bakery
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="aspect-square bg-gradient-to-br from-secondary to-muted rounded-lg flex items-center justify-center card-hover"
              >
                <span className="text-4xl opacity-50">🍪</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
