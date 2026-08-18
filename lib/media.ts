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
