import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, Loader2, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SEO } from "@/components/SEO";
import { brandConfig, generateWhatsAppUrl, SUPPORT_WHATSAPP_MESSAGE } from "@/config/brand";
import { isBackendEnabled } from "@/lib/api";
import { loadFaqs } from "@/lib/content";

const FAQPage = () => {
  const [openId, setOpenId] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const query = useQuery({ queryKey: ["store", "faqs"], queryFn: () => loadFaqs(), enabled: isBackendEnabled, staleTime: 5 * 60_000 });
  const faqs = query.data ?? [];
  const categories = useMemo(() => [...new Set(faqs.map((item) => item.category).filter(Boolean))], [faqs]);
  const filtered = activeCategory ? faqs.filter((item) => item.category === activeCategory) : faqs;
  const schema = faqs.length ? { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })) } : undefined;

  return (
    <>
      <SEO title="سوالات متداول" description="پاسخ‌های منتشرشده فروشگاه درباره سفارش، پرداخت، ارسال و محصولات." schema={schema} />
      <section className="bg-secondary/50 py-12"><div className="container-custom text-center"><Breadcrumbs className="mb-4 justify-center" items={[{ name: "خانه", href: "/" }, { name: "سوالات متداول" }]} /><h1 className="heading-1 text-foreground">سوالات متداول</h1><p className="body-large mt-4 text-muted-foreground">پاسخ‌های مدیریت‌شده {brandConfig.brandName}</p></div></section>
      <section className="section-padding"><div className="container-custom max-w-4xl">
        {query.isLoading ? <div className="py-16 text-center" role="status"><Loader2 className="mx-auto mb-3 animate-spin text-primary" aria-hidden="true" />در حال دریافت سوال‌ها…</div> : query.error ? <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center text-destructive" role="alert">{query.error instanceof Error ? query.error.message : "دریافت سوال‌ها ناموفق بود."}</div> : (
          <>
            <div className="mb-10 flex flex-wrap justify-center gap-2"><button type="button" onClick={() => setActiveCategory(null)} className={`rounded-full px-4 py-2 text-sm font-medium ${!activeCategory ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>همه</button>{categories.map((category) => <button key={category} type="button" onClick={() => setActiveCategory(category)} className={`rounded-full px-4 py-2 text-sm font-medium ${activeCategory === category ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>{category}</button>)}</div>
            <div className="space-y-4">{filtered.map((item) => <article key={item.id} className="overflow-hidden rounded-xl border border-border bg-card shadow-soft"><button type="button" onClick={() => setOpenId(openId === item.id ? null : item.id)} className="flex w-full items-center justify-between p-5 text-right hover:bg-secondary/50" aria-expanded={openId === item.id}><span className="font-medium">{item.question}</span><ChevronDown size={20} className={`transition-transform ${openId === item.id ? "rotate-180" : ""}`} aria-hidden="true" /></button>{openId === item.id && <div className="px-5 pb-5 leading-8 text-muted-foreground">{item.answer}</div>}</article>)}</div>
            {filtered.length === 0 && <div className="rounded-2xl border border-border bg-card p-8 text-center">سوالی در این دسته منتشر نشده است.</div>}
          </>
        )}
        <div className="mt-12 rounded-2xl bg-primary/10 p-8 text-center"><h2 className="heading-3 mb-2">پاسخ سوال‌تان را نیافتید؟</h2><div className="mt-4 flex flex-col justify-center gap-3 sm:flex-row"><a href={generateWhatsAppUrl(SUPPORT_WHATSAPP_MESSAGE)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl bg-whatsapp px-6 py-3 font-bold text-white"><MessageCircle size={18} aria-hidden="true" />پشتیبانی واتساپ</a><Link to="/contact" className="btn-primary rounded-xl px-6 py-3 font-medium">ثبت درخواست تماس</Link></div></div>
      </div></section>
    </>
  );
};

export default FAQPage;
