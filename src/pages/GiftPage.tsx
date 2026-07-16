import { Link } from "react-router-dom";
import { Gift, Heart, MessageCircle, Sparkles, Star } from "lucide-react";
import { SEO } from "@/components/SEO";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProductCard } from "@/components/ProductCard";
import { useCatalogProducts } from "@/hooks/useCatalog";
import { brandConfig, generateWhatsAppUrl } from "@/config/brand";
import galleryGiftBoxes from "@/assets/cookies/gallery-gift-boxes.jpg";

const occasions = [
  { icon: Heart, title: "ولنتاین و سالگرد", desc: "باکس‌های عاشقانه با کارت شخصی" },
  { icon: Star, title: "تولد و جشن", desc: "ترکیب کوکی‌های محبوب با روبان" },
  { icon: Gift, title: "تشکر و تبریک", desc: "هدیه‌ای متفاوت برای دوستان و همکاران" },
  { icon: Sparkles, title: "روز مادر و پدر", desc: "ذوقی خانگی برای عزیزترین‌ها" },
];

const GiftPage = () => {
  const { products } = useCatalogProducts();
  const giftProducts = products.filter((p) => p.categorySlug === "gift");
  const message = `سلام، می‌خواهم باکس هدیه ${brandConfig.brandName} سفارش دهم. لطفاً راهنمایی کنید.`;

  return (
    <>
      <SEO
        title="باکس هدیه کوکی و شیرینی"
        description="باکس‌های هدیه لوکس وینیمی برای تولد، سالگرد، ولنتاین، روز مادر و تشکر شرکتی. طراحی هنری و کارت شخصی."
      />
      <section className="relative section-padding bg-gradient-to-br from-primary/10 via-background to-accent/10 overflow-hidden">
        <div className="container-custom">
          <Breadcrumbs className="mb-8" items={[{ name: "خانه", href: "/" }, { name: "باکس هدیه" }]} />
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-gold/20 text-amber-800 px-4 py-2 rounded-full mb-6 text-sm font-bold">
                <Gift size={16} /> باکس‌های هدیه
              </div>
              <h1 className="heading-1 text-foreground mb-6">هدیه‌ای که فراموش نمی‌شود</h1>
              <p className="body-large text-muted-foreground leading-9 mb-8">
                باکس‌های هدیه {brandConfig.brandName} ترکیبی از کوکی‌های محبوب ما در بسته‌بندی لوکس‌اند. با کارت شخصی، روبان دلخواه و امکان چاپ لوگو برای هدایای شرکتی.
              </p>
              <a href={generateWhatsAppUrl(message)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-whatsapp text-white px-8 py-4 rounded-xl font-bold shadow-lg">
                <MessageCircle size={20} /> مشاوره سفارش هدیه
              </a>
            </div>
            <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
              <img src={galleryGiftBoxes} alt="باکس هدیه وینیمی" className="w-full h-full object-cover" loading="eager" />
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <h2 className="heading-2 text-foreground text-center mb-12">برای هر مناسبتی</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {occasions.map((o) => (
              <div key={o.title} className="bg-card border border-border rounded-3xl p-6 text-center hover:shadow-hover transition-all">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <o.icon className="text-primary" size={28} />
                </div>
                <h3 className="font-bold text-foreground mb-2">{o.title}</h3>
                <p className="text-sm text-muted-foreground leading-7">{o.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {giftProducts.length > 0 && (
        <section className="section-padding bg-secondary/30">
          <div className="container-custom">
            <h2 className="heading-2 text-foreground text-center mb-10">باکس‌های آماده</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {giftProducts.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      <section className="section-padding">
        <div className="container-custom max-w-4xl bg-primary text-primary-foreground rounded-3xl p-10 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">هدیه شرکتی؟</h2>
          <p className="text-primary-foreground/80 mb-8 leading-8">
            برای سفارش‌های بالای ۲۰ عدد امکان چاپ لوگو، طراحی کارت شخصی و تخفیف ویژه فراهم است.
          </p>
          <Link to="/corporate" className="inline-block bg-white text-primary px-8 py-3 rounded-xl font-bold">
            اطلاعات بیشتر هدیه شرکتی
          </Link>
        </div>
      </section>
    </>
  );
};

export default GiftPage;
