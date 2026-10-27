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

  it("asks portrait phones to rotate", () => {
    expect(resolveViewport(390, 844).mode).toBe("rotate"); // iPhone portrait
    expect(resolveViewport(430, 932).mode).toBe("rotate"); // iPhone Pro Max portrait
  });

  it("plays on portrait tablets without asking to rotate", () => {
    for (const [w, h] of [
      [768, 1024], // iPad mini / 9.7 portrait
      [810, 1080], // iPad 10.2 portrait
      [820, 1180], // iPad Air portrait
      [1024, 1366], // iPad Pro 12.9 portrait
    ] as const) {
      const info = resolveViewport(w, h);
      expect(info.mode).toBe("play");
      expect(info.phone).toBe(false);
      expect(info.scale).toBeGreaterThanOrEqual(0.5);
    }
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
