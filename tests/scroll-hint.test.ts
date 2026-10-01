import { describe, expect, it } from "vitest";
import { canShowScrollHint } from "@/lib/game/scroll-hint";

describe("canShowScrollHint", () => {
  it("is true only when parked at the top of a scrollable area", () => {
    expect(
      canShowScrollHint({ scrollTop: 0, scrollHeight: 1200, clientHeight: 500 }),
    ).toBe(true);
  });

  it("is false once the user has scrolled", () => {
    expect(
      canShowScrollHint({ scrollTop: 1, scrollHeight: 1200, clientHeight: 500 }),
    ).toBe(false);
  });

  it("is false when there is nothing to scroll to", () => {
    expect(
      canShowScrollHint({ scrollTop: 0, scrollHeight: 500, clientHeight: 500 }),
    ).toBe(false);
    expect(
      canShowScrollHint({ scrollTop: 0, scrollHeight: 504, clientHeight: 500 }),
    ).toBe(false);
  });
});
