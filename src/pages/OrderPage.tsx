import { useState } from "react";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { products } from "@/data/products";
import { brandConfig, generateWhatsAppUrl } from "@/config/brand";

const OrderPage = () => {
  const [form, setForm] = useState({ name: "", phone: "", product: "", quantity: "1", date: "", notes: "" });
  const generateOrderMessage = () => {
    return `سفارش جدید:\nنام: ${form.name}\nتلفن: ${form.phone}\nمحصول: ${form.product}\nتعداد: ${form.quantity}\nتاریخ تحویل: ${form.date}\nتوضیحات: ${form.notes}`;
  };

  return (
    <>
      <SEO title="راهنمای سفارش" description="راهنمای ثبت سفارش کوکی - مراحل سفارش، زمان آماده‌سازی و نحوه ارسال" />
      <section className="bg-secondary/50 py-12">
        <div className="container-custom text-center">
          <h1 className="heading-1 text-foreground">راهنمای سفارش</h1>
        </div>
      </section>
      <section className="section-padding">
        <div className="container-custom max-w-4xl">
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              { num: "۱", title: "انتخاب محصول", desc: "محصولات را ببینید و انتخاب کنید" },
              { num: "۲", title: "ارسال سفارش", desc: "از طریق واتساپ سفارش دهید" },
              { num: "۳", title: "تحویل", desc: `${brandConfig.preparationTime} بعد تحویل بگیرید` },
            ].map((step, i) => (
              <div key={i} className="text-center p-6 bg-card rounded-xl">
                <div className="w-12 h-12 mx-auto bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mb-3">{step.num}</div>
                <h3 className="font-semibold">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-card p-8 rounded-xl shadow-card">
            <h2 className="heading-3 mb-6">فرم سفارش سریع</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <input placeholder="نام شما" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" />
              <input placeholder="شماره تماس" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-field" />
              <select value={form.product} onChange={(e) => setForm({ ...form, product: e.target.value })} className="input-field">
                <option value="">انتخاب محصول</option>
                {products.map((p) => <option key={p.id} value={p.name}>{p.name} ({p.productCode})</option>)}
              </select>
              <input type="number" placeholder="تعداد" min="1" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} className="input-field" />
              <input type="text" placeholder="تاریخ تحویل (مثلاً ۱۵ آذر)" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="input-field" />
              <textarea placeholder="توضیحات" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="input-field md:col-span-2" rows={3} />
            </div>
            <a href={generateWhatsAppUrl(generateOrderMessage())} target="_blank" className="mt-6 block w-full btn-whatsapp py-4 rounded-lg text-center text-lg font-medium">ارسال سفارش به واتساپ</a>
          </div>
        </div>
      </section>
    </>
  );
};
export default OrderPage;
