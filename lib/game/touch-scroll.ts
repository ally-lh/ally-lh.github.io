/** Finger travel (px) with no native scroll before the fallback steps in. */
export const TAKEOVER_DISTANCE_PX = 10;
/** Coast speed (px/ms) below which momentum just stops. */
const MIN_VELOCITY = 0.02;
/** Fraction of velocity kept per 16ms frame while coasting. */
const FRICTION_PER_FRAME = 0.95;
const FRAME_MS = 16;

export interface GestureState {
  /** Vertical finger travel since touchstart (px, signed). */
  movedPx: number;
  /** Whether the browser scrolled the element itself during this gesture. */
  nativeScrolled: boolean;
}

/**
 * The fallback only drives scrolling when the browser clearly isn't — a real
 * drag happened and no native scroll followed (iOS Safari can refuse to
 * scroll overflow areas that live inside 3D-transformed layers).
 */
export function shouldTakeOver(g: GestureState): boolean {
  return !g.nativeScrolled && Math.abs(g.movedPx) > TAKEOVER_DISTANCE_PX;
}

/** Friction step for the post-release coast; 0 once it's imperceptible. */
export function decayVelocity(velocity: number, dtMs: number): number {
  const next = velocity * FRICTION_PER_FRAME ** (dtMs / FRAME_MS);
  return Math.abs(next) < MIN_VELOCITY ? 0 : next;
}
