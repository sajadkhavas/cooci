import {
  Clock,
  Instagram,
  Mail,
  MapPin,
  Phone,
  ShoppingBag,
} from "lucide-react";
import { Link } from "react-router";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { SEO } from "@/components/SEO";
import { brandConfig } from "@/config/brand";
import { usePublicShellContent } from "@/hooks/usePublicShellContent";
import { useStorefrontSettings } from "@/hooks/useStorefrontSettings";
import { createContactPageSchema } from "@/lib/seo/local-seo";

const configuredOrigin =
  (import.meta.env.VITE_SITE_ORIGIN as string | undefined) ||
  brandConfig.website;
const SITE_ORIGIN = (() => {
  try {
    return new URL(configuredOrigin).origin;
  } catch {
    return new URL(brandConfig.website).origin;
  }
})();

const ContactPage = () => {
  const { settings } = useStorefrontSettings();
  const shell = usePublicShellContent().contact;

  return (
    <>
      <SEO
        title={shell.metaTitle}
        description={shell.metaDescription}
        url="/contact"
        schema={createContactPageSchema(SITE_ORIGIN)}
      />

      <section className="bg-secondary/50 py-10 sm:py-12">
        <div className="container-custom text-center">
          <h1 className="heading-1 text-foreground">{shell.heading}</h1>
          <p className="body-large mx-auto mt-4 max-w-2xl text-muted-foreground">
            {shell.intro}
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="grid min-w-0 gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="min-w-0 space-y-4">
              <article className="flex min-w-0 items-start gap-4 rounded-2xl border border-border bg-card p-4 shadow-soft">
                <Phone
                  className="shrink-0 text-primary"
                  size={24}
                  aria-hidden="true"
                />
                <div className="min-w-0">
                  <h2 className="font-semibold">{shell.phoneTitle}</h2>
                  <a
                    href={settings.contact.phoneUrl}
                    className="touch-target inline-flex items-center font-medium text-primary hover:underline"
                    dir="ltr"
                  >
                    {settings.contact.phone}
                  </a>
                </div>
              </article>
              <article className="flex min-w-0 items-start gap-4 rounded-2xl border border-border bg-card p-4 shadow-soft">
                <Mail
                  className="shrink-0 text-primary"
                  size={24}
                  aria-hidden="true"
                />
                <div className="min-w-0">
                  <h2 className="font-semibold">{shell.emailTitle}</h2>
                  <a
                    href={`mailto:${settings.contact.email}`}
                    className="touch-target inline-flex items-center font-medium text-primary hover:underline"
                    dir="ltr"
                  >
                    {settings.contact.email}
                  </a>
                </div>
              </article>
              <article className="flex min-w-0 items-start gap-4 rounded-2xl border border-border bg-card p-4 shadow-soft">
                <MapPin
                  className="shrink-0 text-primary"
                  size={24}
                  aria-hidden="true"
                />
                <div className="min-w-0">
                  <h2 className="font-semibold">{shell.locationTitle}</h2>
                  <p className="mt-1 leading-7 text-muted-foreground">
                    {settings.contact.address}
                  </p>
                  <a
                    href={settings.contact.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="touch-target mt-1 inline-flex items-center text-sm font-medium text-primary hover:underline"
                  >
                    {shell.mapLabel}
                  </a>
                </div>
              </article>
              <article className="flex min-w-0 items-start gap-4 rounded-2xl border border-border bg-card p-4 shadow-soft">
                <Clock
                  className="shrink-0 text-primary"
                  size={24}
                  aria-hidden="true"
                />
                <div className="min-w-0">
                  <h2 className="font-semibold">{shell.hoursTitle}</h2>
                  <p className="mt-1 leading-7 text-muted-foreground">
                    شنبه تا پنج‌شنبه: {settings.contact.workingHours.weekdays}
                  </p>
                  <p className="leading-7 text-muted-foreground">
                    جمعه: {settings.contact.workingHours.weekends}
                  </p>
                  <p className="mt-2 text-xs leading-6 text-muted-foreground">
                    {shell.hoursNote}
                  </p>
                </div>
              </article>
              <Link
                to="/locations"
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-border bg-card px-5 py-4 text-center font-bold hover:bg-secondary"
              >
                <MapPin size={20} aria-hidden="true" />
                {shell.locationsCtaLabel}
              </Link>
              <Link
                to="/products"
                className="btn-primary flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-5 py-4 text-center font-bold"
              >
                <ShoppingBag size={20} aria-hidden="true" />
                {shell.shopCtaLabel}
              </Link>
              <a
                href={settings.contact.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-border bg-card px-5 py-4 font-bold hover:bg-secondary"
              >
                <Instagram size={20} aria-hidden="true" />
                {shell.instagramLabel}
              </a>
            </div>

            <InquiryForm
              type="contact"
              title={shell.inquiryTitle}
              description={shell.inquiryDescription}
              subjectLabel={shell.inquirySubjectLabel}
              messageLabel={shell.inquiryMessageLabel}
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactPage;
