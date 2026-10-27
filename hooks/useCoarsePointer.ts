"use client";

import { useEffect, useState } from "react";

const QUERY = "(pointer: coarse)";

/**
 * True on touch-first devices (phones, tablets without a trackpad). Used to
 * drop decorative 3D, which iOS Safari hit-tests and scrolls badly.
 */
export function useCoarsePointer(): boolean {
  const [coarse, setCoarse] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    const update = () => setCoarse(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return coarse;
}
