import { describe, expect, it } from "vitest";
import {
  gameReducer,
  initialGameState,
  isLaptopScreen,
  nextPlayableIndex,
  type GameState,
} from "@/lib/game/machine";

const at = (partial: Partial<GameState>): GameState => ({
  ...initialGameState,
  ...partial,
});

describe("gameReducer", () => {
  it("boots only from the title screen", () => {
    expect(gameReducer(initialGameState, { type: "START_BOOT" }).screen).toBe(
      "boot",
    );
    const onMenu = at({ screen: "menu" });
    expect(gameReducer(onMenu, { type: "START_BOOT" })).toBe(onMenu);
  });

  it("grows only during boot", () => {
    expect(gameReducer(at({ screen: "boot" }), { type: "GROW" }).grown).toBe(true);
    expect(gameReducer(initialGameState, { type: "GROW" }).grown).toBe(false);
  });

  it("completes boot into the menu", () => {
    const next = gameReducer(at({ screen: "boot" }), { type: "BOOT_COMPLETE" });
    expect(next).toEqual(at({ screen: "menu", grown: true }));
    // BOOT_COMPLETE from anywhere else is a no-op
    const onTitle = initialGameState;
    expect(gameReducer(onTitle, { type: "BOOT_COMPLETE" })).toBe(onTitle);
  });

  it("navigates and preserves caseIdx unless given one", () => {
    const onCase = at({ screen: "case", caseIdx: 3, grown: true });
    const toAbout = gameReducer(onCase, { type: "NAVIGATE", screen: "about" });
    expect(toAbout).toEqual(at({ screen: "about", caseIdx: 3, grown: true }));
    const toCase5 = gameReducer(onCase, {
      type: "NAVIGATE",
      screen: "case",
      caseIdx: 5,
    });
    expect(toCase5.caseIdx).toBe(5);
  });

  it("collapses the laptop when navigating to title", () => {
    const next = gameReducer(at({ screen: "menu", grown: true }), {
      type: "NAVIGATE",
      screen: "title",
    });
    expect(next.grown).toBe(false);
    expect(next.screen).toBe("title");
  });

  it("never navigates into boot directly", () => {
    const onMenu = at({ screen: "menu", grown: true });
    expect(gameReducer(onMenu, { type: "NAVIGATE", screen: "boot" })).toBe(onMenu);
  });

  it("cycles cases with wraparound", () => {
    const onLast = at({ screen: "case", caseIdx: 5, grown: true });
    expect(gameReducer(onLast, { type: "NEXT_CASE", totalCases: 6 }).caseIdx).toBe(0);
    const notOnCase = at({ screen: "menu" });
    expect(gameReducer(notOnCase, { type: "NEXT_CASE", totalCases: 6 })).toBe(
      notOnCase,
    );
  });

  it("power down resets to the initial state", () => {
    const deep = at({ screen: "resume", caseIdx: 4, grown: true });
    expect(gameReducer(deep, { type: "POWER_DOWN" })).toEqual(initialGameState);
  });

  it("does not mutate the previous state", () => {
    const before = at({ screen: "boot" });
    const frozen = Object.freeze({ ...before });
    gameReducer(before, { type: "BOOT_COMPLETE" });
    expect(before).toEqual(frozen);
  });
});

describe("nextPlayableIndex", () => {
  const locked = [false, false, false, false, false, true]; // case 06 sealed

  it("advances to the next open case", () => {
    expect(nextPlayableIndex(locked, 0)).toBe(1);
  });

  it("skips sealed cases and wraps around", () => {
    expect(nextPlayableIndex(locked, 4)).toBe(0);
  });

  it("returns the current index when everything else is locked", () => {
    expect(nextPlayableIndex([true, false, true], 1)).toBe(1);
  });
});

describe("isLaptopScreen", () => {
  it("classifies screens", () => {
    expect(isLaptopScreen("menu")).toBe(true);
    expect(isLaptopScreen("case")).toBe(true);
    expect(isLaptopScreen("title")).toBe(false);
    expect(isLaptopScreen("boot")).toBe(false);
  });
});
