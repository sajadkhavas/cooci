export type ManagedCalloutTone =
  | "gray_light"
  | "gray"
  | "gray_dark"
  | "primary"
  | "secondary"
  | "tertiary"
  | "accent";

export interface ManagedCalloutPresentation {
  tone: ManagedCalloutTone;
  toneClass: string;
}

export const MANAGED_CALLOUT_CLASS = "filament-tiptap-hurdle";

const MANAGED_CALLOUT_TONES = new Set<ManagedCalloutTone>([
  "gray_light",
  "gray",
  "gray_dark",
  "primary",
  "secondary",
  "tertiary",
  "accent",
]);

const MANAGED_CALLOUT_TONE_CLASSES: Record<ManagedCalloutTone, string> = {
  gray_light: "border-border bg-secondary/20",
  gray: "border-muted-foreground/35 bg-secondary/35",
  gray_dark: "border-foreground/35 bg-foreground/5",
  primary: "border-primary/55 bg-primary/5",
  secondary: "border-secondary-foreground/25 bg-secondary/50",
  tertiary: "border-primary/35 bg-accent/10",
  accent: "border-accent-foreground/30 bg-accent/25",
};

export const resolveManagedCallout = (
  className?: string,
  requestedTone?: string,
): ManagedCalloutPresentation | null => {
  if (className?.trim() !== MANAGED_CALLOUT_CLASS) return null;

  const normalizedTone = requestedTone?.trim() as ManagedCalloutTone | undefined;
  const tone = normalizedTone && MANAGED_CALLOUT_TONES.has(normalizedTone)
    ? normalizedTone
    : "gray";

  return {
    tone,
    toneClass: MANAGED_CALLOUT_TONE_CLASSES[tone],
  };
};
