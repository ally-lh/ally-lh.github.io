"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/** Subtle pointer-driven parallax tilt for the whole 3D scene. */
export function TiltLayer({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rxTo = gsap.quickTo(el, "rotationX", { duration: 0.3, ease: "power2.out" });
    const ryTo = gsap.quickTo(el, "rotationY", { duration: 0.3, ease: "power2.out" });
    const move = (e: PointerEvent) => {
      rxTo(-(e.clientY / window.innerHeight - 0.5) * 5);
      ryTo((e.clientX / window.innerWidth - 0.5) * 7);
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);

  return (
    <div className="absolute inset-0" style={{ perspective: 1300 }}>
      <div
        ref={ref}
        className="absolute inset-0 will-change-transform"
        style={{ transformStyle: "preserve-3d" }}
      >
        {children}
      </div>
    </div>
  );
}
