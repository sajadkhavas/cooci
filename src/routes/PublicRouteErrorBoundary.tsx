import { AlertCircle, RefreshCw } from "lucide-react";
import { isRouteErrorResponse, useRouteError } from "react-router";
import { SEO } from "@/components/SEO";
import NotFoundPage from "@/pages/NotFoundPage";

const PublicRouteErrorBoundary = () => {
  const error = useRouteError();

  if (isRouteErrorResponse(error) && error.status === 404) {
    return <NotFoundPage />;
  }

  return (
    <>
      <SEO
        title="اختلال موقت"
        description="دریافت اطلاعات این صفحه موقتاً با مشکل روبه‌رو شده است."
        robots="noindex,nofollow"
      />
      <section className="section-padding flex min-h-[60vh] items-center justify-center">
        <div className="container-custom">
          <div className="mx-auto max-w-2xl rounded-3xl border border-amber-300 bg-amber-50 p-8 text-center text-amber-950 shadow-soft md:p-12">
            <AlertCircle className="mx-auto mb-5" size={56} aria-hidden="true" />
            <h1 className="heading-2 mb-4">دریافت اطلاعات موقتاً ممکن نیست</h1>
            <p className="mx-auto mb-8 max-w-lg leading-8">
              برای جلوگیری از نمایش اطلاعات ناقص، این صفحه تا برقراری دوباره ارتباط با سرور ایندکس نمی‌شود.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="btn-primary inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3"
            >
              <RefreshCw size={18} aria-hidden="true" />
              تلاش دوباره
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default PublicRouteErrorBoundary;
