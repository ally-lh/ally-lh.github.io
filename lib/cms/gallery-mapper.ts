import type { GalleryItem } from "@/lib/types";

/**
 * Minimal shape of a Contentful Content Delivery API response for the
 * gallery content type. Fields the mapper reads from each entry:
 * - `title`  (Short text, required) → tile label
 * - `category` (Short text)         → corner tag, defaults to "MISC"
 * - `image`  (Media)                → artwork, resolved via `includes.Asset`
 *                                     (its pixel size sets the tile's ratio)
 * - `priority` (Integer)            → higher values are listed first
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
    priority?: unknown;
    order?: unknown;
    image?: { sys?: { id?: string; type?: string; linkType?: string } };
  };
}

interface ContentfulAsset {
  sys: { id: string };
  fields?: {
    file?: {
      url?: unknown;
      details?: { image?: { width?: unknown; height?: unknown } };
    };
  };
}

interface ResolvedAsset {
  url: string;
  aspect: number;
}

/** Tile ratio when Contentful reports no usable image dimensions. */
const DEFAULT_ASPECT = 1;
const DEFAULT_CATEGORY = "MISC";
const PLACEHOLDER_TEXT = "Awaiting evidence upload";

function isPositiveNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

function assetAspect(asset: ContentfulAsset): number {
  const size = asset.fields?.file?.details?.image;
  return isPositiveNumber(size?.width) && isPositiveNumber(size?.height)
    ? size.width / size.height
    : DEFAULT_ASPECT;
}

/** Contentful asset URLs are protocol-relative (`//images.ctfassets.net/…`). */
function normalizeAssetUrl(url: unknown): string | undefined {
  if (typeof url !== "string" || url.length === 0) return undefined;
  return url.startsWith("//") ? `https:${url}` : url;
}

function buildAssetMap(
  assets: readonly ContentfulAsset[] | undefined,
): ReadonlyMap<string, ResolvedAsset> {
  const entries = (assets ?? []).flatMap((asset): [string, ResolvedAsset][] => {
    const url = normalizeAssetUrl(asset.fields?.file?.url);
    return url ? [[asset.sys.id, { url, aspect: assetAspect(asset) }]] : [];
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
  const assets = buildAssetMap(response.includes?.Asset);

  return sortByOrder(response.items)
    .filter(
      (entry) =>
        typeof entry.fields.title === "string" && entry.fields.title.length > 0,
    )
    .map((entry) => {
      const { fields } = entry;
      const assetId = fields.image?.sys?.id;
      const asset = assetId ? assets.get(assetId) : undefined;
      return {
        id: entry.sys.id,
        label: String(fields.title).toUpperCase(),
        category:
          typeof fields.category === "string" && fields.category.length > 0
            ? fields.category.toUpperCase()
            : DEFAULT_CATEGORY,
        aspect: asset?.aspect ?? DEFAULT_ASPECT,
        ...(typeof fields.priority === "number" &&
        Number.isFinite(fields.priority)
          ? { priority: fields.priority }
          : {}),
        image: asset?.url,
        imagePlaceholder: PLACEHOLDER_TEXT,
      };
    });
}
