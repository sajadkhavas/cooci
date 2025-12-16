import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { SEO } from "@/components/SEO";
import { faqItems, faqCategories } from "@/data/faq";
import { brandConfig, generateWhatsAppUrl } from "@/config/brand";

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredFAQ = activeCategory
    ? faqItems.filter((item) => item.category === activeCategory)
    : faqItems;

  return (
    <>
      <SEO
        title="سوالات متداول"
        description="پاسخ به سوالات متداول درباره سفارش، ارسال، نگهداری کوکی و موارد دیگر"
      />

      {/* Header */}
      <section className="bg-secondary/50 py-12">
        <div className="container-custom text-center">
          <h1 className="heading-1 text-foreground">سوالات متداول</h1>
          <p className="body-large text-muted-foreground mt-4">
            پاسخ سوالات شما درباره سفارش و محصولات
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom max-w-4xl">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-10 justify-center">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                !activeCategory
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-muted"
              }`}
            >
              همه
            </button>
            {faqCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-muted"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {filteredFAQ.map((item, index) => (
              <div
                key={index}
                className="bg-card rounded-xl overflow-hidden shadow-soft animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-right hover:bg-secondary/50 transition-colors"
                >
                  <span className="font-medium text-foreground">{item.question}</span>
                  <ChevronDown
                    size={20}
                    className={`text-muted-foreground transition-transform ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openIndex === index && (
                  <div className="px-5 pb-5 text-muted-foreground animate-fade-in">
                    {item.answer}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-12 text-center p-8 bg-secondary/50 rounded-xl">
            <h2 className="heading-3 mb-2">سوال دیگری دارید؟</h2>
            <p className="text-muted-foreground mb-4">
              با ما در واتساپ تماس بگیرید
            </p>
            <a
              href={generateWhatsAppUrl("سلام، یک سوال دارم.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp px-8 py-3 rounded-lg font-medium inline-block"
            >
              ارسال پیام در واتساپ
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default FAQPage;
