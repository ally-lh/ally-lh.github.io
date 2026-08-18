import { describe, expect, it } from "vitest";
import { resolveViewport } from "@/lib/game/viewport";

describe("resolveViewport", () => {
  it("plays at full scale on desktop", () => {
    expect(resolveViewport(1440, 900)).toEqual({
      mode: "play",
      scale: 1,
      phone: false,
    });
    expect(resolveViewport(1920, 1080)).toEqual({
      mode: "play",
      scale: 1,
      phone: false,
    });
  });

  it("asks portrait phones and tablets to rotate", () => {
    expect(resolveViewport(390, 844).mode).toBe("rotate"); // iPhone portrait
    expect(resolveViewport(768, 1024).mode).toBe("rotate"); // iPad portrait
    expect(resolveViewport(810, 1080).mode).toBe("rotate"); // iPad 10.9 portrait
  });

  it("plays scaled-down on landscape phones with the phone flag", () => {
    const phone = resolveViewport(844, 390); // iPhone landscape
    expect(phone.mode).toBe("play");
    expect(phone.scale).toBe(0.5); // clamped floor
    expect(phone.phone).toBe(true);
  });

  it("plays moderately scaled on landscape tablets without the phone flag", () => {
    const ipad = resolveViewport(1024, 768); // iPad landscape
    expect(ipad.mode).toBe("play");
    expect(ipad.scale).toBeGreaterThan(0.7);
    expect(ipad.scale).toBeLessThan(1);
    expect(ipad.phone).toBe(false);
  });

  it("refuses genuinely tiny screens", () => {
    expect(resolveViewport(480, 320).mode).toBe("too-small");
    expect(resolveViewport(800, 200).mode).toBe("too-small"); // too flat
  });

  it("defaults to play at SSR (zero dimensions)", () => {
    expect(resolveViewport(0, 0)).toEqual({
      mode: "play",
      scale: 1,
      phone: false,
    });
  });

  it("keeps scale within [0.5, 1]", () => {
    for (const [w, h] of [
      [568, 320],
      [844, 390],
      [1024, 768],
      [1280, 800],
      [2560, 1440],
    ] as const) {
      const { scale } = resolveViewport(w, h);
      expect(scale).toBeGreaterThanOrEqual(0.5);
      expect(scale).toBeLessThanOrEqual(1);
    }
  });
});
