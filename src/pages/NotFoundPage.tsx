import { ArrowRight, ShoppingBag } from "lucide-react";
import { Link } from "react-router";
import { SEO } from "@/components/SEO";

const NotFoundPage = () => (
  <>
    <SEO
      title="صفحه یافت نشد"
      description="صفحه‌ای که به‌دنبال آن بودید پیدا نشد."
      noIndex
    />
    <section className="section-padding flex min-h-[65vh] items-center justify-center bg-gradient-to-b from-secondary/30 to-background">
      <div className="container-custom">
        <div className="mx-auto max-w-2xl rounded-3xl border border-border bg-card p-8 text-center shadow-soft md:p-12">
          <span className="mb-5 block text-7xl md:text-8xl" aria-hidden="true">
            🍪
          </span>
          <p className="mb-2 text-sm font-bold tracking-[0.35em] text-primary">ERROR 404</p>
          <h1 className="heading-1 mb-4 text-foreground">این صفحه پیدا نشد</h1>
          <p className="body-large mx-auto mb-8 max-w-lg text-muted-foreground">
            ممکن است آدرس صفحه تغییر کرده باشد یا لینک واردشده درست نباشد.
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/"
              className="btn-primary inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3"
            >
              <ArrowRight size={18} aria-hidden="true" />
              بازگشت به خانه
            </Link>
            <Link
              to="/products"
              className="btn-secondary inline-flex items-center justify-center gap-2 rounded-xl border border-border px-6 py-3"
            >
              <ShoppingBag size={18} aria-hidden="true" />
              مشاهده محصولات
            </Link>
          </div>
        </div>
      </div>
    </section>
  </>
);

export default NotFoundPage;
