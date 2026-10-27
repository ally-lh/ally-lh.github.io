/** Finger travel (px) beyond which a touch is a swipe, not a tap. */
export const TAP_SLOP_PX = 10;

export interface Point {
  x: number;
  y: number;
}

/** A touch only "fires" if it lifted roughly where it landed. */
export function isTap(down: Point, up: Point): boolean {
  return Math.hypot(up.x - down.x, up.y - down.y) < TAP_SLOP_PX;
}
