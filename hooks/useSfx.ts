"use client";

import { useCallback, useRef } from "react";

interface WebkitWindow extends Window {
  webkitAudioContext?: typeof AudioContext;
}

/** Tiny WebAudio laser-pew used on every shot. No assets required. */
export function useSfx(enabled: boolean = true) {
  const ctxRef = useRef<AudioContext | null>(null);

  const pew = useCallback(() => {
    if (!enabled) return;
    try {
      const Ctor =
        window.AudioContext ?? (window as WebkitWindow).webkitAudioContext;
      if (!Ctor) return;
      ctxRef.current = ctxRef.current ?? new Ctor();
      const ctx = ctxRef.current;
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(760, t);
      osc.frequency.exponentialRampToValueAtTime(110, t + 0.12);
      gain.gain.setValueAtTime(0.1, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.16);
    } catch {
      // Audio is a nice-to-have; never let it break a shot.
    }
  }, [enabled]);

  return { pew };
}
