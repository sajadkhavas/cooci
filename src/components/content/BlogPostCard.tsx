import { CalendarCheck2, ImageIcon } from "lucide-react";
import { Link } from "react-router";
import type { BackendPostSummary } from "@/lib/backend-contract";
import { formatPersianUtcDate } from "@/lib/format-persian-date";
import { getContentTopicPath } from "@/lib/seo/content-topics";

interface BlogPostCardProps {
  post: BackendPostSummary;
  headingLevel?: "h2" | "h3";
}

export const BlogPostCard = ({
  post,
  headingLevel = "h2",
}: BlogPostCardProps) => {
  const Heading = headingLevel;
  const topicPath = getContentTopicPath(post.category);
  const publishedDate = formatPersianUtcDate(post.publishedAt);
  const articlePath = `/blog/${encodeURIComponent(post.slug)}`;

  return (
    <article className="group flex min-w-0 flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-card transition hover:-translate-y-1 hover:shadow-hover">
      <Link
        to={articlePath}
        aria-label={`مطالعه ${post.title}`}
        className="relative block aspect-[16/10] overflow-hidden bg-secondary"
      >
        {post.coverUrl ? (
          <img
            src={post.coverUrl}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-muted-foreground">
            <ImageIcon size={42} aria-hidden="true" />
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col space-y-3 p-6">
        {topicPath && post.category && (
          <Link
            to={topicPath}
            className="w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary transition hover:bg-primary/20"
          >
            {post.category}
          </Link>
        )}
        <Heading className="line-clamp-2 text-lg font-bold text-foreground">
          <Link to={articlePath} className="transition group-hover:text-primary">
            {post.title}
          </Link>
        </Heading>
        {post.excerpt && (
          <p className="line-clamp-3 text-sm leading-7 text-muted-foreground">
            {post.excerpt}
          </p>
        )}
        <div className="mt-auto flex items-center gap-2 border-t border-border pt-4 text-xs text-muted-foreground">
          <CalendarCheck2 size={14} aria-hidden="true" />
          {publishedDate ? (
            <time dateTime={post.publishedAt || undefined}>{publishedDate}</time>
          ) : (
            <span>تاریخ انتشار ثبت نشده</span>
          )}
        </div>
      </div>
    </article>
  );
};
