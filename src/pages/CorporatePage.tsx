import {
  Briefcase,
  Building2,
  CheckCircle2,
  FileQuestion,
  MessageCircle,
  Package,
  Users,
} from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { SEO } from "@/components/SEO";
import { useStorefrontSettings } from "@/hooks/useStorefrontSettings";

const requestIcons = [Package, Users, FileQuestion, Building2] as const;

const CorporatePage = () => {
  const { settings, content } = useStorefrontSettings();
  const corporate = content.corporate;

  return (
    <>
      <SEO
        title={corporate.metaTitle}
        description={corporate.metaDescription}
      />

      <section className="bg-gradient-to-b from-primary/10 to-background section-padding">
        <div className="container-custom max-w-4xl">
          <Breadcrumbs
            className="mb-8"
            items={[{ name: "خانه", href: "/" }, { name: corporate.heroTitle }]}
          />
          <h1 className="heading-1 mb-6 text-foreground">
            {corporate.heroTitle}
          </h1>
          <p className="body-large mb-5 leading-9 text-muted-foreground">
            {corporate.heroDescription}
          </p>
          <div className="mb-6 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm leading-7 text-amber-950">
            {corporate.heroWarning}
          </div>
          <a
            href={settings.contact.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-whatsapp px-6 py-3 font-bold text-white"
          >
            <MessageCircle size={19} aria-hidden="true" />
            {corporate.supportLabel}
          </a>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {corporate.requests.map((item, index) => {
              const Icon = requestIcons[index] ?? Building2;
              return (
                <article
                  key={`${item.title}-${index}`}
                  className="rounded-3xl border border-border bg-card p-6"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                    <Icon className="text-primary" size={24} aria-hidden="true" />
                  </div>
                  <h2 className="mb-2 font-bold text-foreground">{item.title}</h2>
                  <p className="text-sm leading-7 text-muted-foreground">
                    {item.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-secondary/30 section-padding">
        <div className="container-custom max-w-3xl">
          <div className="mb-8 flex items-center justify-center gap-3">
            <Briefcase className="text-primary" size={26} aria-hidden="true" />
            <h2 className="heading-2 text-center text-foreground">
              {corporate.useCasesTitle}
            </h2>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {corporate.useCases.map((useCase) => (
              <li
                key={useCase}
                className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4"
              >
                <CheckCircle2 className="shrink-0 text-primary" size={20} aria-hidden="true" />
                <span>{useCase}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom max-w-4xl">
          <InquiryForm
            type="corporate"
            title={corporate.inquiry.title}
            description={corporate.inquiry.description}
            defaultSubject={corporate.inquiry.subject}
            messageLabel={corporate.inquiry.messageLabel}
            metadata={{ source: "corporate-page" }}
          />
        </div>
      </section>
    </>
  );
};

export default CorporatePage;
