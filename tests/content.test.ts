import { existsSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { CASES } from "@/lib/content/cases";
import { SCREEN_LINES } from "@/lib/content/dialogue";
import { GALLERY } from "@/lib/content/gallery";
import { OLD_PROJECTS } from "@/lib/content/old-projects";
import { SKILLS } from "@/lib/content/profile";
import { SITE } from "@/lib/content/site";
import { SMALL_PROJECTS } from "@/lib/content/small-projects";
import { caseThumbnail } from "@/lib/media";

const PUBLIC_DIR = path.resolve(__dirname, "../public");
/** GitHub Pages serves every file as-is, so keep committed media small. */
const MAX_MEDIA_BYTES = 10 * 1024 * 1024;

/** Media paths served from /public (full URLs live on a CDN instead). */
function localMediaPaths(): string[] {
  const all = [
    ...CASES.flatMap((c) => [
      c.thumbnail,
      c.image,
      c.video,
      ...(c.bento ?? []).flatMap((tile) => [tile.src, tile.video]),
    ]),
    ...GALLERY.flatMap((g) => [g.image, g.video]),
    ...[...SMALL_PROJECTS, ...OLD_PROJECTS].flatMap((p) => [
      p.thumbnail,
      p.image,
    ]),
  ];
  return all.filter(
    (src): src is string => typeof src === "string" && src.startsWith("/"),
  );
}

describe("content integrity", () => {
  it("cases have unique ids and sequential numbers", () => {
    const ids = CASES.map((c) => c.id);
    expect(new Set(ids).size).toBe(CASES.length);
    CASES.forEach((c, i) => {
      expect(c.num).toBe(String(i + 1).padStart(2, "0"));
    });
  });

  it("every case has the fields the screens render", () => {
    for (const c of CASES) {
      expect(c.title.length).toBeGreaterThan(0);
      expect(c.description.length).toBeGreaterThan(0);
      expect(c.evidence.length).toBeGreaterThan(0);
      expect(c.tags.length).toBeGreaterThan(0);
      expect(c.line.length).toBeGreaterThan(0);
      // Both links are optional, but any that are set must be real URLs.
      for (const url of [c.repoUrl, c.demoUrl]) {
        if (url !== undefined) expect(url).toMatch(/^https?:\/\//);
      }
    }
  });

  it("skill bars stay in range", () => {
    for (const s of SKILLS) {
      expect(s.pct).toBeGreaterThanOrEqual(0);
      expect(s.pct).toBeLessThanOrEqual(100);
    }
  });

  it("dialogue exists for every non-case screen", () => {
    for (const screen of [
      "title",
      "boot",
      "menu",
      "gallery",
      "about",
      "resume",
      "contact",
    ] as const) {
      expect(SCREEN_LINES[screen]).toBeTruthy();
    }
  });

  it("gallery exhibits are unique and know their aspect ratio", () => {
    const ids = GALLERY.map((g) => g.id);
    expect(new Set(ids).size).toBe(GALLERY.length);
    for (const g of GALLERY) {
      expect(g.label.length).toBeGreaterThan(0);
      expect(g.aspect, g.id).toBeGreaterThan(0);
    }
  });

  it("gallery exhibits all show real artwork", () => {
    for (const g of GALLERY) {
      expect(g.image ?? g.video, g.id).toBeTruthy();
    }
  });

  it("local media exists under /public and stays within the size budget", () => {
    const paths = localMediaPaths();
    expect(paths.length).toBeGreaterThan(0);
    for (const src of paths) {
      const file = path.join(PUBLIC_DIR, src);
      expect(existsSync(file), `${src} is missing from /public`).toBe(true);
      expect(statSync(file).size, `${src} is too large`).toBeLessThanOrEqual(
        MAX_MEDIA_BYTES,
      );
    }
  });

  it("every open case has a thumbnail for the menu card", () => {
    for (const c of CASES) {
      if (c.comingSoon) continue;
      expect(caseThumbnail(c), c.id).toBeTruthy();
    }
  });

  it("old projects each have something to open", () => {
    expect(OLD_PROJECTS.length).toBeGreaterThan(0);
    for (const p of OLD_PROJECTS) {
      expect(p.href ?? p.image, p.title).toBeTruthy();
      expect(p.thumbnail, p.title).toBeTruthy();
    }
  });

  it("small and old projects have the fields the menu renders", () => {
    const titles = [...SMALL_PROJECTS, ...OLD_PROJECTS].map((p) => p.title);
    expect(new Set(titles).size).toBe(titles.length);
    for (const p of [...SMALL_PROJECTS, ...OLD_PROJECTS]) {
      expect(p.title.length).toBeGreaterThan(0);
      expect(p.blurb.length).toBeGreaterThan(0);
      expect(p.tags.length).toBeGreaterThan(0);
      if (p.href !== undefined) expect(p.href).toMatch(/^https?:\/\//);
    }
  });

  it("site email looks valid", () => {
    expect(SITE.email).toMatch(/^[^@\s]+@[^@\s]+\.[^@\s]+$/);
  });
});
