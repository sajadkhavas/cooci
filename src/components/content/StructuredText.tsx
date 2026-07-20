import { Fragment, type ReactNode } from "react";

const renderInlineText = (text: string): ReactNode[] =>
  text.split(/(\*\*.+?\*\*)/g).map((part, index) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={`${part}-${index}`}>{part.slice(2, -2)}</strong>
    ) : (
      <Fragment key={`${part}-${index}`}>{part}</Fragment>
    ),
  );

export const StructuredText = ({ content }: { content: string }) => {
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
          {items.map((item) => <li key={item} className="leading-9">{renderInlineText(item)}</li>)}
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
          {items.map((item) => <li key={item} className="leading-9">{renderInlineText(item)}</li>)}
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

  return <div>{blocks}</div>;
};
