import { describe, expect, it } from "vitest";
import { CASES } from "@/lib/content/cases";
import { SCREEN_LINES } from "@/lib/content/dialogue";
import { GALLERY } from "@/lib/content/gallery";
import { SKILLS } from "@/lib/content/profile";
import { SITE } from "@/lib/content/site";
import { SMALL_PROJECTS } from "@/lib/content/small-projects";

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

  it("gallery exhibits are unique and fit the masonry grid", () => {
    const ids = GALLERY.map((g) => g.id);
    expect(new Set(ids).size).toBe(GALLERY.length);
    for (const g of GALLERY) {
      expect(g.label.length).toBeGreaterThan(0);
      expect([1, 2]).toContain(g.colSpan);
      expect([1, 2]).toContain(g.rowSpan);
    }
  });

  it("small projects have the fields the menu renders", () => {
    for (const p of SMALL_PROJECTS) {
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
