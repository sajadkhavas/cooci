import { SEO } from "@/components/SEO";
const TermsPage = () => (
  <>
    <SEO title="شرایط استفاده" description="شرایط و قوانین استفاده از خدمات شیرینی‌فروشی کوکی" />
    <section className="section-padding">
      <div className="container-custom max-w-3xl">
        <h1 className="heading-1 text-foreground mb-8">شرایط استفاده</h1>
        <div className="space-y-6 text-muted-foreground">
          <p>با استفاده از خدمات ما، شرایط زیر را می‌پذیرید:</p>
          <h2 className="heading-3 text-foreground">سفارش و پرداخت</h2>
          <p>سفارش‌ها پس از تأیید نهایی قابل کنسل نیستند. پرداخت به صورت نقدی هنگام تحویل یا کارت به کارت است.</p>
          <h2 className="heading-3 text-foreground">کیفیت محصولات</h2>
          <p>تمام محصولات تازه‌پخت هستند. در صورت مشکل کیفی، ظرف ۲۴ ساعت اطلاع دهید.</p>
        </div>
      </div>
    </section>
  </>
);
export default TermsPage;
