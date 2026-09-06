import { brandConfig } from "@/config/brand";
import type { BackendStoreSettings } from "@/lib/backend-contract";

export interface StorefrontSettings {
  brand: {
    name: string;
    nameEn: string;
    tagline: string;
  };
  contact: {
    phone: string;
    phoneUrl: string;
    email: string;
    address: string;
    city: string;
    region: string;
    whatsappNumber: string;
    whatsappUrl: string;
    telegramUrl: string;
    telegramEnabled: boolean;
    instagramUrl: string;
    instagramHandle: string;
    mapUrl: string;
    workingHours: {
      weekdays: string;
      weekends: string;
    };
  };
}

const readText = (
  value: Record<string, unknown>,
  path: readonly string[],
): string | undefined => {
  let current: unknown = value;

  for (const segment of path) {
    if (
      typeof current !== "object" ||
      current === null ||
      Array.isArray(current)
    ) {
      return undefined;
    }

    current = (current as Record<string, unknown>)[segment];
  }

  if (typeof current !== "string") return undefined;

  const normalized = current.trim();
  return normalized || undefined;
};

const readBoolean = (
  value: Record<string, unknown>,
  path: readonly string[],
): boolean => {
  let current: unknown = value;

  for (const segment of path) {
    if (
      typeof current !== "object" ||
      current === null ||
      Array.isArray(current)
    ) {
      return false;
    }

    current = (current as Record<string, unknown>)[segment];
  }

  if (typeof current === "boolean") return current;
  if (typeof current === "number") return current === 1;
  if (typeof current !== "string") return false;

  return ["1", "true", "yes", "on"].includes(current.trim().toLowerCase());
};

const digitsOnly = (value: string) => value.replace(/\D/g, "");

const createIranPhoneUrl = (phone: string) => {
  const digits = digitsOnly(phone);

  if (digits.startsWith("98")) return `tel:+${digits}`;
  if (digits.startsWith("0")) return `tel:+98${digits.slice(1)}`;

  return digits ? `tel:+98${digits}` : "";
};

const createWhatsAppUrl = (number: string, brandName: string) => {
  const digits = digitsOnly(number);
  const normalizedNumber = digits.startsWith("0")
    ? `98${digits.slice(1)}`
    : digits;
  const message = `سلام، از سایت ${brandName} با شما تماس گرفتم. یک سؤال درباره محصولات یا سفارش دارم.`;

  return normalizedNumber
    ? `https://wa.me/${normalizedNumber}?text=${encodeURIComponent(message)}`
    : "";
};

export const resolveStorefrontSettings = (
  payload?: BackendStoreSettings,
): StorefrontSettings => {
  const settings = payload?.settings ?? {};
  const brandName =
    readText(settings, ["brand", "name"]) || brandConfig.brandName;
  const phone = readText(settings, ["contact", "phone"]) || brandConfig.phone;
  const whatsappNumber =
    readText(settings, ["contact", "whatsapp"]) || brandConfig.whatsappNumber;
  const telegramUrl = readText(settings, ["contact", "telegram_url"]) || "";
  const telegramEnabled =
    readBoolean(settings, ["contact", "telegram_enabled"]) &&
    Boolean(telegramUrl);

  return {
    brand: {
      name: brandName,
      nameEn:
        readText(settings, ["brand", "name_en"]) || brandConfig.brandNameEn,
      tagline: readText(settings, ["brand", "tagline"]) || brandConfig.tagline,
    },
    contact: {
      phone,
      phoneUrl: createIranPhoneUrl(phone),
      email: readText(settings, ["contact", "email"]) || brandConfig.email,
      address:
        readText(settings, ["contact", "address"]) || brandConfig.address,
      city: readText(settings, ["contact", "city"]) || brandConfig.city,
      region: readText(settings, ["contact", "region"]) || brandConfig.region,
      whatsappNumber,
      whatsappUrl: createWhatsAppUrl(whatsappNumber, brandName),
      telegramUrl,
      telegramEnabled,
      instagramUrl:
        readText(settings, ["contact", "instagram_url"]) ||
        brandConfig.instagramUrl,
      instagramHandle:
        readText(settings, ["contact", "instagram_handle"]) ||
        brandConfig.instagramHandle,
      mapUrl: readText(settings, ["contact", "map_url"]) || brandConfig.mapUrl,
      workingHours: {
        weekdays:
          readText(settings, ["contact", "working_hours_weekdays"]) ||
          brandConfig.workingHours.weekdays,
        weekends:
          readText(settings, ["contact", "working_hours_weekends"]) ||
          brandConfig.workingHours.weekends,
      },
    },
  };
};
