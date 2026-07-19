import { Fragment, type ReactNode } from "react";
import { Calendar, Clock, MessageCircle, User } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SEO } from "@/components/SEO";
import {
  brandConfig,
  generateWhatsAppUrl,
  SUPPORT_WHATSAPP_MESSAGE,
} from "@/config/brand";
import { blogPosts, getBlogPostBySlug } from "@/data/blogPosts";
import NotFoundPage from "@/pages/NotFoundPage";

const renderInlineText = (text: string): ReactNode[] =>
  text.split(/(\*\*.+?\*\*)/g).map((part, index) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={`${part}-${index}`}>{part.slice(2, -2)}</strong>
    ) : (
      <Fragment key={`${part}-${index}`}>{part}</Fragment>
    ),
  );

const renderContent = (content: string) => {
  const lines = content
    .trim()
    .split("\n")
    .map((line) => line.trim());
  const blocks: ReactNode[] = [];

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (!line) continue;

    if (line.startsWith("### ")) {
      blocks.push(
        <h3 key={`h3-${index}`} className="mb-3 mt-8 text-xl font-bold text-foreground">
          {line.slice(4)}
        </h3>,
      );
      continue;
    }

    if (line.startsWith("## ")) {
      blocks.push(
        <h2 key={`h2-${index}`} className="mb-4 mt-10 text-2xl font-bold text-foreground">
          {line.slice(3)}
        </h2>,
      );
      continue;
    }

    if (/^\d+\.\s/.test(line)) {
      const items: string[] = [];
      while (index < lines.length && /^\d+\.\s/.test(lines[index])) {
        items.push(lines[index].replace(/^\d+\.\s/, ""));
        index += 1;
      }
      index -= 1;
      blocks.push(
        <ol key={`ol-${index}`} className="my-5 list-decimal space-y-2 pr-6 text-foreground/80">
          {items.map((item) => (
            <li key={item} className="leading-9">
              {renderInlineText(item)}
            </li>
          ))}
        </ol>,
      );
      continue;
    }

    if (line.startsWith("- ")) {
      const items: string[] = [];
      while (index < lines.length && lines[index].startsWith("- ")) {
        items.push(lines[index].slice(2));
        index += 1;
      }
      index -= 1;
      blocks.push(
        <ul key={`ul-${index}`} className="my-5 list-disc space-y-2 pr-6 text-foreground/80">
          {items.map((item) => (
            <li key={item} className="leading-9">
              {renderInlineText(item)}
            </li>
          ))}
        </ul>,
      );
      continue;
    }

    blocks.push(
      <p key={`p-${index}`} className="mb-4 leading-9 text-foreground/80">
        {renderInlineText(line)}
      </p>,
    );
  }

  return blocks;
};

const BlogDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getBlogPostBySlug(slug) : undefined;

  if (!post) return <NotFoundPage />;

  const related = blogPosts
    .filter(
      (candidate) =>
        candidate.id !== post.id &&
        (candidate.categorySlug === post.categorySlug ||
          candidate.tags.some((tag) => post.tags.includes(tag))),
    )
    .slice(0, 3);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.image.url,
    datePublished: post.publishDate,
    author: { "@type": "Organization", name: brandConfig.brandName },
    publisher: {
      "@type": "Organization",
      name: brandConfig.brandName,
      url: brandConfig.website,
    },
    mainEntityOfPage: `${brandConfig.website}/blog/${post.slug}`,
  };

  return (
    <>
      <SEO
        title={post.title}
        description={post.excerpt}
        type="article"
        schema={schema}
        image={post.image.url}
        publishedTime={post.publishDate}
        author={post.author}
      />

      <article className="section-padding">
        <div className="container-custom max-w-3xl">
          <Breadcrumbs
            className="mb-8"
            items={[
              { name: "خانه", href: "/" },
              { name: "بلاگ", href: "/blog" },
              { name: post.title },
            ]}
          />

          <span className="mb-4 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
            {post.category}
          </span>
          <h1 className="mb-6 text-3xl font-black leading-tight text-foreground md:text-4xl">
            {post.title}
          </h1>
          <div className="mb-8 flex flex-wrap items-center gap-4 border-b border-border pb-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <User size={14} aria-hidden="true" /> {post.author}
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={14} aria-hidden="true" /> {post.publishDate}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={14} aria-hidden="true" /> {post.readTime}
            </span>
          </div>

          <figure className="mb-10 overflow-hidden rounded-3xl border border-border bg-muted shadow-soft">
            <img
              src={post.image.url}
              alt={post.image.alt}
              className="aspect-[16/9] h-full w-full object-cover"
              loading="eager"
              decoding="async"
              width={1200}
              height={675}
            />
          </figure>

          <div>{renderContent(post.content)}</div>

          <div className="mt-12 rounded-3xl bg-primary/10 p-8 text-center">
            <h2 className="mb-3 text-xl font-bold text-foreground">
              محصولات مرتبط با این راهنما را ببینید
            </h2>
            <p className="mb-6 leading-8 text-muted-foreground">
              قیمت، موجودی، مواد اولیه و شرایط ارسال هر محصول در کاتالوگ مشخص است.
            </p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Link to="/products" className="btn-primary rounded-xl px-6 py-3 font-bold">
                مشاهده محصولات
              </Link>
              <a
                href={generateWhatsAppUrl(SUPPORT_WHATSAPP_MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-whatsapp px-6 py-3 font-bold text-white"
              >
                <MessageCircle size={18} aria-hidden="true" />
                سؤال از پشتیبانی
              </a>
            </div>
          </div>

          {related.length > 0 && (
            <section className="mt-16" aria-labelledby="related-articles-title">
              <h2 id="related-articles-title" className="mb-6 text-xl font-bold text-foreground">
                مقالات مرتبط
              </h2>
              <div className="grid gap-4 sm:grid-cols-3">
                {related.map((article) => (
                  <Link
                    key={article.id}
                    to={`/blog/${article.slug}`}
                    className="overflow-hidden rounded-2xl border border-border bg-card transition hover:-translate-y-0.5 hover:shadow-hover"
                  >
                    <img
                      src={article.image.url}
                      alt={article.image.alt}
                      className="aspect-[16/9] w-full object-cover"
                      loading="lazy"
                      width={480}
                      height={270}
                    />
                    <div className="p-4">
                      <p className="line-clamp-2 text-sm font-bold text-foreground">
                        {article.title}
                      </p>
                      <p className="mt-2 text-xs text-muted-foreground">{article.readTime}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </article>
    </>
  );
};

export default BlogDetailPage;
