import type { GalleryItem } from "@/lib/types";

/**
 * Exhibits in the graphic-design evidence locker. Drop images under
 * /public (e.g. /gallery/poster.png) and set `image` to show them;
 * `colSpan`/`rowSpan` control the masonry tile size (1–2 each).
 */
export const GALLERY: readonly GalleryItem[] = [
  {
    id: "gfx-1",
    num: "E-01",
    label: "POSTER // STATIC BLOOM",
    category: "PRINT",
    colSpan: 2,
    rowSpan: 2,
    imagePlaceholder: "Drop a poster (tall or square)",
  },
  {
    id: "gfx-2",
    num: "E-02",
    label: "LOGO SUITE",
    category: "BRAND",
    colSpan: 1,
    rowSpan: 1,
    imagePlaceholder: "Drop a logo mark",
  },
  {
    id: "gfx-3",
    num: "E-03",
    label: "ZINE SPREAD",
    category: "EDITORIAL",
    colSpan: 1,
    rowSpan: 2,
    imagePlaceholder: "Drop a zine spread",
  },
  {
    id: "gfx-4",
    num: "E-04",
    label: "PACKAGING",
    category: "BRAND",
    colSpan: 1,
    rowSpan: 1,
    imagePlaceholder: "Drop a packaging shot",
  },
  {
    id: "gfx-5",
    num: "E-05",
    label: "TYPE SPECIMEN",
    category: "TYPE",
    colSpan: 2,
    rowSpan: 1,
    imagePlaceholder: "Drop a type specimen (wide)",
  },
  {
    id: "gfx-6",
    num: "E-06",
    label: "PIXEL SPRITES",
    category: "PIXEL",
    colSpan: 1,
    rowSpan: 1,
    imagePlaceholder: "Drop pixel art",
  },
  {
    id: "gfx-7",
    num: "E-07",
    label: "GIG FLYER",
    category: "PRINT",
    colSpan: 1,
    rowSpan: 2,
    imagePlaceholder: "Drop a flyer (tall)",
  },
  {
    id: "gfx-8",
    num: "E-08",
    label: "GAME HUD",
    category: "GAME UI",
    colSpan: 2,
    rowSpan: 1,
    imagePlaceholder: "Drop a HUD screen (wide)",
  },
];
