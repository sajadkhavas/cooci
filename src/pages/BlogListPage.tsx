import { Link } from "react-router-dom";
import { Calendar, Clock } from "lucide-react";
import { SEO } from "@/components/SEO";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { blogPosts } from "@/data/blogPosts";

const BlogListPage = () => (
  <>
    <SEO
      title="بلاگ وینیمی — نکات کوکی، کیک و شیرینی"
      description="راهنمای نگهداری کوکی، تفاوت کوکی نرم و ترد، ترکیب باکس هدیه و مقالات تخصصی وینیمی بیکری."
    />
    <section className="section-padding bg-gradient-to-b from-secondary/40 to-background">
      <div className="container-custom max-w-5xl">
        <Breadcrumbs className="mb-8" items={[{ name: "خانه", href: "/" }, { name: "بلاگ" }]} />
        <h1 className="heading-1 text-foreground mb-4">مجله وینیمی</h1>
        <p className="body-large text-muted-foreground max-w-2xl">
          مقالات تخصصی درباره نگهداری کوکی، انتخاب هدیه، تفاوت طعم‌ها و پشت صحنه پخت خانگی.
        </p>
      </div>
    </section>

    <section className="section-padding">
      <div className="container-custom">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Link
              key={post.id}
              to={`/blog/${post.slug}`}
              className="group bg-card border border-border rounded-3xl overflow-hidden shadow-card hover:shadow-hover transition-all"
            >
              <div className="aspect-[16/10] overflow-hidden bg-secondary">
                <img
                  src={post.image.url}
                  alt={post.image.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  onError={(e) => { (e.target as HTMLImageElement).style.opacity = "0.3"; }}
                />
              </div>
              <div className="p-6 space-y-3">
                <span className="inline-block bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full">
                  {post.category}
                </span>
                <h2 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h2>
                <p className="text-sm text-muted-foreground line-clamp-2 leading-7">{post.excerpt}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t border-border">
                  <span className="flex items-center gap-1"><Calendar size={13} /> {post.publishDate}</span>
                  <span className="flex items-center gap-1"><Clock size={13} /> {post.readTime}</span>
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
