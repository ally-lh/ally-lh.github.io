"use client";

import { useEffect, useMemo, useState } from "react";

const MIN_DISPLAY_MS = 1400;

/**
 * Preloads a set of images and reports progress for the boot loader.
 * Failed loads still count as settled (every asset has an SVG fallback),
 * and a minimum display time keeps the loader from blinking on fast
 * connections/caches.
 */
export function useAssetPreload(
  sources: readonly string[],
  minDisplayMs: number = MIN_DISPLAY_MS,
) {
  const [settled, setSettled] = useState(0);
  const [minElapsed, setMinElapsed] = useState(false);
  // Sources are fixed for the lifetime of the stage; freeze the first list
  // so a caller passing a fresh array each render can't restart the load.
  const [frozenSources] = useState(sources);

  useEffect(() => {
    const timer = setTimeout(() => setMinElapsed(true), minDisplayMs);
    let cancelled = false;
    const images = frozenSources.map((src) => {
      const img = new Image();
      const onSettled = () => {
        if (!cancelled) setSettled((n) => n + 1);
      };
      img.onload = onSettled;
      img.onerror = onSettled;
      img.src = src;
      return img;
    });
    return () => {
      cancelled = true;
      clearTimeout(timer);
      images.forEach((img) => {
        img.onload = null;
        img.onerror = null;
      });
    };
  }, [minDisplayMs, frozenSources]);

  return useMemo(() => {
    const total = frozenSources.length;
    const progress = total === 0 ? 100 : Math.round((settled / total) * 100);
    return { progress, done: progress >= 100 && minElapsed };
  }, [settled, minElapsed, frozenSources]);
}
