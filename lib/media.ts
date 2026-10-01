import type { CaseFile } from "@/lib/types";

/** Contentful's Images API host — the only one that resizes on the fly. */
const CONTENTFUL_IMAGES_HOST = "images.ctfassets.net";
/** Resize hint for menu thumbnails (2x the largest rendered width). */
const THUMB_PARAMS = "?w=480&fm=webp&q=75";
/** File extensions the lightbox plays as video instead of showing as an image. */
const VIDEO_EXTENSION = /\.(mp4|webm|mov|m4v)$/i;

/** True when a media path/URL points at a video file (query strings ignored). */
export function isVideoSrc(src: string): boolean {
  const path = src.split(/[?#]/)[0];
  return VIDEO_EXTENSION.test(path);
}

/**
 * Full-resolution variant of an image URL for the lightbox. Contentful
 * asset URLs (images.ctfassets.net) use query params purely as resize
 * hints (?h=250 etc.), so dropping them yields the original file. Other
 * URLs and local paths are returned untouched.
 */
export function fullResUrl(src: string): string {
  try {
    const url = new URL(src);
    if (url.hostname.endsWith("ctfassets.net")) {
      url.search = "";
      return url.toString();
    }
  } catch {
    // Relative/local path — no resize params to strip.
  }
  return src;
}

/**
 * Small variant of an image URL for menu thumbnails. Contentful images are
 * resized by their CDN; local paths and other hosts are returned untouched
 * (local thumbnails are already exported at a sensible size).
 */
export function thumbUrl(src: string): string {
  try {
    const url = new URL(src);
    if (url.hostname === CONTENTFUL_IMAGES_HOST) {
      url.search = THUMB_PARAMS;
      return url.toString();
    }
  } catch {
    // Relative/local path — served as-is.
  }
  return src;
}

/**
 * Thumbnail for a case's menu card: the explicit `thumbnail` if set, else
 * the first bento image, else the single `image`. Undefined when the case
 * has no still image (e.g. video only) — set `thumbnail` for those.
 */
export function caseThumbnail(
  c: Pick<CaseFile, "thumbnail" | "image" | "bento">,
): string | undefined {
  const src =
    c.thumbnail ?? c.bento?.find((tile) => tile.src)?.src ?? c.image;
  return src ? thumbUrl(src) : undefined;
}
