import type {
  BackendPostDetail,
  BackendPostSummary,
} from "@/lib/backend-contract";
import { loadPosts } from "@/lib/content";
import {
  collectContentTopics,
  normalizeContentTopic,
  type ContentTopicSummary,
} from "@/lib/seo/content-topics";

const MAX_CONTENT_PAGES = 100;
const CONTENT_PAGE_SIZE = 48;

export const collectPublishedContentTopics = async (): Promise<
  ContentTopicSummary[]
> => {
  const posts: BackendPostSummary[] = [];
  let page = 1;
  let totalPages = 1;

  do {
    const result = await loadPosts({ page, perPage: CONTENT_PAGE_SIZE });
    posts.push(...result.posts);
    totalPages = Math.max(1, result.pagination?.totalPages ?? 1);
    if (totalPages > MAX_CONTENT_PAGES) {
      throw new Error("Published content taxonomy exceeds the safety limit.");
    }
    page += 1;
  } while (page <= totalPages);

  return collectContentTopics(posts);
};

export const loadRelatedPublishedPosts = async (
  post: BackendPostDetail,
  limit = 3,
): Promise<BackendPostSummary[]> => {
  const topic = normalizeContentTopic(post.category);
  if (!topic || limit <= 0) return [];

  const result = await loadPosts({
    category: topic,
    page: 1,
    perPage: Math.min(12, Math.max(2, limit + 1)),
  });

  return result.posts
    .filter((candidate) => candidate.slug !== post.slug)
    .slice(0, limit);
};
