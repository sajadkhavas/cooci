import { EnamadTrustSlot } from "@/components/trust/EnamadTrustSlot";

export const TrustStrip = () => (
  <section
    className="relative z-10 border-y border-[#d88972]/25 bg-[#f7e4dc] text-[#46271f]"
    aria-label="نماد اعتماد فروشگاه"
  >
    <div className="container-custom flex min-h-36 items-center justify-center py-6">
      <div className="flex min-h-24 min-w-28 items-center justify-center rounded-2xl border border-[#d88972]/20 bg-white/55 p-3 shadow-soft">
        <EnamadTrustSlot />
      </div>
    </div>
  </section>
);
