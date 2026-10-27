import { describe, expect, it } from "vitest";
import { isTap, TAP_SLOP_PX } from "@/lib/game/tap";

describe("isTap", () => {
  it("counts a touch that lifts where it landed as a tap", () => {
    expect(isTap({ x: 100, y: 100 }, { x: 100, y: 100 })).toBe(true);
  });

  it("tolerates a little finger wobble", () => {
    expect(isTap({ x: 100, y: 100 }, { x: 100 + TAP_SLOP_PX - 1, y: 100 })).toBe(true);
  });

  it("treats a vertical swipe as a scroll, not a tap", () => {
    expect(isTap({ x: 100, y: 300 }, { x: 100, y: 120 })).toBe(false);
  });

  it("treats a diagonal drag past the slop as a scroll", () => {
    expect(isTap({ x: 0, y: 0 }, { x: TAP_SLOP_PX, y: TAP_SLOP_PX })).toBe(false);
  });
});
