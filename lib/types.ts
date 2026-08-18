export type ScreenId =
  | "title"
  | "boot"
  | "menu"
  | "case"
  | "gallery"
  | "about"
  | "resume"
  | "contact";

/** Screens rendered inside the laptop display. */
export const LAPTOP_SCREENS: readonly ScreenId[] = [
  "menu",
  "case",
  "gallery",
  "about",
  "resume",
  "contact",
];

export interface CaseFile {
  id: string;
  num: string;
  title: string;
  category: string;
  year: string;
  date: string;
  time: string;
  /** GitHub link — omit to hide the button. */
  repoUrl?: string;
  /** Live demo / deployed site link — omit to hide the button. */
  demoUrl?: string;
  description: string;
  evidence: readonly string[];
  tags: readonly string[];
  /** PIP dialogue line when the case is opened. */
  line: string;
  /** Sealed slot: shown dimmed as "coming soon", not openable. */
  comingSoon?: boolean;
  /** Optional path under /public (e.g. "/work/foo.png") or a full URL. */
  image?: string;
  /** Optional video (path under /public or full URL, e.g. an .mp4 on a
   *  CDN). Takes precedence over `image`; autoplays muted on a loop. */
  video?: string;
  /** Optional bento board of media tiles — wins over `video` and `image`.
   *  Masonry columns: every tile keeps its natural aspect ratio at full
   *  column width, and the board scrolls when it overflows the frame. */
  bento?: readonly CaseMediaTile[];
  /** Bento column count (default 2). */
  bentoCols?: number;
  imagePlaceholder: string;
}

/** One tile of a case's bento media board. */
export interface CaseMediaTile {
  /** Image path under /public or full URL. Shown at natural aspect ratio. */
  src?: string;
  /** Video path/URL — wins over `src`; autoplays muted on a loop. */
  video?: string;
  placeholder?: string;
}

export interface Skill {
  name: string;
  level: number;
  /** Bar width, 0–100. */
  pct: number;
}

export interface Experience {
  role: string;
  org: string;
  dates: string;
  blurb: string;
}

export interface Education {
  title: string;
  org: string;
  dates: string;
}

/** Exhibit in the graphic-design evidence locker (gallery screen). */
export interface GalleryItem {
  id: string;
  /** Exhibit tag, e.g. "E-01". */
  num: string;
  label: string;
  category: string;
  /** Masonry spans on the 4-column / 150px-row grid (1–2 each). */
  colSpan: 1 | 2;
  rowSpan: 1 | 2;
  /** Optional path under /public. */
  image?: string;
  imagePlaceholder: string;
}

/** Small side project listed under the case grid on the menu screen. */
export interface SmallProject {
  title: string;
  blurb: string;
  year: string;
  tags: readonly string[];
  /** Optional external link. */
  href?: string;
}
