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
  /** Small image for the menu card (path under /public or full URL).
   *  Defaults to the first bento image, then `image`. */
  thumbnail?: string;
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
  /** CSS aspect-ratio of the video frame (default "16 / 9"); set it for
   *  portrait recordings so they aren't cropped. */
  aspect?: string;
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
  label: string;
  category: string;
  /** Width / height of the artwork — the tile keeps this ratio. */
  aspect: number;
  /** Higher values are listed first (default 0); ties keep file order. */
  priority?: number;
  /** Optional path under /public. */
  image?: string;
  /** Optional video (path under /public or full URL). Wins over `image`;
   *  autoplays muted on a loop. */
  video?: string;
  imagePlaceholder: string;
}

/** Small side project listed under the case grid on the menu screen. */
export interface SmallProject {
  title: string;
  blurb: string;
  /** Omit when unknown — the row simply shows no year. */
  year?: string;
  tags: readonly string[];
  /** Optional external link. */
  href?: string;
  /** Full-size image (path under /public; animated WebP works) opened in
   *  the lightbox when the row has no `href`. */
  image?: string;
  /** Optional small image shown beside the blurb (path under /public). */
  thumbnail?: string;
}
