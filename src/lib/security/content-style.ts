export interface SafeContentStyle {
  textAlign?: "left" | "right" | "center" | "justify" | "start" | "end";
  color?: string;
  backgroundColor?: string;
}

const SAFE_TEXT_ALIGNMENTS = new Set<SafeContentStyle["textAlign"]>([
  "left",
  "right",
  "center",
  "justify",
  "start",
  "end",
]);

const isSafeColor = (value: string) => {
  const normalized = value.trim();

  return (
    /^#[0-9a-f]{3,8}$/i.test(normalized) ||
    /^rgba?\([0-9.,%\s/]+\)$/i.test(normalized) ||
    /^hsla?\([0-9.,%\s/deg]+\)$/i.test(normalized) ||
    ["transparent", "currentcolor"].includes(normalized.toLowerCase())
  );
};

export const parseSafeContentStyle = (value?: string): SafeContentStyle | undefined => {
  if (!value?.trim()) return undefined;

  const style: SafeContentStyle = {};

  for (const declaration of value.split(";")) {
    const separator = declaration.indexOf(":");
    if (separator < 0) continue;

    const property = declaration.slice(0, separator).trim().toLowerCase();
    const propertyValue = declaration.slice(separator + 1).trim();

    if (property === "text-align") {
      const alignment = propertyValue.toLowerCase() as SafeContentStyle["textAlign"];
      if (SAFE_TEXT_ALIGNMENTS.has(alignment)) style.textAlign = alignment;
      continue;
    }

    if (property === "color" && isSafeColor(propertyValue)) {
      style.color = propertyValue;
      continue;
    }

    if (property === "background-color" && isSafeColor(propertyValue)) {
      style.backgroundColor = propertyValue;
    }
  }

  return Object.keys(style).length > 0 ? style : undefined;
};
