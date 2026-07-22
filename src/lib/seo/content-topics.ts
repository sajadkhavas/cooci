import type { BackendPostSummary } from "@/lib/backend-contract";

const PATH_SEPARATOR_PATTERN = /[\\/]/;
const hasControlCharacter = (value: string) =>
  [...value].some((character) => {
    const code = character.charCodeAt(0);
    return code <= 31 || code === 127;
  });

export interface ContentTopicSummary {
  name: string;
  path: string;
  postCount: number;
  latestPublishedAt?: string;
}

export const normalizeContentTopic = (value: unknown) => {
  if (typeof value !== "string") return undefined;
  const normalized = value.normalize("NFC").trim();
  if (
    !normalized ||
    normalized.length > 120 ||
    hasControlCharacter(normalized) ||
    PATH_SEPARATOR_PATTERN.test(normalized)
  ) {
    return undefined;
  }
  return normalized;
};

export const getContentTopicPath = (value: unknown) => {
  const topic = normalizeContentTopic(value);
  return topic ? `/blog/topic/${encodeURIComponent(topic)}` : undefined;
};

const publishedTimestamp = (value?: string | null) => {
  if (!value) return Number.NEGATIVE_INFINITY;
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? timestamp : Number.NEGATIVE_INFINITY;
};

export const summarizeContentTopic = ({
  name,
  posts,
  total,
}: {
  name: string;
  posts: BackendPostSummary[];
  total?: number;
}): ContentTopicSummary | undefined => {
  const topic = normalizeContentTopic(name);
  const path = getContentTopicPath(topic);
  if (!topic || !path) return undefined;

  const latestPublishedAt = posts
    .map((post) => post.publishedAt)
    .filter(
      (value): value is string =>
        publishedTimestamp(value) > Number.NEGATIVE_INFINITY,
    )
    .sort(
      (first, second) =>
        publishedTimestamp(second) - publishedTimestamp(first),
    )[0];

  return {
    name: topic,
    path,
    postCount: Math.max(0, Math.trunc(total ?? posts.length)),
    latestPublishedAt,
  };
};

export const collectContentTopics = (
  posts: BackendPostSummary[],
): ContentTopicSummary[] => {
  const grouped = new Map<string, BackendPostSummary[]>();

  for (const post of posts) {
    const topic = normalizeContentTopic(post.category);
    if (!topic) continue;
    const current = grouped.get(topic) ?? [];
    current.push(post);
    grouped.set(topic, current);
  }

  return Array.from(grouped.entries())
    .map(([name, topicPosts]) =>
      summarizeContentTopic({ name, posts: topicPosts, total: topicPosts.length }),
    )
    .filter((topic): topic is ContentTopicSummary => Boolean(topic))
    .sort((first, second) => {
      const countDifference = second.postCount - first.postCount;
      if (countDifference !== 0) return countDifference;
      const dateDifference =
        publishedTimestamp(second.latestPublishedAt) -
        publishedTimestamp(first.latestPublishedAt);
      if (dateDifference !== 0) return dateDifference;
      return first.name.localeCompare(second.name, "fa");
    });
};
