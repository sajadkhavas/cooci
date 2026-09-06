import parse, {
  domToReact,
  Element,
  type DOMNode,
  type HTMLReactParserOptions,
} from "html-react-parser";
import { Fragment, type ReactNode } from "react";
import { Link } from "react-router";

export interface StructuredHeading {
  id: string;
  level: 2 | 3;
  text: string;
}

const DANGEROUS_TAGS = new Set([
  "script",
  "style",
  "iframe",
  "object",
  "embed",
  "form",
  "input",
  "textarea",
  "select",
  "option",
  "button",
  "link",
  "meta",
  "base",
  "svg",
  "math",
  "video",
  "audio",
  "canvas",
  "noscript",
]);

const HTML_PATTERN =
  /<\/?(?:h[1-6]|p|div|span|a|ul|ol|li|strong|b|em|i|blockquote|br|hr|table|thead|tbody|tr|th|td|img|figure|figcaption|code|pre|details|summary)\b/i;

const renderInlineText = (text: string): ReactNode[] =>
  text.split(/(\*\*.+?\*\*)/g).map((part, index) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={`${part}-${index}`}>{part.slice(2, -2)}</strong>
    ) : (
      <Fragment key={`${part}-${index}`}>{part}</Fragment>
    ),
  );

const decodeBasicEntities = (value: string) =>
  value
    .replaceAll("&nbsp;", " ")
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#039;", "'")
    .replaceAll("&#39;", "'");

const normalizeHeadingId = (value: string) =>
  value
    .normalize("NFKC")
    .toLocaleLowerCase("fa")
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80) || "section";

const allocateHeadingId = (value: string, counts: Map<string, number>) => {
  const base = normalizeHeadingId(value);
  const next = (counts.get(base) ?? 0) + 1;
  counts.set(base, next);
  return next === 1 ? base : `${base}-${next}`;
};

const stripHtml = (value: string) =>
  decodeBasicEntities(value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim());

export const extractStructuredHeadings = (
  content: string,
): StructuredHeading[] => {
  const source = content.trim();
  if (!source) return [];

  const counts = new Map<string, number>();
  const headings: StructuredHeading[] = [];

  if (HTML_PATTERN.test(source)) {
    const pattern = /<h([23])\b[^>]*>([\s\S]*?)<\/h\1>/gi;
    let match: RegExpExecArray | null;

    while ((match = pattern.exec(source)) !== null) {
      const text = stripHtml(match[2]);
      if (!text) continue;
      headings.push({
        id: allocateHeadingId(text, counts),
        level: Number(match[1]) as 2 | 3,
        text,
      });
    }

    return headings;
  }

  for (const line of source.split("\n")) {
    const normalized = line.trim();
    const match = /^(##|###)\s+(.+)$/.exec(normalized);
    if (!match) continue;

    const text = match[2].replace(/\*\*(.+?)\*\*/g, "$1").trim();
    if (!text) continue;

    headings.push({
      id: allocateHeadingId(text, counts),
      level: match[1] === "##" ? 2 : 3,
      text,
    });
  }

  return headings;
};

const safeHref = (value?: string) => {
  const href = value?.trim();
  if (!href) return undefined;
  if (href.startsWith("/") && !href.startsWith("//")) return href;
  if (href.startsWith("#")) return href;

  try {
    const parsed = new URL(href);
    return ["http:", "https:", "mailto:", "tel:"].includes(parsed.protocol)
      ? href
      : undefined;
  } catch {
    return undefined;
  }
};

const safeImageSrc = (value?: string) => {
  const src = value?.trim();
  if (!src) return undefined;
  if (src.startsWith("/") && !src.startsWith("//")) return src;
  if (/^https?:\/\//i.test(src)) return src;
  if (/^data:image\/(?:png|jpe?g|webp|gif);base64,/i.test(src)) return src;
  return undefined;
};

const textFromNodes = (nodes: DOMNode[]): string =>
  nodes
    .map((node) => {
      if (node.type === "text" && "data" in node) {
        return String(node.data);
      }
      if (node instanceof Element) {
        return textFromNodes(node.children as DOMNode[]);
      }
      return "";
    })
    .join("")
    .replace(/\s+/g, " ")
    .trim();

const renderHtml = (content: string) => {
  const headingCounts = new Map<string, number>();
  const options: HTMLReactParserOptions = {
    replace(domNode) {
      if (!(domNode instanceof Element)) return undefined;

      const tag = domNode.name.toLowerCase();
      if (DANGEROUS_TAGS.has(tag)) return <Fragment />;

      const children = domToReact(domNode.children as DOMNode[], options);
      const headingText = textFromNodes(domNode.children as DOMNode[]);

      switch (tag) {
        case "h1":
        case "h2": {
          const id = allocateHeadingId(headingText, headingCounts);
          return (
            <h2
              id={id}
              className="scroll-mt-32 border-r-4 border-primary/30 pr-4 text-2xl font-black leading-10 text-foreground first:mt-0 md:text-3xl"
            >
              {children}
            </h2>
          );
        }
        case "h3": {
          const id = allocateHeadingId(headingText, headingCounts);
          return (
            <h3
              id={id}
              className="scroll-mt-32 text-xl font-black leading-9 text-foreground md:text-2xl"
            >
              {children}
            </h3>
          );
        }
        case "h4":
        case "h5":
        case "h6":
          return (
            <h4 className="text-lg font-black leading-8 text-foreground">
              {children}
            </h4>
          );
        case "p":
          return (
            <p className="text-base leading-9 text-foreground/80 md:text-[1.05rem]">
              {children}
            </p>
          );
        case "ul":
          return (
            <ul className="list-disc space-y-3 pr-6 text-foreground/80 marker:text-primary">
              {children}
            </ul>
          );
        case "ol":
          return (
            <ol className="list-decimal space-y-3 pr-6 text-foreground/80 marker:font-bold marker:text-primary">
              {children}
            </ol>
          );
        case "li":
          return <li className="pr-1 leading-8">{children}</li>;
        case "strong":
        case "b":
          return <strong className="font-black text-foreground">{children}</strong>;
        case "em":
        case "i":
          return <em className="italic text-foreground/90">{children}</em>;
        case "u":
          return <span className="underline underline-offset-4">{children}</span>;
        case "s":
        case "del":
          return <del>{children}</del>;
        case "mark":
          return (
            <mark className="rounded bg-accent/25 px-1 text-foreground">
              {children}
            </mark>
          );
        case "small":
          return <small className="text-sm text-muted-foreground">{children}</small>;
        case "sup":
          return <sup>{children}</sup>;
        case "sub":
          return <sub>{children}</sub>;
        case "blockquote":
          return (
            <blockquote className="rounded-2xl border-r-4 border-primary bg-primary/5 px-5 py-4 leading-9 text-foreground/80">
              {children}
            </blockquote>
          );
        case "a": {
          const href = safeHref(domNode.attribs.href);
          if (!href) {
            return <span className="font-bold text-foreground">{children}</span>;
          }

          const className =
            "font-bold text-primary underline decoration-primary/25 underline-offset-4 transition hover:decoration-primary";

          if (href.startsWith("/") && !href.startsWith("//")) {
            return (
              <Link to={href} className={className}>
                {children}
              </Link>
            );
          }

          const external = /^https?:\/\//i.test(href);
          return (
            <a
              href={href}
              className={className}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
            >
              {children}
            </a>
          );
        }
        case "br":
          return <br />;
        case "hr":
          return <hr className="border-border" />;
        case "code":
          return (
            <code
              className="rounded bg-secondary px-1.5 py-0.5 font-mono text-sm text-foreground"
              dir="ltr"
            >
              {children}
            </code>
          );
        case "pre":
          return (
            <pre
              className="overflow-x-auto rounded-2xl bg-foreground p-5 text-sm leading-7 text-background"
              dir="ltr"
            >
              {children}
            </pre>
          );
        case "figure":
          return <figure className="space-y-3">{children}</figure>;
        case "figcaption":
          return (
            <figcaption className="text-center text-sm leading-7 text-muted-foreground">
              {children}
            </figcaption>
          );
        case "img": {
          const src = safeImageSrc(domNode.attribs.src);
          if (!src) return <Fragment />;
          return (
            <img
              src={src}
              alt={(domNode.attribs.alt || "").slice(0, 300)}
              loading="lazy"
              decoding="async"
              className="h-auto w-full rounded-2xl border border-border object-cover shadow-soft"
            />
          );
        }
        case "table":
          return (
            <div className="overflow-x-auto rounded-2xl border border-border">
              <table className="w-full min-w-[34rem] border-collapse text-right text-sm">
                {children}
              </table>
            </div>
          );
        case "thead":
          return <thead className="bg-secondary/70 text-foreground">{children}</thead>;
        case "tbody":
          return <tbody className="divide-y divide-border">{children}</tbody>;
        case "tr":
          return <tr className="divide-x divide-x-reverse divide-border">{children}</tr>;
        case "th":
          return <th className="px-4 py-3 font-black">{children}</th>;
        case "td":
          return <td className="px-4 py-3 leading-7 text-foreground/80">{children}</td>;
        case "details":
          return (
            <details className="group rounded-2xl border border-border bg-secondary/20 p-5 open:bg-secondary/35">
              {children}
            </details>
          );
        case "summary":
          return (
            <summary className="cursor-pointer font-black text-foreground">
              {children}
            </summary>
          );
        case "div":
        case "section":
        case "article":
        case "main":
        case "header":
        case "footer":
        case "span":
          return <Fragment>{children}</Fragment>;
        default:
          return <Fragment>{children}</Fragment>;
      }
    },
  };

  return parse(content, options);
};

const renderPlainText = (content: string) => {
  const lines = content
    .trim()
    .split("\n")
    .map((line) => line.trim());
  const blocks: ReactNode[] = [];
  const headingCounts = new Map<string, number>();

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (!line) continue;

    if (line.startsWith("### ")) {
      const text = line.slice(4);
      blocks.push(
        <h3
          id={allocateHeadingId(text, headingCounts)}
          key={`h3-${index}`}
          className="scroll-mt-32 text-xl font-black leading-9 text-foreground md:text-2xl"
        >
          {renderInlineText(text)}
        </h3>,
      );
      continue;
    }
    if (line.startsWith("## ")) {
      const text = line.slice(3);
      blocks.push(
        <h2
          id={allocateHeadingId(text, headingCounts)}
          key={`h2-${index}`}
          className="scroll-mt-32 border-r-4 border-primary/30 pr-4 text-2xl font-black leading-10 text-foreground md:text-3xl"
        >
          {renderInlineText(text)}
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
        <ol
          key={`ol-${index}`}
          className="list-decimal space-y-3 pr-6 text-foreground/80 marker:font-bold marker:text-primary"
        >
          {items.map((item) => (
            <li key={item} className="pr-1 leading-8">
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
        <ul
          key={`ul-${index}`}
          className="list-disc space-y-3 pr-6 text-foreground/80 marker:text-primary"
        >
          {items.map((item) => (
            <li key={item} className="pr-1 leading-8">
              {renderInlineText(item)}
            </li>
          ))}
        </ul>,
      );
      continue;
    }

    blocks.push(
      <p
        key={`p-${index}`}
        className="text-base leading-9 text-foreground/80 md:text-[1.05rem]"
      >
        {renderInlineText(line)}
      </p>,
    );
  }

  return blocks;
};

export const StructuredText = ({ content }: { content: string }) => {
  const source = content.trim();
  if (!source) return null;

  return (
    <div className="space-y-6 md:space-y-7">
      {HTML_PATTERN.test(source) ? renderHtml(source) : renderPlainText(source)}
    </div>
  );
};
