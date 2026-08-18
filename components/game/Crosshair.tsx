"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/** Custom cursor: accent ring with ticks, snapped to the pointer via GSAP. */
export function Crosshair() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const xTo = gsap.quickTo(el, "x", { duration: 0.08, ease: "power2.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.08, ease: "power2.out" });
    const move = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed left-0 top-0 z-100 will-change-transform"
      aria-hidden
    >
      <div
        className="absolute -left-[19px] -top-[19px] h-[38px] w-[38px] rounded-full border-2 border-accent"
        style={{
          borderTopColor: "transparent",
          animation: "ch-spin 3s linear infinite",
        }}
      />
      <div className="absolute -left-0.5 -top-0.5 h-1 w-1 rounded-full bg-accent" />
      <div className="absolute -left-7 -top-px h-0.5 w-3 bg-ink" />
      <div className="absolute left-4 -top-px h-0.5 w-3 bg-ink" />
      <div className="absolute -left-px -top-7 h-3 w-0.5 bg-ink" />
      <div className="absolute -left-px top-4 h-3 w-0.5 bg-ink" />
    </div>
  );
}
