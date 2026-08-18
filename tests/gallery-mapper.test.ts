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
          colSpan: 2,
          rowSpan: 2,
          image: { sys: { type: "Link", linkType: "Asset", id: "asset-1" } },
        },
      },
    ],
    includes: {
      Asset: [
        {
          sys: { id: "asset-1" },
          fields: {
            file: { url: "//images.ctfassets.net/space/poster.png" },
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
      num: "E-01",
      label: "STATIC BLOOM",
      category: "PRINT",
      colSpan: 2,
      rowSpan: 2,
      image: "https://images.ctfassets.net/space/poster.png",
      imagePlaceholder: "Awaiting evidence upload",
    });
  });

  it("numbers exhibits sequentially with zero padding", () => {
    const response = makeResponse({
      items: Array.from({ length: 3 }, (_, i) => ({
        sys: { id: `entry-${i}` },
        fields: { title: `Piece ${i}` },
      })),
    });
    const nums = mapContentfulGallery(response).map((g) => g.num);
    expect(nums).toEqual(["E-01", "E-02", "E-03"]);
  });

  it("clamps out-of-range spans to the 1-2 grid range", () => {
    const response = makeResponse({
      items: [
        {
          sys: { id: "entry-1" },
          fields: { title: "Huge", colSpan: 7, rowSpan: 0 },
        },
      ],
    });
    const [item] = mapContentfulGallery(response);
    expect(item.colSpan).toBe(2);
    expect(item.rowSpan).toBe(1);
  });

  it("defaults spans and category when fields are missing", () => {
    const response = makeResponse({
      items: [{ sys: { id: "entry-1" }, fields: { title: "Bare" } }],
    });
    const [item] = mapContentfulGallery(response);
    expect(item.colSpan).toBe(1);
    expect(item.rowSpan).toBe(1);
    expect(item.category).toBe("MISC");
    expect(item.image).toBeUndefined();
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
