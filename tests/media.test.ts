import { describe, expect, it } from "vitest";
import {
  caseThumbnail,
  fullResUrl,
  isVideoSrc,
  thumbUrl,
} from "@/lib/media";

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

describe("thumbUrl", () => {
  it("asks Contentful for a small WebP, replacing any existing resize hint", () => {
    expect(
      thumbUrl("https://images.ctfassets.net/space/a/b/shot.png?h=250"),
    ).toBe("https://images.ctfassets.net/space/a/b/shot.png?w=480&fm=webp&q=75");
  });

  it("leaves local paths, other hosts and Contentful videos untouched", () => {
    expect(thumbUrl("/thumbs/cordy.webp")).toBe("/thumbs/cordy.webp");
    const signed = "https://cdn.example.com/img.png?token=abc123";
    expect(thumbUrl(signed)).toBe(signed);
    const clip = "https://videos.ctfassets.net/space/a/b/clip.mp4";
    expect(thumbUrl(clip)).toBe(clip);
  });
});

describe("caseThumbnail", () => {
  it("prefers the explicit thumbnail", () => {
    expect(
      caseThumbnail({
        thumbnail: "/thumbs/a.webp",
        image: "/work/a.webp",
        bento: [{ src: "/work/b.webp" }],
      }),
    ).toBe("/thumbs/a.webp");
  });

  it("falls back to the first bento image, skipping video tiles", () => {
    expect(
      caseThumbnail({
        image: "/work/a.webp",
        bento: [{ video: "/work/clip.mp4" }, { src: "/work/b.webp" }],
      }),
    ).toBe("/work/b.webp");
  });

  it("falls back to the single image", () => {
    expect(caseThumbnail({ image: "/work/a.webp" })).toBe("/work/a.webp");
  });

  it("returns undefined when a case has no still image", () => {
    expect(caseThumbnail({})).toBeUndefined();
    expect(caseThumbnail({ bento: [{ video: "/work/clip.mp4" }] })).toBeUndefined();
  });

  it("downsizes Contentful-hosted fallbacks", () => {
    expect(
      caseThumbnail({
        image: "https://images.ctfassets.net/space/a/b/shot.png",
      }),
    ).toBe("https://images.ctfassets.net/space/a/b/shot.png?w=480&fm=webp&q=75");
  });
});

describe("isVideoSrc", () => {
  it("recognises video files by extension, local or remote", () => {
    expect(isVideoSrc("/gallery/reel.mp4")).toBe(true);
    expect(isVideoSrc("/work/demo.WEBM")).toBe(true);
    expect(
      isVideoSrc("https://videos.ctfassets.net/space/a/b/clip.mp4?w=640"),
    ).toBe(true);
  });

  it("treats images (including animated WebP) as not video", () => {
    expect(isVideoSrc("/gallery/poster.webp")).toBe(false);
    expect(isVideoSrc("/archive/recording.webp")).toBe(false);
    expect(isVideoSrc("https://images.ctfassets.net/space/a/b/mp4.png")).toBe(
      false,
    );
  });
});
