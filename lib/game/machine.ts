import { LAPTOP_SCREENS, type ScreenId } from "@/lib/types";

export interface GameState {
  screen: ScreenId;
  caseIdx: number;
  /** Laptop has expanded to full display size (staged ~1s into boot). */
  grown: boolean;
}

export type GameAction =
  | { type: "START_BOOT" }
  | { type: "GROW" }
  | { type: "BOOT_COMPLETE" }
  | { type: "NAVIGATE"; screen: ScreenId; caseIdx?: number }
  | { type: "NEXT_CASE"; totalCases: number }
  | { type: "POWER_DOWN" };

export const initialGameState: GameState = {
  screen: "title",
  caseIdx: 0,
  grown: false,
};

export function isLaptopScreen(screen: ScreenId): boolean {
  return LAPTOP_SCREENS.includes(screen);
}

/**
 * Next openable case index after `from`, skipping locked (coming-soon)
 * slots; returns `from` if nothing else is playable.
 */
export function nextPlayableIndex(
  locked: readonly boolean[],
  from: number,
): number {
  const n = locked.length;
  for (let step = 1; step <= n; step++) {
    const idx = (from + step) % n;
    if (!locked[idx]) return idx;
  }
  return from;
}

/**
 * Pure transition function. Timing (boot delays, wipe overlap) lives in
 * useGame — this only answers "given this event, what is the next state".
 */
export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "START_BOOT":
      return state.screen === "title" ? { ...state, screen: "boot" } : state;
    case "GROW":
      return state.screen === "boot" ? { ...state, grown: true } : state;
    case "BOOT_COMPLETE":
      return state.screen === "boot"
        ? { ...state, screen: "menu", grown: true }
        : state;
    case "NAVIGATE": {
      if (action.screen === "boot") return state;
      const caseIdx = action.caseIdx ?? state.caseIdx;
      return {
        screen: action.screen,
        caseIdx,
        grown: action.screen === "title" ? false : state.grown,
      };
    }
    case "NEXT_CASE": {
      if (state.screen !== "case" || action.totalCases <= 0) return state;
      return { ...state, caseIdx: (state.caseIdx + 1) % action.totalCases };
    }
    case "POWER_DOWN":
      return { ...initialGameState };
    default:
      return state;
  }
}
