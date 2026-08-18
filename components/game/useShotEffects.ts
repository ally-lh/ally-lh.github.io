"use client";

import { useCallback, useEffect, useRef, type RefObject } from "react";
import gsap from "gsap";
import { ACCENT } from "@/lib/theme";

interface ShotArgs {
  from: { x: number; y: number };
  to: { x: number; y: number };
  /** Draw a bullet tracer from the gun (title screen only). */
  tracer: boolean;
  /** Called when the shot lands (after tracer flight). */
  onImpact?: () => void;
}

const SHARD_COUNT = 6;

type TimerSet = Set<ReturnType<typeof setTimeout>>;

function trackTimeout(timers: TimerSet, ms: number, fn: () => void) {
  const id = setTimeout(() => {
    timers.delete(id);
    fn();
  }, ms);
  timers.add(id);
}

function spawnImpact(fx: HTMLElement, x: number, y: number, timers: TimerSet) {
  const d = document.createElement("div");
  d.style.cssText = `position:absolute;left:${x}px;top:${y}px;pointer-events:none`;
  const ring = document.createElement("div");
  ring.style.cssText = `position:absolute;left:0;top:0;width:56px;height:56px;border:3px solid ${ACCENT};border-radius:50%;transform:translate(-50%,-50%)`;
  d.appendChild(ring);
  gsap.fromTo(
    ring,
    { scale: 0.2, opacity: 1 },
    { scale: 1.7, opacity: 0, duration: 0.4, ease: "power1.out" },
  );
  for (let i = 0; i < SHARD_COUNT; i++) {
    const angle = i * (360 / SHARD_COUNT) + Math.random() * 30;
    const shard = document.createElement("span");
    shard.style.cssText = `position:absolute;left:0;top:0;width:18px;height:3px;background:${ACCENT};transform-origin:0 50%;rotate:${angle}deg`;
    d.appendChild(shard);
    gsap.fromTo(
      shard,
      { x: 8, opacity: 1 },
      { x: 52, opacity: 0, duration: 0.38, ease: "power1.out" },
    );
  }
  fx.appendChild(d);
  trackTimeout(timers, 500, () => d.remove());
}

function spawnTracer(
  fx: HTMLElement,
  from: { x: number; y: number },
  to: { x: number; y: number },
  flightMs: number,
) {
  const angle = (Math.atan2(to.y - from.y, to.x - from.x) * 180) / Math.PI;
  const b = document.createElement("div");
  b.style.cssText =
    `position:absolute;left:0;top:0;width:30px;height:4px;margin:-2px 0 0 -15px;border-radius:2px;` +
    `background:linear-gradient(90deg,transparent,${ACCENT} 40%,#fff);box-shadow:0 0 8px ${ACCENT};will-change:transform`;
  fx.appendChild(b);
  gsap.set(b, { x: from.x, y: from.y, rotation: angle });
  gsap.to(b, {
    x: to.x,
    y: to.y,
    duration: flightMs / 1000,
    ease: "none",
    onComplete: () => b.remove(),
  });
}

/**
 * Imperative shot FX (tracer, impact ring/shards, screen shake) rendered
 * into a dedicated fixed overlay so React never re-renders for particles.
 */
export function useShotEffects(
  fxRef: RefObject<HTMLDivElement | null>,
  shakeRef: RefObject<HTMLDivElement | null>,
) {
  const timersRef = useRef<TimerSet>(new Set());

  useEffect(() => {
    const timers = timersRef.current;
    return () => timers.forEach(clearTimeout);
  }, []);

  const fire = useCallback(
    ({ from, to, tracer, onImpact }: ShotArgs) => {
      const fx = fxRef.current;
      const timers = timersRef.current;
      const flight = tracer
        ? gsap.utils.clamp(60, 170, Math.hypot(to.x - from.x, to.y - from.y) / 4)
        : 0;
      if (fx && tracer) spawnTracer(fx, from, to, flight);
      trackTimeout(timers, flight, () => {
        if (fx) spawnImpact(fx, to.x, to.y, timers);
        if (shakeRef.current) {
          gsap.fromTo(
            shakeRef.current,
            { x: -6, y: 4 },
            {
              x: 0,
              y: 0,
              duration: 0.22,
              ease: "elastic.out(1, 0.3)",
            },
          );
        }
        onImpact?.();
      });
    },
    [fxRef, shakeRef],
  );

  return { fire };
}
