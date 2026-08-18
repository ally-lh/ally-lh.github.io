"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

interface AssetImageProps {
  src: string;
  alt?: string;
  className?: string;
  style?: CSSProperties;
  /** Rendered instead of the <img> when the asset is missing. */
  fallback?: ReactNode;
}

/**
 * Plain <img> that swaps to an inline SVG/CSS fallback when the asset
 * 404s, so the site works before any binary art has been exported into
 * /public/assets. Decorative art only — use next/image for content photos.
 */
export function AssetImage({
  src,
  alt = "",
  className,
  style,
  fallback = null,
}: AssetImageProps) {
  const [failed, setFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // With SSR the browser can fail the request before React hydrates and
  // attaches onError, so also verify the loaded state after mount.
  useEffect(() => {
    const img = imgRef.current;
    if (img?.complete && img.naturalWidth === 0) setFailed(true);
  }, [src]);

  if (failed) return <>{fallback}</>;

  return (
    // eslint-disable-next-line @next/next/no-img-element -- decorative stage art with error fallback
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      className={className}
      style={style}
      draggable={false}
      onError={() => setFailed(true)}
    />
  );
}
