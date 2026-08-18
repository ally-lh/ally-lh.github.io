/**
 * Single source of truth for the accent color, injected as the `--accent`
 * CSS variable on the stage root and used directly by imperative GSAP
 * effects (tracers, impact shards) that can't read CSS variables cheaply.
 */
export const ACCENT = "#ff2e63";

/** Stage background — matches --bg in globals.css. */
export const STAGE_BG = "#0b0b10";

/** Central registry of binary art assets (all optional, SVG fallbacks exist). */
export const ASSETS = {
  gun: "/assets/gun.png",
  table: "/assets/table.png",
  target: "/assets/targets.png",
  rangeBg: "/assets/bgRange.png",
} as const;

/**
 * PIP's dialogue sprite frames (36×41 pixel art), in frame order:
 * 1–2 alternate while talking, 2→3→4→3→2 plays as the idle blink.
 */
export const PIP_FRAMES = [
  "/assets/sprite1.png",
  "/assets/sprite2.png",
  "/assets/sprite3.png",
  "/assets/sprite4.png",
] as const;

// Viewport thresholds (rotate prompt, minimum sizes, UI scale) live in
// lib/game/viewport.ts alongside the pure resolver.
