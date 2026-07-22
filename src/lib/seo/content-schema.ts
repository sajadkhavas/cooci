import type {
  BackendPostDetail,
  BackendPostSummary,
} from "@/lib/backend-contract";
import { brandConfig } from "@/config/brand";
import {
  resolveCanonicalUrl,
  resolvePublicMediaUrl,
} from "@/lib/security/seo";
import type { ContentTopicSummary } from "@/lib/seo/content-topics";
import { getContentTopicPath } from "@/lib/seo/content-topics";

const validDate = (value?: string | null) =>
  value && Number.isFinite(Date.parse(value)) ? value : undefined;

const postListItem = (
  post: BackendPostSummary,
  position: number,
  siteOrigin: string,
) => ({
  "@type": "ListItem",
  position,
  name: post.title,
  url: resolveCanonicalUrl(`/blog/${encodeURIComponent(post.slug)}`, siteOrigin),
});

export const createBlogCollectionSchema = ({
  siteOrigin,
  path,
  title,
  description,
  posts,
  topics = [],
  activeTopic,
}: {
  siteOrigin: string;
  path: string;
  title: string;
  description: string;
  posts: BackendPostSummary[];
  topics?: ContentTopicSummary[];
  activeTopic?: ContentTopicSummary;
}) => {
  const url = resolveCanonicalUrl(path, siteOrigin);
  const about = activeTopic
    ? {
        "@type": "DefinedTerm",
        name: activeTopic.name,
        url: resolveCanonicalUrl(activeTopic.path, siteOrigin),
      }
    : topics.map((topic) => ({
        "@type": "DefinedTerm",
        name: topic.name,
        url: resolveCanonicalUrl(topic.path, siteOrigin),
      }));

  return {
    "@context": "https://schema.org",
    "@type": activeTopic ? "CollectionPage" : "Blog",
    name: title,
    description,
    url,
    inLanguage: "fa-IR",
    isPartOf: {
      "@type": "WebSite",
      name: brandConfig.brandName,
      url: new URL(siteOrigin).origin,
    },
    about: Array.isArray(about) && about.length === 0 ? undefined : about,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: posts.length,
      itemListElement: posts.map((post, index) =>
        postListItem(post, index + 1, siteOrigin),
      ),
    },
  };
};

export const createBlogPostingSchema = ({
  siteOrigin,
  post,
}: {
  siteOrigin: string;
  post: BackendPostDetail;
}) => {
  const articleUrl = resolveCanonicalUrl(
    `/blog/${encodeURIComponent(post.slug)}`,
    siteOrigin,
  );
  const topicPath = getContentTopicPath(post.category);
  const authorName = post.author?.trim() || brandConfig.brandName;
  const authorType = authorName === brandConfig.brandName ? "Organization" : "Person";

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || post.title,
    image: post.coverUrl
      ? resolvePublicMediaUrl(post.coverUrl, siteOrigin)
      : undefined,
    datePublished: validDate(post.publishedAt),
    articleSection: post.category || undefined,
    keywords: post.tags.length ? post.tags.slice(0, 20) : undefined,
    inLanguage: "fa-IR",
    author: {
      "@type": authorType,
      name: authorName,
    },
    publisher: {
      "@type": "Organization",
      name: brandConfig.brandName,
      url: new URL(siteOrigin).origin,
    },
    about: post.tags.length
      ? post.tags.slice(0, 20).map((tag) => ({
          "@type": "Thing",
          name: tag,
        }))
      : undefined,
    isPartOf: topicPath
      ? {
          "@type": "CollectionPage",
          name: post.category,
          url: resolveCanonicalUrl(topicPath, siteOrigin),
        }
      : {
          "@type": "Blog",
          name: "راهنماهای وینیمی",
          url: resolveCanonicalUrl("/blog", siteOrigin),
        },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
    },
    url: articleUrl,
  };
};
