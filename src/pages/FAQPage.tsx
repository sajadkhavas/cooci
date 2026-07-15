import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ShoppingBag } from "lucide-react";
import { SEO } from "@/components/SEO";
import { faqItems, faqCategories } from "@/data/faq";

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
        description="پاسخ به سوالات متداول درباره سفارش آنلاین، سبد خرید، ارسال، نگهداری کوکی و محصولات بدون قند افزوده."
      />

      <section className="bg-secondary/50 py-12">
        <div className="container-custom text-center">
          <h1 className="heading-1 text-foreground">سوالات متداول</h1>
          <p className="body-large text-muted-foreground mt-4">
            پاسخ سوالات شما درباره سفارش آنلاین، ارسال، نگهداری و محصولات وینیمی
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom max-w-4xl">
          <div className="flex flex-wrap gap-2 mb-10 justify-center">
            <button
              type="button"
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
                type="button"
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

          <div className="space-y-4">
            {filteredFAQ.map((item, index) => (
              <div
                key={index}
                className="bg-card rounded-xl overflow-hidden shadow-soft animate-fade-in border border-border"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <button
                  type="button"
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
                  <div className="px-5 pb-5 text-muted-foreground animate-fade-in leading-8">
                    {item.answer}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 text-center p-8 bg-secondary/50 rounded-xl border border-border">
            <h2 className="heading-3 mb-2">برای خرید آماده‌اید؟</h2>
            <p className="text-muted-foreground mb-4">
              مسیر اصلی سفارش از صفحه محصولات، سبد خرید و تکمیل سفارش انجام می‌شود.
            </p>
            <Link
              to="/products"
              className="btn-primary px-8 py-3 rounded-lg font-medium inline-flex items-center gap-2"
            >
              <ShoppingBag size={18} />
              مشاهده محصولات
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default FAQPage;
