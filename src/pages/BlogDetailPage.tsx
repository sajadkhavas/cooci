import { Link, Navigate, useParams } from "react-router-dom";
import { Calendar, Clock, MessageCircle, User } from "lucide-react";
import { SEO } from "@/components/SEO";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { blogPosts, getBlogPostBySlug } from "@/data/blogPosts";
import { brandConfig, generateWhatsAppUrl, SUPPORT_WHATSAPP_MESSAGE } from "@/config/brand";

const renderContent = (content: string) => {
  const lines = content.trim().split("\n");
  return lines.map((line, i) => {
    const t = line.trim();
    if (!t) return null;
    if (t.startsWith("### ")) return <h3 key={i} className="text-xl font-bold text-foreground mt-8 mb-3">{t.slice(4)}</h3>;
    if (t.startsWith("## ")) return <h2 key={i} className="text-2xl font-bold text-foreground mt-10 mb-4">{t.slice(3)}</h2>;
    if (/^\d+\.\s/.test(t)) return <li key={i} className="text-foreground/80 leading-9 mr-6 list-decimal">{t.replace(/^\d+\.\s/, "")}</li>;
    if (t.startsWith("- ")) return <li key={i} className="text-foreground/80 leading-9 mr-6 list-disc">{t.slice(2)}</li>;
    const withBold = t.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    return <p key={i} className="text-foreground/80 leading-9 mb-4" dangerouslySetInnerHTML={{ __html: withBold }} />;
  });
};

const BlogDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getBlogPostBySlug(slug) : undefined;
  if (!post) return <Navigate to="/blog" replace />;

  const related = blogPosts.filter((p) => p.id !== post.id).slice(0, 3);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishDate,
    author: { "@type": "Organization", name: brandConfig.brandName },
    publisher: { "@type": "Organization", name: brandConfig.brandName },
  };

  return (
    <>
      <SEO title={post.title} description={post.excerpt} type="article" schema={schema} />
      <article className="section-padding">
        <div className="container-custom max-w-3xl">
          <Breadcrumbs className="mb-8" items={[
            { name: "خانه", href: "/" },
            { name: "بلاگ", href: "/blog" },
            { name: post.title },
          ]} />

          <span className="inline-block bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full mb-4">
            {post.category}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight mb-6">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8 pb-6 border-b border-border">
            <span className="flex items-center gap-1"><User size={14} /> {post.author}</span>
            <span className="flex items-center gap-1"><Calendar size={14} /> {post.publishDate}</span>
            <span className="flex items-center gap-1"><Clock size={14} /> {post.readTime}</span>
          </div>

          <div className="prose prose-lg max-w-none">{renderContent(post.content)}</div>

          <div className="mt-12 bg-primary/10 rounded-3xl p-8 text-center">
            <h3 className="text-xl font-bold text-foreground mb-3">آماده سفارش هستید؟</h3>
            <p className="text-muted-foreground mb-6">با {brandConfig.brandName} تازه‌ترین کوکی‌ها و کیک‌ها را تجربه کنید.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/products" className="btn-primary px-6 py-3 rounded-xl font-bold">مشاهده محصولات</Link>
              <a
                href={generateWhatsAppUrl(SUPPORT_WHATSAPP_MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-whatsapp text-white px-6 py-3 rounded-xl font-bold inline-flex items-center justify-center gap-2"
              >
                <MessageCircle size={18} /> واتساپ
              </a>
            </div>
          </div>

          {related.length > 0 && (
            <div className="mt-16">
              <h3 className="text-xl font-bold text-foreground mb-6">مقالات مرتبط</h3>
              <div className="grid sm:grid-cols-3 gap-4">
                {related.map((r) => (
                  <Link key={r.id} to={`/blog/${r.slug}`} className="bg-card border border-border rounded-2xl p-4 hover:shadow-hover transition-all">
                    <p className="font-bold text-foreground text-sm mb-2 line-clamp-2">{r.title}</p>
                    <p className="text-xs text-muted-foreground">{r.readTime}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    </>
  );
};

export default BlogDetailPage;
