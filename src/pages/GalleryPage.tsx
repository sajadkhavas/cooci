import { SEO } from "@/components/SEO";
import heroMain from "@/assets/cookies/hero-main.jpg";
import heroAssorted from "@/assets/cookies/hero-assorted.jpg";
import heroBreaking from "@/assets/cookies/hero-breaking.jpg";
import heroTopdown from "@/assets/cookies/hero-topdown.jpg";
import galleryBakery from "@/assets/cookies/gallery-bakery-interior.jpg";
import galleryGiftBoxes from "@/assets/cookies/gallery-gift-boxes.jpg";
import galleryBaking from "@/assets/cookies/gallery-baking-process.jpg";
import lifestyleBreaking from "@/assets/cookies/lifestyle-breaking.jpg";
import lifestyleMilk from "@/assets/cookies/lifestyle-milk.jpg";
import lifestyleTwine from "@/assets/cookies/lifestyle-twine.jpg";
import productChocolateChip from "@/assets/cookies/product-chocolate-chip.jpg";
import productDoubleChocolate from "@/assets/cookies/product-double-chocolate.jpg";

const galleryImages = [
  { url: heroMain, alt: "کوکی‌های شکلاتی تازه", span: true },
  { url: lifestyleBreaking, alt: "شکستن کوکی گرم" },
  { url: galleryBakery, alt: "فضای داخلی نانوایی" },
  { url: heroAssorted, alt: "انواع کوکی تازه‌پخت", span: true },
  { url: lifestyleMilk, alt: "کوکی و شیر" },
  { url: galleryGiftBoxes, alt: "بسته‌بندی هدیه کوکی" },
  { url: heroBreaking, alt: "کوکی با شکلات آب شده" },
  { url: galleryBaking, alt: "فرآیند پخت کوکی", span: true },
  { url: productChocolateChip, alt: "کوکی شکلات چیپ" },
  { url: lifestyleTwine, alt: "کوکی‌های بسته‌بندی شده" },
  { url: heroTopdown, alt: "کوکی‌ها روی سینی پخت" },
  { url: productDoubleChocolate, alt: "کوکی دبل شکلات" },
];

const GalleryPage = () => {
  return (
    <>
      <SEO
        title="گالری"
        description="گالری تصاویر شیرینی‌فروشی کوکی - مشاهده کوکی‌های خوشمزه و بسته‌بندی‌های زیبای ما"
      />

      {/* Header */}
      <section className="bg-secondary/50 py-12">
        <div className="container-custom text-center">
          <h1 className="heading-1 text-foreground">گالری تصاویر</h1>
          <p className="body-large text-muted-foreground mt-4">
            نگاهی به کوکی‌های دست‌ساز و بسته‌بندی‌های ما
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {galleryImages.map((image, index) => (
              <div
                key={index}
                className={`relative overflow-hidden rounded-2xl card-hover group ${
                  image.span ? "md:col-span-2 md:row-span-2" : ""
                }`}
              >
                <div className={`${image.span ? "aspect-square" : "aspect-square"} overflow-hidden`}>
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-white text-sm font-medium">{image.alt}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default GalleryPage;
