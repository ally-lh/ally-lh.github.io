"use client";

import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { CASES } from "@/lib/content/cases";
import { SCREEN_LINES, STRAY_SHOT_LINE } from "@/lib/content/dialogue";
import {
  gameReducer,
  initialGameState,
  isLaptopScreen,
  nextPlayableIndex,
} from "@/lib/game/machine";
import type { ScreenId } from "@/lib/types";
import { useTypewriter } from "./useTypewriter";

const BOOT_GROW_MS = 1000;
const BOOT_DONE_MS = 3600;
const WIPE_TOTAL_MS = 480;
const WIPE_SWAP_MS = 200;
const SHOT_REACT_MS = 240;

function lineFor(screen: ScreenId, caseIdx: number): string {
  if (screen === "case") return CASES[caseIdx]?.line ?? "";
  return SCREEN_LINES[screen] ?? "";
}

/**
 * Central game orchestration: owns the screen state machine, transition
 * timing (boot sequence, CRT wipe) and the PIP dialogue line.
 *
 * @param ready gates the opening dialogue/deep-link until the boot
 *              loader has revealed the stage (defaults to true).
 */
export function useGame(ready: boolean = true) {
  const [state, dispatch] = useReducer(gameReducer, initialGameState);
  const [wiping, setWiping] = useState(false);
  const { typed, typing, say } = useTypewriter();
  const timersRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());
  const screenRef = useRef(state.screen);
  // Each user action bumps the generation; deferred transition steps from a
  // superseded action (rapid clicks, stray-shot power down) become no-ops.
  const genRef = useRef(0);

  // Keep a ref of the current screen so delayed transitions (wipe timing)
  // can read fresh state without re-creating callbacks.
  useEffect(() => {
    screenRef.current = state.screen;
  }, [state.screen]);

  const after = useCallback((ms: number, fn: () => void) => {
    const id = setTimeout(() => {
      timersRef.current.delete(id);
      fn();
    }, ms);
    timersRef.current.add(id);
  }, []);

  useEffect(() => {
    const timers = timersRef.current;
    return () => timers.forEach(clearTimeout);
  }, []);

  /** Greet once revealed; honor `?screen=` deep links (dev shortcut). */
  const greetedRef = useRef(false);
  useEffect(() => {
    if (!ready || greetedRef.current) return;
    greetedRef.current = true;
    const requested = new URLSearchParams(window.location.search).get("screen");
    if (requested && isLaptopScreen(requested as ScreenId)) {
      const screen = requested as ScreenId;
      dispatch({ type: "START_BOOT" });
      dispatch({ type: "BOOT_COMPLETE" });
      dispatch({ type: "NAVIGATE", screen });
      say(lineFor(screen, 0));
      return;
    }
    say(lineFor("title", 0));
  }, [ready, say]);

  const navigate = useCallback(
    (screen: ScreenId, caseIdx?: number, line?: string) => {
      const gen = ++genRef.current;
      const current = () => genRef.current === gen;
      const apply = () => {
        if (!current()) return;
        dispatch({ type: "NAVIGATE", screen, caseIdx });
        say(line ?? lineFor(screen, caseIdx ?? 0));
      };
      // Beat between the shot landing and the screen reacting.
      after(SHOT_REACT_MS, () => {
        if (!current()) return;
        const from = screenRef.current;
        const withWipe =
          isLaptopScreen(from) && isLaptopScreen(screen) && from !== screen;
        if (!withWipe) {
          apply();
          return;
        }
        setWiping(true);
        after(WIPE_SWAP_MS, apply);
        after(WIPE_TOTAL_MS, () => {
          if (current()) setWiping(false);
        });
      });
    },
    [after, say],
  );

  const startBoot = useCallback(() => {
    if (screenRef.current !== "title") return;
    const gen = ++genRef.current;
    const current = () => genRef.current === gen;
    after(SHOT_REACT_MS, () => {
      if (!current() || screenRef.current !== "title") return;
      dispatch({ type: "START_BOOT" });
      say(lineFor("boot", 0));
      after(BOOT_GROW_MS, () => {
        if (current()) dispatch({ type: "GROW" });
      });
      after(BOOT_DONE_MS, () => {
        if (!current()) return;
        dispatch({ type: "BOOT_COMPLETE" });
        say(lineFor("menu", 0));
      });
    });
  }, [after, say]);

  const powerDown = useCallback(() => {
    genRef.current++;
    setWiping(false);
    dispatch({ type: "POWER_DOWN" });
    say(STRAY_SHOT_LINE);
  }, [say]);

  const openCase = useCallback(
    (idx: number) => {
      if (CASES[idx]?.comingSoon) return;
      navigate("case", idx, CASES[idx]?.line);
    },
    [navigate],
  );

  const nextCase = useCallback(() => {
    const idx = nextPlayableIndex(
      CASES.map((c) => !!c.comingSoon),
      state.caseIdx,
    );
    navigate("case", idx, CASES[idx]?.line);
  }, [navigate, state.caseIdx]);

  return {
    state,
    wiping,
    dialogue: typed,
    dialogueTyping: typing,
    navigate,
    startBoot,
    powerDown,
    openCase,
    nextCase,
  };
}

export type GameApi = ReturnType<typeof useGame>;
