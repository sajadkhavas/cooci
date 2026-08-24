import { BadgeCheck, CreditCard } from "lucide-react";
import { EnamadTrustSlot } from "@/components/trust/EnamadTrustSlot";

export const TrustStrip = () => (
  <section
    className="relative z-10 border-y border-[#d88972]/25 bg-[#f7e4dc] text-[#46271f]"
    aria-label="اعتماد و خرید مطمئن"
  >
    <div className="container-custom grid gap-5 py-7 md:grid-cols-[1fr_auto] md:items-center">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex items-start gap-3 text-sm leading-7 text-[#6f3e33]">
          <CreditCard className="mt-1 shrink-0 text-[#9b5545]" size={19} aria-hidden="true" />
          <span>پرداخت سفارش از مسیر رسمی درگاه بانکی انجام می‌شود.</span>
        </div>
        <div className="flex items-start gap-3 text-sm leading-7 text-[#6f3e33]">
          <BadgeCheck className="mt-1 shrink-0 text-[#9b5545]" size={19} aria-hidden="true" />
          <span>جزئیات و وضعیت سفارش از حساب کاربری قابل پیگیری است.</span>
        </div>
      </div>
      <EnamadTrustSlot />
    </div>
  </section>
);
