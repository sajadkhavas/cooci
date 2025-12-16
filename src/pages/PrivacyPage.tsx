import { SEO } from "@/components/SEO";
import { brandConfig } from "@/config/brand";

const PrivacyPage = () => (
  <>
    <SEO title="حریم خصوصی" description="سیاست حریم خصوصی شیرینی‌فروشی کوکی" />
    <section className="section-padding">
      <div className="container-custom max-w-3xl prose prose-lg">
        <h1 className="heading-1 text-foreground mb-8">حریم خصوصی</h1>
        <p className="text-muted-foreground">ما به حریم خصوصی شما احترام می‌گذاریم. اطلاعاتی که برای سفارش دریافت می‌کنیم (نام، شماره تماس، آدرس) فقط برای پردازش سفارش استفاده می‌شود و با هیچ شخص ثالثی به اشتراک گذاشته نمی‌شود.</p>
        <h2 className="heading-3 mt-8">اطلاعات جمع‌آوری شده</h2>
        <ul className="text-muted-foreground list-disc pr-6">
          <li>نام و نام خانوادگی</li>
          <li>شماره تماس</li>
          <li>آدرس تحویل</li>
        </ul>
        <h2 className="heading-3 mt-8">تماس</h2>
        <p className="text-muted-foreground">برای سوالات: {brandConfig.phone}</p>
      </div>
    </section>
  </>
);
export default PrivacyPage;
