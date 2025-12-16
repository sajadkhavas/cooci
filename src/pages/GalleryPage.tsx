import { SEO } from "@/components/SEO";

const images = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  alt: `تصویر گالری ${i + 1}`,
}));

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
            {images.map((image, index) => (
              <div
                key={image.id}
                className={`relative overflow-hidden rounded-lg card-hover ${
                  index % 5 === 0 ? "md:col-span-2 md:row-span-2" : ""
                }`}
              >
                <div
                  className={`${
                    index % 5 === 0 ? "aspect-square" : "aspect-square"
                  } bg-gradient-to-br from-secondary to-muted flex items-center justify-center`}
                >
                  <span className={`${index % 5 === 0 ? "text-9xl" : "text-6xl"} opacity-50`}>
                    🍪
                  </span>
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
