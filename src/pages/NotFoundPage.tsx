import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
const NotFoundPage = () => (
  <>
    <SEO title="صفحه یافت نشد" />
    <section className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-6">
        <span className="text-8xl">🍪</span>
        <h1 className="heading-1 text-foreground">۴۰۴</h1>
        <p className="body-large text-muted-foreground">صفحه مورد نظر یافت نشد</p>
        <div className="flex gap-4 justify-center">
          <Link to="/" className="btn-primary px-6 py-3 rounded-lg">بازگشت به خانه</Link>
          <Link to="/products" className="btn-secondary px-6 py-3 rounded-lg border border-border">مشاهده محصولات</Link>
        </div>
      </div>
    </section>
  </>
);
export default NotFoundPage;
