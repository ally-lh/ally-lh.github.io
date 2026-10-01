"use client";

import { useEffect, useState, type RefObject } from "react";
import { canShowScrollHint } from "@/lib/game/scroll-hint";

/** Idle time at the top before the nudge appears. */
const IDLE_MS = 2000;

/**
 * "Scroll for more" nudge state for a scrollable element: shows after the
 * user has sat at the top for a moment, hides the instant they scroll, and
 * re-arms if they come back to the top.
 */
export function useScrollHint(ref: RefObject<HTMLElement | null>): boolean {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const arm = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (canShowScrollHint(el)) setVisible(true);
      }, IDLE_MS);
    };
    const onScroll = () => {
      setVisible(false);
      if (canShowScrollHint(el)) arm();
      else clearTimeout(timer);
    };

    arm();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      el.removeEventListener("scroll", onScroll);
    };
  }, [ref]);

  return visible;
}
