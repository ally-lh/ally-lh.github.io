import { describe, expect, it } from "vitest";
import {
  mapContentfulGallery,
  type ContentfulGalleryResponse,
} from "@/lib/cms/gallery-mapper";

function makeResponse(
  overrides: Partial<ContentfulGalleryResponse> = {},
): ContentfulGalleryResponse {
  return {
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
          fields: {
            file: {
              url: "//images.ctfassets.net/space/poster.png",
              details: { image: { width: 1200, height: 1600 } },
            },
          },
        },
      ],
    },
    ...overrides,
  };
}

describe("mapContentfulGallery", () => {
  it("maps a Contentful entry to a GalleryItem", () => {
    const [item] = mapContentfulGallery(makeResponse());
    expect(item).toEqual({
      id: "entry-1",
      label: "STATIC BLOOM",
      category: "PRINT",
      aspect: 0.75,
      image: "https://images.ctfassets.net/space/poster.png",
      imagePlaceholder: "Awaiting evidence upload",
    });
  });

  it("defaults to a square tile when the asset has no usable dimensions", () => {
    const response = makeResponse({
      includes: {
        Asset: [
          {
            sys: { id: "asset-1" },
            fields: {
              file: {
                url: "//images.ctfassets.net/space/poster.png",
                details: { image: { width: 1200, height: 0 } },
              },
            },
          },
        ],
      },
    });
    const [item] = mapContentfulGallery(response);
    expect(item.aspect).toBe(1);
  });

  it("defaults aspect and category when fields are missing", () => {
    const response = makeResponse({
      items: [{ sys: { id: "entry-1" }, fields: { title: "Bare" } }],
    });
    const [item] = mapContentfulGallery(response);
    expect(item.aspect).toBe(1);
    expect(item.category).toBe("MISC");
    expect(item.image).toBeUndefined();
    expect(item.priority).toBeUndefined();
  });

  it("passes through a numeric priority and ignores anything else", () => {
    const response = makeResponse({
      items: [
        { sys: { id: "a" }, fields: { title: "Pinned", priority: 3 } },
        { sys: { id: "b" }, fields: { title: "Junk", priority: "high" } },
      ],
    });
    const [pinned, junk] = mapContentfulGallery(response);
    expect(pinned.priority).toBe(3);
    expect(junk.priority).toBeUndefined();
  });

  it("skips entries without a title", () => {
    const response = makeResponse({
      items: [
        { sys: { id: "entry-1" }, fields: {} },
        { sys: { id: "entry-2" }, fields: { title: "Kept" } },
      ],
    });
    const items = mapContentfulGallery(response);
    expect(items).toHaveLength(1);
    expect(items[0].label).toBe("KEPT");
  });

  it("keeps https asset URLs untouched and resolves linked assets", () => {
    const response = makeResponse({
      includes: {
        Asset: [
          {
            sys: { id: "asset-1" },
            fields: { file: { url: "https://cdn.example.com/a.png" } },
          },
        ],
      },
    });
    const [item] = mapContentfulGallery(response);
    expect(item.image).toBe("https://cdn.example.com/a.png");
  });

  it("leaves image undefined when the linked asset is not in includes", () => {
    const response = makeResponse({ includes: undefined });
    const [item] = mapContentfulGallery(response);
    expect(item.image).toBeUndefined();
  });

  it("sorts by the optional order field when present", () => {
    const response = makeResponse({
      items: [
        { sys: { id: "b" }, fields: { title: "Second", order: 2 } },
        { sys: { id: "a" }, fields: { title: "First", order: 1 } },
        { sys: { id: "c" }, fields: { title: "Unordered" } },
      ],
    });
    const labels = mapContentfulGallery(response).map((g) => g.label);
    expect(labels).toEqual(["FIRST", "SECOND", "UNORDERED"]);
  });

  it("returns an empty array for an empty response", () => {
    expect(mapContentfulGallery({ items: [] })).toEqual([]);
  });
});
