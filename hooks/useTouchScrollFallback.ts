"use client";

import { useEffect, type RefObject } from "react";
import { decayVelocity, shouldTakeOver } from "@/lib/game/touch-scroll";

/** Nearest ancestor (inside root) that can actually scroll vertically. */
function findScroller(from: EventTarget | null, root: HTMLElement): HTMLElement | null {
  for (let el = from as HTMLElement | null; el && el !== root; el = el.parentElement) {
    const { overflowY } = getComputedStyle(el);
    if (
      (overflowY === "auto" || overflowY === "scroll") &&
      el.scrollHeight > el.clientHeight + 1
    ) {
      return el;
    }
  }
  return null;
}

/** Screen px → the element's own px (the laptop screen is CSS-scaled). */
function screenToElementScale(el: HTMLElement): number {
  const rendered = el.getBoundingClientRect().height;
  return rendered > 0 && el.offsetHeight > 0 ? el.offsetHeight / rendered : 1;
}

/**
 * Safety net for touch scrolling inside the laptop: if a vertical drag on a
 * scroll area produces no native scroll, drive scrollTop by hand (with a
 * flick coast on release). Where native scrolling works it never engages.
 */
export function useTouchScrollFallback(rootRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let scroller: HTMLElement | null = null;
    let startY = 0;
    let lastY = 0;
    let lastT = 0;
    let velocity = 0; // element px per ms
    let nativeScrolled = false;
    let takenOver = false;
    let ratio = 1;
    let coastFrame = 0;

    const stopCoast = () => cancelAnimationFrame(coastFrame);
    const onNativeScroll = () => {
      if (!takenOver) nativeScrolled = true;
    };

    const onStart = (e: TouchEvent) => {
      stopCoast();
      scroller?.removeEventListener("scroll", onNativeScroll);
      scroller = e.touches.length === 1 ? findScroller(e.target, root) : null;
      if (!scroller) return;
      startY = lastY = e.touches[0].clientY;
      lastT = e.timeStamp;
      velocity = 0;
      nativeScrolled = false;
      takenOver = false;
      ratio = screenToElementScale(scroller);
      scroller.addEventListener("scroll", onNativeScroll, { passive: true });
    };

    const onMove = (e: TouchEvent) => {
      if (!scroller || e.touches.length !== 1) return;
      const y = e.touches[0].clientY;
      if (!takenOver) {
        takenOver = shouldTakeOver({ movedPx: y - startY, nativeScrolled });
        if (!takenOver) {
          lastY = y;
          lastT = e.timeStamp;
          return;
        }
      }
      const delta = (lastY - y) * ratio;
      const dt = Math.max(1, e.timeStamp - lastT);
      scroller.scrollTop += delta;
      velocity = delta / dt;
      lastY = y;
      lastT = e.timeStamp;
    };

    const onEnd = () => {
      const el = scroller;
      scroller?.removeEventListener("scroll", onNativeScroll);
      if (!el || !takenOver || velocity === 0) return;
      let prev = performance.now();
      const step = (now: number) => {
        const dt = now - prev;
        prev = now;
        velocity = decayVelocity(velocity, dt);
        if (velocity === 0) return;
        el.scrollTop += velocity * dt;
        coastFrame = requestAnimationFrame(step);
      };
      coastFrame = requestAnimationFrame(step);
    };

    const opts = { passive: true } as const;
    root.addEventListener("touchstart", onStart, opts);
    root.addEventListener("touchmove", onMove, opts);
    root.addEventListener("touchend", onEnd, opts);
    root.addEventListener("touchcancel", onEnd, opts);
    return () => {
      stopCoast();
      scroller?.removeEventListener("scroll", onNativeScroll);
      root.removeEventListener("touchstart", onStart);
      root.removeEventListener("touchmove", onMove);
      root.removeEventListener("touchend", onEnd);
      root.removeEventListener("touchcancel", onEnd);
    };
  }, [rootRef]);
}
