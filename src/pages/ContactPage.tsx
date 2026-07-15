import { Clock, Instagram, Mail, MapPin, Phone, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { brandConfig, generatePhoneUrl } from "@/config/brand";

const ContactPage = () => {
  return (
    <>
      <SEO title="تماس با ما" description="راه‌های ارتباط با وینیمی بیکری؛ تلفن، اینستاگرام، آدرس، ایمیل و ساعات کاری." />
      <section className="bg-secondary/50 py-12">
        <div className="container-custom text-center">
          <h1 className="heading-1 text-foreground">تماس با ما</h1>
          <p className="body-large text-muted-foreground mt-4 max-w-2xl mx-auto">
            برای پشتیبانی، همکاری، سفارش سازمانی یا پیگیری سفارش از مسیرهای رسمی زیر استفاده کنید.
          </p>
        </div>
      </section>
      <section className="section-padding">
        <div className="container-custom max-w-4xl">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-4 bg-card rounded-xl border border-border">
                <Phone className="text-primary" size={24} />
                <div>
                  <h3 className="font-semibold">تلفن</h3>
                  <a href={generatePhoneUrl()} className="text-primary hover:underline">{brandConfig.phone}</a>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-card rounded-xl border border-border">
                <Mail className="text-primary" size={24} />
                <div>
                  <h3 className="font-semibold">ایمیل</h3>
                  <a href={`mailto:${brandConfig.email}`} className="text-primary hover:underline">{brandConfig.email}</a>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-card rounded-xl border border-border">
                <MapPin className="text-primary" size={24} />
                <div>
                  <h3 className="font-semibold">آدرس</h3>
                  <p className="text-muted-foreground">{brandConfig.address}</p>
                  <a href={brandConfig.mapUrl} target="_blank" rel="noreferrer" className="text-primary text-sm hover:underline">مشاهده در نقشه</a>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-card rounded-xl border border-border">
                <Clock className="text-primary" size={24} />
                <div>
                  <h3 className="font-semibold">ساعات کاری</h3>
                  <p className="text-muted-foreground">شنبه تا پنج‌شنبه: {brandConfig.workingHours.weekdays}</p>
                  <p className="text-muted-foreground">جمعه: {brandConfig.workingHours.weekends}</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <Link to="/products" className="flex items-center justify-center gap-2 w-full btn-primary py-4 rounded-xl text-center text-lg font-bold">
                <ShoppingBag size={20} />
                شروع سفارش از محصولات
              </Link>
              <a href={brandConfig.instagramUrl} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 w-full py-4 bg-card border border-border rounded-xl hover:bg-secondary transition-colors">
                <Instagram size={20} />اینستاگرام
              </a>
              <div className="p-6 bg-accent/10 rounded-xl border border-accent/20">
                <h3 className="font-semibold mb-2">سفارش عمده / همکاری</h3>
                <p className="text-sm text-muted-foreground mb-4 leading-7">
                  برای سفارش‌های تعداد بالا، همکاری با کافه‌ها یا سفارش سازمانی، از تماس تلفنی یا ایمیل استفاده کنید تا جزئیات زمان آماده‌سازی و قیمت نهایی مشخص شود.
                </p>
                <a href={`mailto:${brandConfig.email}`} className="text-primary font-medium hover:underline">ارسال ایمیل همکاری</a>
              </div>
              <div className="p-6 bg-secondary/70 rounded-xl border border-border text-sm text-muted-foreground leading-7">
                مسیر خرید اصلی سایت از این به بعد از سبد خرید و تکمیل سفارش انجام می‌شود؛ واتساپ دیگر مسیر ثبت سفارش محصول نیست.
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
export default ContactPage;
