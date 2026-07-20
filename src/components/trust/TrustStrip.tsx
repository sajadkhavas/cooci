import { LockKeyhole, ServerCog } from "lucide-react";
import { EnamadTrustSlot } from "@/components/trust/EnamadTrustSlot";

export const TrustStrip = () => (
  <section className="relative z-10 bg-primary text-primary-foreground" aria-label="وضعیت اعتماد و امنیت فروشگاه">
    <div className="container-custom grid gap-5 border-b border-white/10 py-7 md:grid-cols-[1fr_auto] md:items-center">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex items-start gap-3 text-sm leading-7 text-primary-foreground/70">
          <LockKeyhole className="mt-1 shrink-0 text-accent" size={19} aria-hidden="true" />
          <span>ورود، سفارش، مالکیت و پرداخت از نشست امن و پاسخ تأییدشده سرور استفاده می‌کنند.</span>
        </div>
        <div className="flex items-start gap-3 text-sm leading-7 text-primary-foreground/70">
          <ServerCog className="mt-1 shrink-0 text-accent" size={19} aria-hidden="true" />
          <span>وضعیت نماد اعتماد از تنظیمات عمومی بک‌اند خوانده می‌شود و هیچ کد اعتمادی در فرانت ذخیره نشده است.</span>
        </div>
      </div>
      <EnamadTrustSlot />
    </div>
  </section>
);
