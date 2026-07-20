import { Clock, Instagram, Mail, MapPin, Phone, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { SEO } from "@/components/SEO";
import { brandConfig, generatePhoneUrl } from "@/config/brand";

const ContactPage = () => (
  <>
    <SEO
      title="تماس با ما"
      description="راه‌های ارتباط با وینیمی و فرم امن ثبت درخواست پشتیبانی و همکاری."
    />

    <section className="bg-secondary/50 py-10 sm:py-12">
      <div className="container-custom text-center">
        <h1 className="heading-1 text-foreground">تماس با ما</h1>
        <p className="body-large mx-auto mt-4 max-w-2xl text-muted-foreground">
          برای پشتیبانی، همکاری یا پیگیری، درخواست خود را ثبت کنید تا در پنل فروشگاه قابل پیگیری باشد.
        </p>
      </div>
    </section>

    <section className="section-padding">
      <div className="container-custom">
        <div className="grid min-w-0 gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="min-w-0 space-y-4">
            <article className="flex min-w-0 items-start gap-4 rounded-2xl border border-border bg-card p-4 shadow-soft">
              <Phone className="shrink-0 text-primary" size={24} aria-hidden="true" />
              <div className="min-w-0">
                <h2 className="font-semibold">تلفن</h2>
                <a href={generatePhoneUrl()} className="touch-target inline-flex items-center font-medium text-primary hover:underline" dir="ltr">
                  {brandConfig.phone}
                </a>
              </div>
            </article>
            <article className="flex min-w-0 items-start gap-4 rounded-2xl border border-border bg-card p-4 shadow-soft">
              <Mail className="shrink-0 text-primary" size={24} aria-hidden="true" />
              <div className="min-w-0">
                <h2 className="font-semibold">ایمیل</h2>
                <a href={`mailto:${brandConfig.email}`} className="touch-target inline-flex items-center font-medium text-primary hover:underline" dir="ltr">
                  {brandConfig.email}
                </a>
              </div>
            </article>
            <article className="flex min-w-0 items-start gap-4 rounded-2xl border border-border bg-card p-4 shadow-soft">
              <MapPin className="shrink-0 text-primary" size={24} aria-hidden="true" />
              <div className="min-w-0">
                <h2 className="font-semibold">آدرس</h2>
                <p className="mt-1 leading-7 text-muted-foreground">{brandConfig.address}</p>
                <a href={brandConfig.mapUrl} target="_blank" rel="noopener noreferrer" className="touch-target mt-1 inline-flex items-center text-sm font-medium text-primary hover:underline">
                  مشاهده در نقشه
                </a>
              </div>
            </article>
            <article className="flex min-w-0 items-start gap-4 rounded-2xl border border-border bg-card p-4 shadow-soft">
              <Clock className="shrink-0 text-primary" size={24} aria-hidden="true" />
              <div className="min-w-0">
                <h2 className="font-semibold">ساعات پاسخ‌گویی</h2>
                <p className="mt-1 leading-7 text-muted-foreground">شنبه تا پنج‌شنبه: {brandConfig.workingHours.weekdays}</p>
                <p className="leading-7 text-muted-foreground">جمعه: {brandConfig.workingHours.weekends}</p>
              </div>
            </article>
            <Link to="/products" className="btn-primary flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-5 py-4 text-center font-bold">
              <ShoppingBag size={20} aria-hidden="true" />
              شروع سفارش از فروشگاه
            </Link>
            <a href={brandConfig.instagramUrl} target="_blank" rel="noopener noreferrer" className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-border bg-card px-5 py-4 font-bold hover:bg-secondary">
              <Instagram size={20} aria-hidden="true" />
              اینستاگرام
            </a>
          </div>

          <InquiryForm
            type="contact"
            title="ثبت درخواست تماس"
            description="پیام شما در بک‌اند ذخیره می‌شود و تیم فروشگاه می‌تواند آن را در پنل مدیریت بررسی و پیگیری کند."
            subjectLabel="موضوع درخواست"
            messageLabel="پیام شما"
          />
        </div>
      </div>
    </section>
  </>
);

export default ContactPage;
