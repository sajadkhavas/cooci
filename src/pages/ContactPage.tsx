import { useState } from "react";
import { Link } from "react-router-dom";
import { Phone, MapPin, Clock, Instagram } from "lucide-react";
import { SEO } from "@/components/SEO";
import { brandConfig, generateWhatsAppUrl, generatePhoneUrl } from "@/config/brand";

const ContactPage = () => {
  return (
    <>
      <SEO title="تماس با ما" description="راه‌های ارتباط با شیرینی‌فروشی کوکی - تلفن، واتساپ، آدرس و ساعات کاری" />
      <section className="bg-secondary/50 py-12">
        <div className="container-custom text-center">
          <h1 className="heading-1 text-foreground">تماس با ما</h1>
        </div>
      </section>
      <section className="section-padding">
        <div className="container-custom max-w-4xl">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-4 bg-card rounded-xl">
                <Phone className="text-primary" size={24} />
                <div>
                  <h3 className="font-semibold">تلفن</h3>
                  <a href={generatePhoneUrl()} className="text-primary hover:underline">{brandConfig.phone}</a>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-card rounded-xl">
                <MapPin className="text-primary" size={24} />
                <div>
                  <h3 className="font-semibold">آدرس</h3>
                  <p className="text-muted-foreground">{brandConfig.address}</p>
                  <a href={brandConfig.mapUrl} target="_blank" className="text-primary text-sm hover:underline">مشاهده در نقشه</a>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-card rounded-xl">
                <Clock className="text-primary" size={24} />
                <div>
                  <h3 className="font-semibold">ساعات کاری</h3>
                  <p className="text-muted-foreground">شنبه تا پنج‌شنبه: {brandConfig.workingHours.weekdays}</p>
                  <p className="text-muted-foreground">جمعه: {brandConfig.workingHours.weekends}</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <a href={generateWhatsAppUrl("سلام")} target="_blank" className="block w-full btn-whatsapp py-4 rounded-xl text-center text-lg font-medium">پشتیبانی واتساپ</a>
              <a href={brandConfig.instagramUrl} target="_blank" className="flex items-center justify-center gap-2 w-full py-4 bg-card border border-border rounded-xl hover:bg-secondary transition-colors">
                <Instagram size={20} />اینستاگرام
              </a>
              <div className="p-6 bg-accent/10 rounded-xl">
                <h3 className="font-semibold mb-2">سفارش عمده / همکاری</h3>
                <p className="text-sm text-muted-foreground mb-4">برای سفارش‌های بالای ۵۰ عدد یا همکاری تماس بگیرید.</p>
                <a href={generateWhatsAppUrl("سلام، درخواست سفارش عمده دارم.")} target="_blank" className="text-primary font-medium hover:underline">ارسال پیام واتساپ</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
export default ContactPage;
