const HTML_TAG_PATTERN = /<[^>]*>/g;

const decodeBasicEntities = (value: string) =>
  value
    .replaceAll("&nbsp;", " ")
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#039;", "'")
    .replaceAll("&#39;", "'");

export type FaqTextAlign = "start" | "center" | "end" | "justify";

export const resolveFaqTextAlign = (style?: string): FaqTextAlign => {
  if (!style) return "start";

  const declaration = style
    .split(";")
    .map((part) => part.trim())
    .find((part) => /^text-align\s*:/i.test(part));

  if (!declaration) return "start";

  const value = declaration.split(":", 2)[1]?.trim().toLowerCase();
  switch (value) {
    case "center":
      return "center";
    case "left":
      return "end";
    case "right":
      return "start";
    case "justify":
      return "justify";
    default:
      return "start";
  }
};

export const faqTextAlignClass = (align: FaqTextAlign) => {
  switch (align) {
    case "center":
      return "text-center";
    case "end":
      return "text-left";
    case "justify":
      return "text-justify";
    case "start":
    default:
      return "text-right";
  }
};

export const faqAnswerToPlainText = (content: string) =>
  decodeBasicEntities(
    content
      .replace(/<br\s*\/?>/gi, " ")
      .replace(/<\/p\s*>/gi, " ")
      .replace(/<\/li\s*>/gi, " ")
      .replace(HTML_TAG_PATTERN, " ")
      .replace(/\s+/g, " ")
      .trim(),
  );
