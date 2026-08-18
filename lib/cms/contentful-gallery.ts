import "server-only";

import type { GalleryItem } from "@/lib/types";
import {
  mapContentfulGallery,
  type ContentfulGalleryResponse,
} from "@/lib/cms/gallery-mapper";

const CONTENTFUL_CDN = "https://cdn.contentful.com";
/** How often (seconds) Next revalidates the cached Contentful response. */
const REVALIDATE_SECONDS = 300;
/** API id of the "Graphic Design" content type in Contentful. */
const DEFAULT_CONTENT_TYPE = "graphicDesign";
/** CDA page size cap; galleries larger than this are truncated (logged). */
const MAX_ENTRIES = 100;
/** Abort the CDA request after this long so a hung CMS never blocks render. */
const FETCH_TIMEOUT_MS = 5000;
const LOG_BODY_LIMIT = 500;

interface ContentfulConfig {
  spaceId: string;
  accessToken: string;
  environment: string;
  contentType: string;
}

/** Reads Contentful credentials from env; null when the CMS isn't configured. */
function readConfig(): ContentfulConfig | null {
  const spaceId = process.env.CONTENTFUL_SPACE_ID;
  const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;
  if (!spaceId || !accessToken) return null;
  return {
    spaceId,
    accessToken,
    environment: process.env.CONTENTFUL_ENVIRONMENT ?? "master",
    contentType: process.env.CONTENTFUL_GALLERY_TYPE ?? DEFAULT_CONTENT_TYPE,
  };
}

function buildEntriesUrl(config: ContentfulConfig): string {
  const url = new URL(
    `/spaces/${encodeURIComponent(config.spaceId)}/environments/${encodeURIComponent(config.environment)}/entries`,
    CONTENTFUL_CDN,
  );
  url.searchParams.set("content_type", config.contentType);
  url.searchParams.set("include", "1");
  url.searchParams.set("limit", String(MAX_ENTRIES));
  return url.toString();
}

/**
 * Fetches the graphic-design gallery from Contentful's Content Delivery API.
 * Returns null when the CMS is unconfigured, unreachable, or returns no
 * usable entries — callers fall back to the static gallery content.
 */
export async function fetchGalleryFromContentful(): Promise<
  GalleryItem[] | null
> {
  const config = readConfig();
  if (!config) return null;

  try {
    const response = await fetch(buildEntriesUrl(config), {
      headers: { Authorization: `Bearer ${config.accessToken}` },
      next: { revalidate: REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    if (!response.ok) {
      const body = await response.text();
      console.error(
        `[contentful] gallery fetch failed: ${response.status} ${response.statusText}`,
        body.slice(0, LOG_BODY_LIMIT),
      );
      return null;
    }

    const payload: unknown = await response.json();
    if (
      typeof payload !== "object" ||
      payload === null ||
      !Array.isArray((payload as ContentfulGalleryResponse).items)
    ) {
      console.error(
        "[contentful] unexpected response shape",
        JSON.stringify(payload).slice(0, LOG_BODY_LIMIT),
      );
      return null;
    }

    const total = (payload as { total?: unknown }).total;
    if (typeof total === "number" && total > MAX_ENTRIES) {
      console.warn(
        `[contentful] gallery has ${total} entries; only the first ${MAX_ENTRIES} are shown`,
      );
    }

    const items = mapContentfulGallery(payload as ContentfulGalleryResponse);
    return items.length > 0 ? items : null;
  } catch (error) {
    console.error("[contentful] gallery fetch threw", error);
    return null;
  }
}
