import { useQuery } from "@tanstack/react-query";
import { Loader2, MapPin, MessageCircle, ShoppingCart } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { StructuredText } from "@/components/content/StructuredText";
import { ProductCard } from "@/components/ProductCard";
import { SEO } from "@/components/SEO";
import { brandConfig, generateWhatsAppUrl, SUPPORT_WHATSAPP_MESSAGE } from "@/config/brand";
import { useCatalogProducts } from "@/hooks/useCatalog";
import { ApiError, isBackendEnabled } from "@/lib/api";
import { loadCityPage } from "@/lib/content";
import NotFoundPage from "@/pages/NotFoundPage";

const CityPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const cityQuery = useQuery({ queryKey: ["store", "city", slug], queryFn: () => loadCityPage(slug as string), enabled: isBackendEnabled && Boolean(slug), staleTime: 5 * 60_000 });
  const catalog = useCatalogProducts({ featured: true, perPage: 6 });
  if (cityQuery.error instanceof ApiError && cityQuery.error.status === 404) return <NotFoundPage />;
  if (cityQuery.isLoading) return <section className="section-padding"><div className="container-custom text-center" role="status"><Loader2 className="mx-auto mb-3 animate-spin text-primary" aria-hidden="true" />در حال دریافت صفحه شهر…</div></section>;
  if (cityQuery.error || !cityQuery.data) return <section className="section-padding"><div className="container-custom rounded-3xl border border-destructive/30 bg-destructive/5 p-10 text-center text-destructive" role="alert">{cityQuery.error instanceof Error ? cityQuery.error.message : "صفحه شهر دریافت نشد."}</div></section>;
  const city = cityQuery.data;
  const schema = { "@context": "https://schema.org", "@type": "Service", name: city.title, description: city.description, provider: { "@type": "Bakery", name: brandConfig.brandName, url: brandConfig.website }, areaServed: { "@type": "City", name: city.city } };
  return (
    <>
      <SEO title={city.seo.title || city.title} description={city.seo.description || city.description} schema={schema} />
      <section className="bg-gradient-to-b from-primary/5 to-background section-padding"><div className="container-custom"><Breadcrumbs className="mb-8" items={[{ name: "خانه", href: "/" }, { name: "محصولات", href: "/products" }, { name: city.city }]} /><div className="max-w-4xl"><div className="mb-5 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-bold text-primary"><MapPin size={16} aria-hidden="true" />خرید و ارسال به {city.city}</div><h1 className="heading-1 mb-6">{city.title}</h1><p className="body-large mb-8 max-w-3xl leading-9 text-muted-foreground">{city.description}</p><div className="flex flex-col gap-3 sm:flex-row"><Link to="/products" className="btn-primary inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3"><ShoppingCart size={18} aria-hidden="true" />مشاهده محصولات</Link><a href={generateWhatsAppUrl(SUPPORT_WHATSAPP_MESSAGE)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl bg-whatsapp px-6 py-3 font-bold text-white"><MessageCircle size={18} aria-hidden="true" />سؤال از پشتیبانی</a></div></div></div></section>
      <section className="bg-secondary/30 section-padding"><div className="container-custom max-w-4xl rounded-3xl border border-border bg-card p-6 shadow-soft md:p-9"><StructuredText content={city.content} /></div></section>
      <section className="section-padding"><div className="container-custom"><h2 className="heading-2 mb-10 text-center">محصولات منتخب</h2>{catalog.isLoading ? <div className="py-10 text-center">در حال دریافت محصولات…</div> : catalog.products.length ? <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{catalog.products.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <div className="rounded-3xl border border-border bg-card p-10 text-center">محصول منتخبی موجود نیست.</div>}</div></section>
    </>
  );
};

export default CityPage;
