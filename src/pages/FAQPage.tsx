import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ChevronDown, MessageCircle } from "lucide-react";
import { SEO } from "@/components/SEO";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { faqItems, faqCategories } from "@/data/faq";
import { brandConfig, generateWhatsAppUrl, SUPPORT_WHATSAPP_MESSAGE } from "@/config/brand";

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredFAQ = activeCategory
    ? faqItems.filter((item) => item.category === activeCategory)
    : faqItems;

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <>
      <SEO
        title="سوالات متداول"
        description="پاسخ به سوالات متداول درباره سفارش واتساپی، ارسال، نگهداری کوکی و محصولات بدون قند افزوده وینیمی بیکری."
        schema={schema}
      />

      <section className="bg-secondary/50 py-12">
        <div className="container-custom text-center">
          <Breadcrumbs className="mb-4 justify-center" items={[{ name: "خانه", href: "/" }, { name: "سوالات متداول" }]} />
          <h1 className="heading-1 text-foreground">سوالات متداول</h1>
          <p className="body-large text-muted-foreground mt-4">
            پاسخ سوالات شما درباره سفارش، ارسال، نگهداری و محصولات {brandConfig.brandName}
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom max-w-4xl">
          <div className="flex flex-wrap gap-2 mb-10 justify-center">
            <button
              type="button"
              onClick={() => setActiveCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${!activeCategory ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-muted"}`}
            >همه</button>
            {faqCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeCategory === cat ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-muted"}`}
              >{cat}</button>
            ))}
          </div>

          <div className="space-y-4">
            {filteredFAQ.map((item, index) => (
              <div key={index} className="bg-card rounded-xl overflow-hidden shadow-soft border border-border">
                <button
                  type="button"
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-right hover:bg-secondary/50 transition-colors"
                >
                  <span className="font-medium text-foreground">{item.question}</span>
                  <ChevronDown size={20} className={`text-muted-foreground transition-transform ${openIndex === index ? "rotate-180" : ""}`} />
                </button>
                {openIndex === index && (
                  <div className="px-5 pb-5 text-muted-foreground leading-8 animate-fade-in">{item.answer}</div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 text-center p-8 bg-primary/10 rounded-2xl">
            <h2 className="heading-3 mb-2">پاسخ سوال‌تان را نیافتید؟</h2>
            <p className="text-muted-foreground mb-4">تیم پشتیبانی {brandConfig.brandName} در واتساپ آماده پاسخگویی است.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href={generateWhatsAppUrl(SUPPORT_WHATSAPP_MESSAGE)} target="_blank" rel="noopener noreferrer" className="bg-whatsapp text-white px-6 py-3 rounded-xl font-bold inline-flex items-center justify-center gap-2">
                <MessageCircle size={18} /> پشتیبانی واتساپ
              </a>
              <Link to="/products" className="btn-primary px-6 py-3 rounded-xl font-medium">مشاهده محصولات</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default FAQPage;
