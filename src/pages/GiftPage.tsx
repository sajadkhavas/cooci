import { Gift, Heart, MessageCircle, Sparkles, Star } from "lucide-react";
import { Link } from "react-router-dom";
import galleryGiftBoxes from "@/assets/cookies/gallery-gift-boxes.jpg";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { ProductCard } from "@/components/ProductCard";
import { SEO } from "@/components/SEO";
import { brandConfig, generateWhatsAppUrl } from "@/config/brand";
import { useCatalogProducts } from "@/hooks/useCatalog";

const occasions = [
  { icon: Heart, title: "سالگرد و مناسبت شخصی", desc: "درخواست کارت و ترکیب پیشنهادی" },
  { icon: Star, title: "تولد و جشن", desc: "انتخاب محصول و تعداد متناسب با جشن" },
  { icon: Gift, title: "تشکر و تبریک", desc: "درخواست بسته‌بندی هدیه پس از استعلام" },
  { icon: Sparkles, title: "هدیه خانوادگی", desc: "ترکیب محصولات موجود فروشگاه" },
];

const GiftPage = () => {
  const { products } = useCatalogProducts({ category: "gift", perPage: 12 });
  const message = `سلام، برای انتخاب هدیه از ${brandConfig.brandName} راهنمایی می‌خواهم.`;

  return (
    <>
      <SEO
        title="باکس هدیه کوکی و شیرینی"
        description="مشاهده محصولات هدیه و ثبت درخواست اختصاصی هدیه در وینیمی."
      />
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10 section-padding">
        <div className="container-custom">
          <Breadcrumbs className="mb-8" items={[{ name: "خانه", href: "/" }, { name: "باکس هدیه" }]} />
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-gold/20 px-4 py-2 text-sm font-bold text-amber-800">
                <Gift size={16} aria-hidden="true" /> محصولات و درخواست هدیه
              </div>
              <h1 className="heading-1 mb-6 text-foreground">هدیه‌ای متناسب با مناسبت شما</h1>
              <p className="body-large mb-8 leading-9 text-muted-foreground">
                محصولات آماده را از فروشگاه انتخاب کنید. برای کارت، بسته‌بندی یا ترکیب اختصاصی، درخواست ثبت کنید تا امکان اجرا، هزینه و زمان آماده‌سازی بررسی شود.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link to="/products?category=gift" className="btn-primary inline-flex items-center justify-center rounded-xl px-7 py-4 font-bold">
                  مشاهده محصولات هدیه
                </Link>
                <a href={generateWhatsAppUrl(message)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl bg-whatsapp px-7 py-4 font-bold text-white">
                  <MessageCircle size={19} aria-hidden="true" /> مشاوره پشتیبانی
                </a>
              </div>
            </div>
            <div className="aspect-square overflow-hidden rounded-3xl shadow-2xl">
              <img src={galleryGiftBoxes} alt="تصویر نمایشی بسته‌بندی هدیه وینیمی" className="h-full w-full object-cover" loading="eager" />
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <h2 className="heading-2 mb-12 text-center text-foreground">برای مناسبت‌های مختلف</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {occasions.map((occasion) => (
              <article key={occasion.title} className="rounded-3xl border border-border bg-card p-6 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                  <occasion.icon className="text-primary" size={28} aria-hidden="true" />
                </div>
                <h3 className="mb-2 font-bold text-foreground">{occasion.title}</h3>
                <p className="text-sm leading-7 text-muted-foreground">{occasion.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {products.length > 0 && (
        <section className="bg-secondary/30 section-padding">
          <div className="container-custom">
            <h2 className="heading-2 mb-10 text-center text-foreground">محصولات هدیه فعال</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
          </div>
        </section>
      )}

      <section className="section-padding">
        <div className="container-custom max-w-4xl">
          <InquiryForm
            type="gift"
            title="ثبت درخواست هدیه اختصاصی"
            description="مناسبت، تعداد، بودجه تقریبی، شهر مقصد و تاریخ موردنظر را بنویسید. ثبت فرم به معنی تأیید قطعی ظرفیت یا قیمت نیست."
            defaultSubject="درخواست هدیه اختصاصی"
            messageLabel="جزئیات مناسبت و درخواست"
            metadata={{ source: "gift-page" }}
          />
        </div>
      </section>
    </>
  );
};

export default GiftPage;
