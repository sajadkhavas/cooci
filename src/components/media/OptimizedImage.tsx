import type { ImgHTMLAttributes } from "react";

export interface ResponsiveImageSource {
  srcSet: string;
  type?: string;
  media?: string;
  sizes?: string;
}

interface OptimizedImageProps
  extends Omit<
    ImgHTMLAttributes<HTMLImageElement>,
    "loading" | "decoding" | "fetchPriority"
  > {
  sources?: ResponsiveImageSource[];
  loading?: "eager" | "lazy";
  decoding?: "async" | "auto" | "sync";
  fetchPriority?: "high" | "low" | "auto";
  priority?: boolean;
}

export const OptimizedImage = ({
  sources = [],
  loading,
  decoding = "async",
  fetchPriority,
  priority = false,
  width,
  height,
  ...imageProps
}: OptimizedImageProps) => {
  const resolvedLoading = priority ? "eager" : loading ?? "lazy";
  const resolvedFetchPriority = priority ? "high" : fetchPriority ?? "auto";
  const image = (
    <img
      {...imageProps}
      width={width}
      height={height}
      loading={resolvedLoading}
      decoding={decoding}
      fetchPriority={resolvedFetchPriority}
    />
  );

  if (!sources.length) return image;

  return (
    <picture>
      {sources.map((source) => (
        <source
          key={`${source.type ?? "image"}:${source.media ?? "all"}:${source.srcSet}`}
          srcSet={source.srcSet}
          type={source.type}
          media={source.media}
          sizes={source.sizes}
        />
      ))}
      {image}
    </picture>
  );
};
