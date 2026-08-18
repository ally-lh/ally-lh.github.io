import { describe, expect, it } from "vitest";
import { fullResUrl } from "@/lib/media";

describe("fullResUrl", () => {
  it("strips resize params from Contentful asset URLs", () => {
    expect(
      fullResUrl("https://images.ctfassets.net/space/a/b/shot.png?h=250"),
    ).toBe("https://images.ctfassets.net/space/a/b/shot.png");
    expect(
      fullResUrl("https://videos.ctfassets.net/space/a/b/clip.mp4?w=640&q=50"),
    ).toBe("https://videos.ctfassets.net/space/a/b/clip.mp4");
  });

  it("leaves other absolute URLs untouched (params may be load-bearing)", () => {
    const signed = "https://cdn.example.com/img.png?token=abc123";
    expect(fullResUrl(signed)).toBe(signed);
  });

  it("leaves local public/ paths untouched", () => {
    expect(fullResUrl("/work/poster.png")).toBe("/work/poster.png");
  });
});
