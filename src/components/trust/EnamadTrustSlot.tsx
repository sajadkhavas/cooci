import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ShieldCheck } from "lucide-react";
import { isBackendEnabled } from "@/lib/api";
import { loadStoreSettings } from "@/lib/content";

const extractOfficialBadge = (code: string | null) => {
  if (!code) return null;
  const matches = code.match(/https:\/\/trustseal\.enamad\.ir\/[^\"'\s<>]+/g) ?? [];
  const urls = matches.map((value) => value.replaceAll("&amp;", "&"));
  const imageUrl = urls.find((value) => value.includes("logo.aspx"));
  const verificationUrl = urls.find((value) => !value.includes("logo.aspx"));
  if (!imageUrl || !verificationUrl) return null;

  try {
    const image = new URL(imageUrl);
    const verification = new URL(verificationUrl);
    const official = (url: URL) =>
      url.protocol === "https:" && url.hostname === "trustseal.enamad.ir";
    if (!official(image) || !official(verification)) return null;
    return { image: image.toString(), verification: verification.toString() };
  } catch {
    return null;
  }
};

export const EnamadTrustSlot = () => {
  const query = useQuery({
    queryKey: ["store", "settings", "trust"],
    queryFn: loadStoreSettings,
    enabled: isBackendEnabled,
    staleTime: 10 * 60_000,
  });
  const badge = useMemo(
    () => extractOfficialBadge(query.data?.trust.enamad.badgeCode || null),
    [query.data?.trust.enamad.badgeCode],
  );

  if (query.data?.trust.enamad.enabled && badge) {
    return (
      <a
        href={badge.verification}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className="inline-flex min-h-24 min-w-24 items-center justify-center rounded-2xl border border-white/12 bg-white/8 p-3"
        aria-label="اعتبارسنجی نماد اعتماد الکترونیکی وینیمی در پنجره جدید"
      >
        <img
          src={badge.image}
          alt="نماد اعتماد الکترونیکی وینیمی"
          className="h-20 w-auto object-contain"
          loading="lazy"
          referrerPolicy="origin"
        />
      </a>
    );
  }

  return (
    <div className="inline-flex min-h-24 max-w-xs items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.055] p-4 text-xs leading-6 text-primary-foreground/55">
      <ShieldCheck className="shrink-0 text-accent" size={24} aria-hidden="true" />
      <span>جایگاه نماد اعتماد آماده است و فقط پس از فعال‌سازی رسمی سرور نمایش داده می‌شود.</span>
    </div>
  );
};
