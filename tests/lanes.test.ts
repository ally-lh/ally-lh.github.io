import { describe, expect, it } from "vitest";
import { pickLane } from "@/lib/game/lanes";

/** Deterministic rand source cycling through the given values. */
const seq = (...values: number[]) => {
  let i = 0;
  return () => values[i++ % values.length];
};

describe("pickLane", () => {
  it("places in the left band when rand < 0.5", () => {
    const lane = pickLane([], 10, seq(0.0, 0.5));
    // 4 + 0.5 * 24 = 16
    expect(lane).toBe(16);
  });

  it("places in the right band when rand >= 0.5", () => {
    const lane = pickLane([], 10, seq(0.9, 0.5));
    // 64 + 0.5 * 22 = 75
    expect(lane).toBe(75);
  });

  it("rejects lanes that overlap existing targets", () => {
    // Candidate 16 collides with taken 14 (|14-16| = 2 <= 10+2), so the
    // picker should keep trying and eventually land on the right band.
    const lane = pickLane([14], 10, seq(0.0, 0.5, 0.9, 0.5));
    expect(lane).toBe(75);
  });

  it("returns null when nothing fits", () => {
    // Every candidate collides: both bands are fully blocked.
    const lane = pickLane([16, 75], 30, seq(0.25, 0.5));
    expect(lane).toBeNull();
  });

  it("always returns lanes inside the two spawn bands", () => {
    for (let i = 0; i < 200; i++) {
      const lane = pickLane([], 5);
      expect(lane).not.toBeNull();
      const inLeft = lane! >= 4 && lane! <= 28;
      const inRight = lane! >= 64 && lane! <= 86;
      expect(inLeft || inRight).toBe(true);
    }
  });
});
