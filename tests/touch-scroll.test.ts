import { describe, expect, it } from "vitest";
import {
  decayVelocity,
  shouldTakeOver,
  TAKEOVER_DISTANCE_PX,
} from "@/lib/game/touch-scroll";

describe("shouldTakeOver", () => {
  it("leaves the gesture alone while the browser is scrolling natively", () => {
    expect(shouldTakeOver({ movedPx: 80, nativeScrolled: true })).toBe(false);
  });

  it("waits for a deliberate drag before taking over", () => {
    expect(
      shouldTakeOver({ movedPx: TAKEOVER_DISTANCE_PX - 1, nativeScrolled: false }),
    ).toBe(false);
  });

  it("takes over once the finger has clearly moved but nothing scrolled", () => {
    expect(
      shouldTakeOver({ movedPx: TAKEOVER_DISTANCE_PX + 1, nativeScrolled: false }),
    ).toBe(true);
    expect(
      shouldTakeOver({ movedPx: -(TAKEOVER_DISTANCE_PX + 1), nativeScrolled: false }),
    ).toBe(true);
  });
});

describe("decayVelocity", () => {
  it("slows the coast down over time", () => {
    const next = decayVelocity(1, 16);
    expect(next).toBeGreaterThan(0);
    expect(next).toBeLessThan(1);
  });

  it("decays more over a longer frame", () => {
    expect(decayVelocity(1, 32)).toBeLessThan(decayVelocity(1, 16));
  });

  it("stops outright once the coast is imperceptible", () => {
    expect(decayVelocity(0.01, 16)).toBe(0);
    expect(decayVelocity(-0.01, 16)).toBe(0);
  });

  it("keeps the direction of travel", () => {
    expect(decayVelocity(-1, 16)).toBeLessThan(0);
  });
});
