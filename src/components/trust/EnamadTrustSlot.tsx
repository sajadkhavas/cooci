import { useMemo } from "react";
import { ShieldCheck } from "lucide-react";
import { useStorefrontSettings } from "@/hooks/useStorefrontSettings";
import { extractOfficialEnamadBadge } from "@/lib/security/enamad";

export const EnamadTrustSlot = () => {
  const { query } = useStorefrontSettings();
  const badge = useMemo(
    () =>
      extractOfficialEnamadBadge(query.data?.trust.enamad.badgeCode || null),
    [query.data?.trust.enamad.badgeCode],
  );

  if (query.data?.trust.enamad.enabled && badge) {
    return (
      <a
        href={badge.verification}
        target="_blank"
        rel="noopener noreferrer"
        referrerPolicy="origin"
        className="inline-flex min-h-24 min-w-24 items-center justify-center rounded-2xl border border-[#d88972]/30 bg-white/70 p-3"
        aria-label="نماد اعتماد الکترونیکی وینیمی"
      >
        <img
          src={badge.image}
          alt="نماد اعتماد الکترونیکی وینیمی"
          className="h-auto max-h-20 w-auto max-w-20 object-contain"
          loading="lazy"
          referrerPolicy="origin"
        />
      </a>
    );
  }

  return (
    <div className="inline-flex min-h-24 max-w-xs items-center gap-3 rounded-2xl border border-[#d88972]/25 bg-white/65 p-4 text-xs leading-6 text-[#6f3e33]">
      <ShieldCheck
        className="shrink-0 text-[#9b5545]"
        size={24}
        aria-hidden="true"
      />
      <span>
        اطلاعات مجوزهای فروشگاه پس از فعال‌سازی رسمی در همین جایگاه نمایش داده
        می‌شود.
      </span>
    </div>
  );
};
