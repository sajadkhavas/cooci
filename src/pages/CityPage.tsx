import { Link, Navigate, useParams } from "react-router-dom";
import { Clock, MapPin, MessageCircle, Phone } from "lucide-react";
import { SEO } from "@/components/SEO";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProductCard } from "@/components/ProductCard";
import { getCityBySlug } from "@/data/cities";
import { useCatalogProducts } from "@/hooks/useCatalog";
import { brandConfig, generatePhoneUrl, generateWhatsAppUrl, SUPPORT_WHATSAPP_MESSAGE } from "@/config/brand";

const CityPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const city = slug ? getCityBySlug(slug) : undefined;
  const { products } = useCatalogProducts();

  if (!city) return <Navigate to="/" replace />;

  const featured = products.filter((p) => p.isFeatured).slice(0, 6);
  const message = `سلام، از ${city.name} می‌خواهم سفارش بدهم. لطفاً راهنمایی کنید.`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: `${brandConfig.brandName} - ${city.name}`,
    telephone: brandConfig.phone,
    address: { "@type": "PostalAddress", addressLocality: city.name, addressCountry: "IR" },
    areaServed: city.name,
  };

  return (
    <>
      <SEO title={city.seoTitle} description={city.seoDescription} schema={schema} />
      <section className="section-padding bg-gradient-to-b from-primary/5 to-background">
        <div className="container-custom">
          <Breadcrumbs className="mb-8" items={[{ name: "خانه", href: "/" }, { name: city.name }]} />
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4 text-sm font-bold">
              <MapPin size={16} />
              ارسال به {city.name}
            </div>
            <h1 className="heading-1 text-foreground mb-6">{city.heading}</h1>
            <p className="body-large text-muted-foreground leading-9 mb-8">{city.intro}</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-card border border-border rounded-2xl p-5">
                <Clock className="text-primary mb-2" size={22} />
                <p className="font-bold text-foreground">{city.deliveryTime}</p>
                <p className="text-sm text-muted-foreground mt-1">{city.deliveryScope}</p>
              </div>
              <div className="bg-primary text-primary-foreground rounded-2xl p-5">
                <MessageCircle className="mb-2" size={22} />
                <p className="font-bold mb-2">سفارش سریع در واتساپ</p>
                <a
                  href={generateWhatsAppUrl(message)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-white text-primary rounded-xl px-4 py-2 text-sm font-bold"
                >
                  شروع سفارش
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-secondary/30">
        <div className="container-custom max-w-4xl">
          <h2 className="heading-2 text-foreground mb-6">چرا {brandConfig.brandName} در {city.name}؟</h2>
          <ul className="grid md:grid-cols-2 gap-4">
            {city.highlights.map((h) => (
              <li key={h} className="bg-card border border-border rounded-2xl p-4 flex gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <span className="text-foreground leading-8">{h}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="section-padding">
          <div className="container-custom">
            <h2 className="heading-2 text-foreground text-center mb-10">محبوب‌ترین انتخاب‌ها برای {city.name}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
            <div className="text-center mt-8">
              <Link to="/products" className="btn-primary px-8 py-3 rounded-xl font-bold inline-block">همه محصولات</Link>
            </div>
          </div>
        </section>
      )}

      <section className="section-padding bg-secondary/30">
        <div className="container-custom max-w-3xl">
          <h2 className="heading-2 text-foreground text-center mb-8">سؤالات متداول {city.name}</h2>
          <div className="space-y-3">
            {city.faq.map((f) => (
              <details key={f.question} className="group bg-card border border-border rounded-2xl p-5">
                <summary className="cursor-pointer font-bold text-foreground list-none flex justify-between items-center">
                  {f.question}
                  <span className="text-primary group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-3 text-muted-foreground leading-8">{f.answer}</p>
              </details>
            ))}
          </div>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <a href={generateWhatsAppUrl(message)} target="_blank" rel="noopener noreferrer" className="bg-whatsapp text-white rounded-xl px-6 py-3 font-bold text-center flex items-center justify-center gap-2">
              <MessageCircle size={18} /> واتساپ
            </a>
            <a href={generatePhoneUrl()} className="border-2 border-primary text-primary rounded-xl px-6 py-3 font-bold text-center flex items-center justify-center gap-2">
              <Phone size={18} /> {brandConfig.phone}
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default CityPage;
