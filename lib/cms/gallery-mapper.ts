import type { GalleryItem } from "@/lib/types";

/**
 * Minimal shape of a Contentful Content Delivery API response for the
 * gallery content type. Fields the mapper reads from each entry:
 * - `title`  (Short text, required) → tile label
 * - `category` (Short text)         → corner tag, defaults to "MISC"
 * - `image`  (Media)                → artwork, resolved via `includes.Asset`
 * - `colSpan` / `rowSpan` (Integer) → masonry spans, clamped to 1–2
 * - `order`  (Integer)              → sort position (unordered entries last)
 */
export interface ContentfulGalleryResponse {
  items: readonly ContentfulEntry[];
  includes?: { Asset?: readonly ContentfulAsset[] };
}

interface ContentfulEntry {
  sys: { id: string };
  fields: {
    title?: unknown;
    category?: unknown;
    colSpan?: unknown;
    rowSpan?: unknown;
    order?: unknown;
    image?: { sys?: { id?: string; type?: string; linkType?: string } };
  };
}

interface ContentfulAsset {
  sys: { id: string };
  fields?: { file?: { url?: unknown } };
}

const MIN_SPAN = 1;
const MAX_SPAN = 2;
const DEFAULT_CATEGORY = "MISC";
const PLACEHOLDER_TEXT = "Awaiting evidence upload";

function clampSpan(value: unknown): 1 | 2 {
  if (typeof value !== "number" || !Number.isFinite(value)) return MIN_SPAN;
  return Math.min(MAX_SPAN, Math.max(MIN_SPAN, Math.round(value))) as 1 | 2;
}

/** Contentful asset URLs are protocol-relative (`//images.ctfassets.net/…`). */
function normalizeAssetUrl(url: unknown): string | undefined {
  if (typeof url !== "string" || url.length === 0) return undefined;
  return url.startsWith("//") ? `https:${url}` : url;
}

function buildAssetUrlMap(
  assets: readonly ContentfulAsset[] | undefined,
): ReadonlyMap<string, string> {
  const entries = (assets ?? []).flatMap((asset): [string, string][] => {
    const url = normalizeAssetUrl(asset.fields?.file?.url);
    return url ? [[asset.sys.id, url]] : [];
  });
  return new Map(entries);
}

function sortByOrder(items: readonly ContentfulEntry[]): ContentfulEntry[] {
  const orderOf = (entry: ContentfulEntry) =>
    typeof entry.fields.order === "number"
      ? entry.fields.order
      : Number.POSITIVE_INFINITY;
  return [...items].sort((a, b) => orderOf(a) - orderOf(b));
}

/**
 * Maps a raw Contentful response to the gallery's `GalleryItem` shape.
 * Entries without a title are dropped; every other field falls back to a
 * safe default so a half-filled CMS entry never breaks the grid.
 */
export function mapContentfulGallery(
  response: ContentfulGalleryResponse,
): GalleryItem[] {
  const assetUrls = buildAssetUrlMap(response.includes?.Asset);

  return sortByOrder(response.items)
    .filter(
      (entry) =>
        typeof entry.fields.title === "string" && entry.fields.title.length > 0,
    )
    .map((entry, index) => {
      const { fields } = entry;
      const assetId = fields.image?.sys?.id;
      return {
        id: entry.sys.id,
        num: `E-${String(index + 1).padStart(2, "0")}`,
        label: String(fields.title).toUpperCase(),
        category:
          typeof fields.category === "string" && fields.category.length > 0
            ? fields.category.toUpperCase()
            : DEFAULT_CATEGORY,
        colSpan: clampSpan(fields.colSpan),
        rowSpan: clampSpan(fields.rowSpan),
        image: assetId ? assetUrls.get(assetId) : undefined,
        imagePlaceholder: PLACEHOLDER_TEXT,
      };
    });
}
