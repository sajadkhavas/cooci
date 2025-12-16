import { SEO } from "@/components/SEO";
import { brandConfig } from "@/config/brand";
const ShippingPage = () => (
  <>
    <SEO title="شرایط ارسال" description="شرایط ارسال و تحویل سفارش‌های شیرینی‌فروشی کوکی" />
    <section className="section-padding">
      <div className="container-custom max-w-3xl">
        <h1 className="heading-1 text-foreground mb-8">شرایط ارسال و تحویل</h1>
        <div className="space-y-6 text-muted-foreground">
          <h2 className="heading-3 text-foreground">ارسال در تهران</h2>
          <p>ارسال با پیک موتوری در همان روز یا روز بعد. هزینه: ۴۰,۰۰۰ تا ۸۰,۰۰۰ تومان بسته به منطقه.</p>
          <h2 className="heading-3 text-foreground">ارسال به شهرستان</h2>
          <p>با پست پیشتاز ۲ تا ۵ روز کاری. بسته‌بندی ویژه برای حفظ کیفیت.</p>
          <h2 className="heading-3 text-foreground">تحویل حضوری</h2>
          <p>آدرس: {brandConfig.address}</p>
          <h2 className="heading-3 text-foreground">ارسال رایگان</h2>
          <p>برای سفارش‌های بالای ۵۰۰,۰۰۰ تومان در تهران، ارسال رایگان است.</p>
        </div>
      </div>
    </section>
  </>
);
export default ShippingPage;
