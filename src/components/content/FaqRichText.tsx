import parse, {
  domToReact,
  Element,
  type DOMNode,
  type HTMLReactParserOptions,
} from "html-react-parser";
import { Fragment } from "react";
import { Link } from "react-router";
import {
  faqTextAlignClass,
  resolveFaqTextAlign,
} from "@/lib/faq-rich-text";

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

const HTML_PATTERN = /<\/?[a-z][\s\S]*?>/i;

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
  if (/^https:\/\//i.test(src)) return src;
  return undefined;
};

type FaqRichTextVariant = "compact" | "page";

const createHtmlOptions = (variant: FaqRichTextVariant): HTMLReactParserOptions => {
  const options: HTMLReactParserOptions = {
    replace(domNode) {
      if (!(domNode instanceof Element)) return undefined;

      const tag = domNode.name.toLowerCase();
      if (DANGEROUS_TAGS.has(tag)) return <Fragment />;

      const children = domToReact(domNode.children as DOMNode[], options);
      const alignClass = faqTextAlignClass(resolveFaqTextAlign(domNode.attribs.style));
      const paragraphClass =
        variant === "compact"
          ? `text-sm leading-8 text-muted-foreground ${alignClass}`
          : `text-base leading-8 text-muted-foreground ${alignClass}`;

      switch (tag) {
        case "p":
          return <p className={paragraphClass}>{children}</p>;
        case "br":
          return <br />;
        case "strong":
        case "b":
          return <strong className="font-black text-foreground">{children}</strong>;
        case "em":
        case "i":
          return <em className="italic">{children}</em>;
        case "u":
          return <span className="underline underline-offset-4">{children}</span>;
        case "s":
        case "del":
          return <del>{children}</del>;
        case "ul":
          return (
            <ul className="list-disc space-y-2 pr-5 text-muted-foreground marker:text-primary">
              {children}
            </ul>
          );
        case "ol":
          return (
            <ol className="list-decimal space-y-2 pr-5 text-muted-foreground marker:font-bold marker:text-primary">
              {children}
            </ol>
          );
        case "li":
          return <li className="leading-8">{children}</li>;
        case "blockquote":
          return (
            <blockquote className="rounded-xl border-r-4 border-primary/50 bg-primary/5 px-4 py-3 leading-8 text-muted-foreground">
              {children}
            </blockquote>
          );
        case "a": {
          const href = safeHref(domNode.attribs.href);
          if (!href) return <span>{children}</span>;

          const className =
            "font-bold text-primary underline decoration-primary/30 underline-offset-4";
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
        case "img": {
          const src = safeImageSrc(domNode.attribs.src);
          if (!src) return <Fragment />;
          return (
            <img
              src={src}
              alt={(domNode.attribs.alt || "").slice(0, 300)}
              loading="lazy"
              decoding="async"
              className="h-auto max-w-full rounded-xl border border-border"
            />
          );
        }
        case "h1":
        case "h2":
        case "h3":
        case "h4":
        case "h5":
        case "h6":
          return (
            <strong className={`block font-black leading-8 text-foreground ${alignClass}`}>
              {children}
            </strong>
          );
        case "div":
        case "span":
        case "section":
        case "article":
          return <Fragment>{children}</Fragment>;
        case "code":
        case "pre":
          return <span className="font-mono text-sm">{children}</span>;
        default:
          return <Fragment>{children}</Fragment>;
      }
    },
  };

  return options;
};

export const FaqRichText = ({
  content,
  variant = "page",
}: {
  content: string;
  variant?: FaqRichTextVariant;
}) => {
  const source = content.trim();
  if (!source) return null;

  if (!HTML_PATTERN.test(source)) {
    return (
      <p className={variant === "compact" ? "text-sm leading-8 text-muted-foreground" : "text-base leading-8 text-muted-foreground"}>
        {source}
      </p>
    );
  }

  return (
    <div className={variant === "compact" ? "space-y-3" : "space-y-4"}>
      {parse(source, createHtmlOptions(variant))}
    </div>
  );
};
