import { BookOpenText } from "lucide-react";
import { Link } from "react-router";
import type { ContentTopicSummary } from "@/lib/seo/content-topics";

interface ContentTopicNavProps {
  topics: ContentTopicSummary[];
  activeTopic?: string;
  className?: string;
}

export const ContentTopicNav = ({
  topics,
  activeTopic,
  className = "",
}: ContentTopicNavProps) => {
  if (!topics.length) return null;

  return (
    <nav aria-label="موضوعات راهنما" className={className}>
      <div className="mb-4 flex items-center gap-2 text-sm font-bold text-foreground">
        <BookOpenText size={18} className="text-primary" aria-hidden="true" />
        موضوعات منتشرشده
      </div>
      <ul className="flex flex-wrap gap-3">
        {topics.map((topic) => {
          const isActive = activeTopic === topic.name;
          return (
            <li key={topic.path}>
              <Link
                to={topic.path}
                aria-current={isActive ? "page" : undefined}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold transition ${
                  isActive
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground hover:border-primary/50 hover:text-primary"
                }`}
              >
                <span>{topic.name}</span>
                <span className={isActive ? "text-primary-foreground/80" : "text-muted-foreground"}>
                  {topic.postCount}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
