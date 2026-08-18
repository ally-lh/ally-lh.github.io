import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fetchGalleryFromContentful } from "@/lib/cms/contentful-gallery";

// The server-only guard throws outside a React Server environment.
vi.mock("server-only", () => ({}));

const VALID_PAYLOAD = {
  total: 1,
  items: [
    {
      sys: { id: "entry-1" },
      fields: {
        title: "Static Bloom",
        category: "Print",
        image: { sys: { type: "Link", linkType: "Asset", id: "asset-1" } },
      },
    },
  ],
  includes: {
    Asset: [
      {
        sys: { id: "asset-1" },
        fields: { file: { url: "//images.ctfassets.net/space/poster.png" } },
      },
    ],
  },
};

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

describe("fetchGalleryFromContentful", () => {
  beforeEach(() => {
    vi.stubEnv("CONTENTFUL_SPACE_ID", "space123");
    vi.stubEnv("CONTENTFUL_ACCESS_TOKEN", "token123");
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("returns null without fetching when credentials are missing", async () => {
    vi.stubEnv("CONTENTFUL_SPACE_ID", "");
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);

    expect(await fetchGalleryFromContentful()).toBeNull();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("maps entries on a successful response", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse(VALID_PAYLOAD)));

    const items = await fetchGalleryFromContentful();
    expect(items).toHaveLength(1);
    expect(items?.[0]).toMatchObject({
      id: "entry-1",
      label: "STATIC BLOOM",
      image: "https://images.ctfassets.net/space/poster.png",
    });
  });

  it("sends the access token and content type in the request", async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(VALID_PAYLOAD));
    vi.stubGlobal("fetch", fetchMock);

    await fetchGalleryFromContentful();
    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toContain("space123");
    expect(String(url)).toContain("content_type=graphicDesign");
    expect(init.headers.Authorization).toBe("Bearer token123");
  });

  it("returns null on a non-ok response instead of throwing", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(jsonResponse({ message: "bad key" }, 401)),
    );

    expect(await fetchGalleryFromContentful()).toBeNull();
    expect(console.error).toHaveBeenCalled();
  });

  it("returns null when the response shape is not a Contentful listing", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(jsonResponse({ unexpected: true })),
    );

    expect(await fetchGalleryFromContentful()).toBeNull();
  });

  it("returns null when fetch rejects (network error / timeout)", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new DOMException("timed out", "TimeoutError")),
    );

    expect(await fetchGalleryFromContentful()).toBeNull();
    expect(console.error).toHaveBeenCalled();
  });

  it("returns null when the CMS has no usable entries", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(jsonResponse({ total: 0, items: [] })),
    );

    expect(await fetchGalleryFromContentful()).toBeNull();
  });

  it("warns when the gallery exceeds the fetch limit", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(jsonResponse({ ...VALID_PAYLOAD, total: 250 })),
    );

    await fetchGalleryFromContentful();
    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining("250 entries"),
    );
  });
});
