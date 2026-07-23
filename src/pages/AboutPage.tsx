import { ManagedContentPage } from "@/components/content/ManagedContentPage";
import { brandConfig } from "@/config/brand";
import { createAboutPageSchema } from "@/lib/seo/local-seo";

const configuredOrigin =
  (import.meta.env.VITE_SITE_ORIGIN as string | undefined) || brandConfig.website;
const SITE_ORIGIN = (() => {
  try {
    return new URL(configuredOrigin).origin;
  } catch {
    return new URL(brandConfig.website).origin;
  }
})();

const AboutPage = () => (
  <ManagedContentPage
    slug="about"
    fallbackTitle="درباره وینیمی"
    fallbackDescription="داستان، رویکرد و اطلاعات منتشرشده وینیمی."
    canonicalPath="/about"
    schema={createAboutPageSchema(SITE_ORIGIN)}
  />
);

export default AboutPage;
