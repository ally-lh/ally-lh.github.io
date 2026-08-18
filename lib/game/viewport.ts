export type ViewportMode = "play" | "rotate" | "too-small";

export interface ViewportInfo {
  mode: ViewportMode;
  /** Global UI scale (0.5–1) applied to fixed-size stage chrome. */
  scale: number;
  /** Phone-sized landscape viewport (very short) — gets extra layout lifts. */
  phone: boolean;
}

/** Below this width a portrait viewport is asked to rotate. */
export const ROTATE_BELOW_WIDTH = 820;
/** Landscape viewports smaller than this just can't host the range. */
export const MIN_LANDSCAPE_WIDTH = 568;
export const MIN_LANDSCAPE_HEIGHT = 250;

/** Reference design size the scale factor is derived from. */
const REF_HEIGHT = 800;
const REF_WIDTH = 1200;
const MIN_SCALE = 0.5;
/** Landscape viewports shorter than this are treated as phones. */
const PHONE_MAX_HEIGHT = 500;

const clamp = (min: number, max: number, v: number) =>
  Math.min(max, Math.max(min, v));

/**
 * Pure viewport classification: decides whether to play, ask for a
 * rotation, or refuse, and how much to shrink the fixed-size UI (gun,
 * dialogue, laptop screen content) so phones/tablets in landscape fit.
 */
export function resolveViewport(width: number, height: number): ViewportInfo {
  if (width <= 0 || height <= 0) return { mode: "play", scale: 1, phone: false }; // SSR
  const portrait = height > width;
  if (portrait && width < ROTATE_BELOW_WIDTH) {
    return { mode: "rotate", scale: 1, phone: false };
  }
  if (
    Math.max(width, height) < MIN_LANDSCAPE_WIDTH ||
    (!portrait && height < MIN_LANDSCAPE_HEIGHT)
  ) {
    return { mode: "too-small", scale: 1, phone: false };
  }
  const scale = clamp(
    MIN_SCALE,
    1,
    Math.min(height / REF_HEIGHT, width / REF_WIDTH),
  );
  return {
    mode: "play",
    scale: Math.round(scale * 100) / 100,
    phone: height < PHONE_MAX_HEIGHT,
  };
}
