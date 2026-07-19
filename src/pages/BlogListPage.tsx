import { CalendarCheck2, Clock, ImageIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SEO } from "@/components/SEO";
import { blogPosts } from "@/data/blogPosts";

const BlogListPage = () => (
  <>
    <SEO
      title="راهنماهای وینیمی"
      description="راهنماهای بازبینی‌شده درباره نگهداری، انتخاب بافت و سفارش هدیه؛ بدون ادعای جایگزین اطلاعات همان محصول."
    />

    <section className="section-padding bg-gradient-to-b from-secondary/40 to-background">
      <div className="container-custom max-w-5xl">
        <Breadcrumbs
          className="mb-8"
          items={[{ name: "خانه", href: "/" }, { name: "راهنماها" }]}
        />
        <h1 className="heading-1 mb-4 text-foreground">راهنماهای وینیمی</h1>
        <p className="body-large max-w-2xl text-muted-foreground">
          مطالب عمومی برای انتخاب و نگهداری آگاهانه‌تر. دستور صفحه محصول، برچسب بسته‌بندی و تأیید پشتیبانی همیشه اولویت دارند.
        </p>
      </div>
    </section>

    <section className="section-padding">
      <div className="container-custom">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <Link
              key={post.id}
              to={`/blog/${post.slug}`}
              className="group flex min-w-0 flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-card transition hover:-translate-y-1 hover:shadow-hover"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-secondary">
                {post.image.url ? (
                  <img
                    src={post.image.url}
                    alt={post.image.alt}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    width={720}
                    height={450}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                    <ImageIcon size={42} aria-hidden="true" />
                  </div>
                )}
                {post.image.isRepresentative && (
                  <span className="absolute bottom-3 right-3 rounded-full bg-black/70 px-3 py-1 text-[11px] font-bold text-white">
                    تصویر نمایشی
                  </span>
                )}
              </div>

              <div className="flex flex-1 flex-col space-y-3 p-6">
                <span className="w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                  {post.category}
                </span>
                <h2 className="line-clamp-2 text-lg font-bold text-foreground transition-colors group-hover:text-primary">
                  {post.title}
                </h2>
                <p className="line-clamp-3 text-sm leading-7 text-muted-foreground">
                  {post.excerpt}
                </p>
                <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border pt-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <CalendarCheck2 size={14} aria-hidden="true" />
                    {post.reviewedLabel}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={14} aria-hidden="true" />
                    {post.readTime}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  </>
);

export default BlogListPage;
