"use client";

import { useEffect, useState } from "react";
import { resolveViewport, type ViewportInfo } from "@/lib/game/viewport";

const SSR_DEFAULT: ViewportInfo = { mode: "play", scale: 1, phone: false };

/** Tracks window size (including orientation changes) → mode + UI scale. */
export function useViewport(): ViewportInfo {
  const [info, setInfo] = useState<ViewportInfo>(SSR_DEFAULT);

  useEffect(() => {
    const update = () =>
      setInfo((prev) => {
        const next = resolveViewport(window.innerWidth, window.innerHeight);
        return next.mode === prev.mode &&
          next.scale === prev.scale &&
          next.phone === prev.phone
          ? prev
          : next;
      });
    update();
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, []);

  return info;
}
