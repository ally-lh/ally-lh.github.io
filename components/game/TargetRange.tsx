"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { pickLane } from "@/lib/game/lanes";
import { ASSETS } from "@/lib/theme";
import { AssetImage } from "@/components/ui/AssetImage";
import { TargetArt } from "./art/TargetArt";

interface TargetSpec {
  id: number;
  leftPct: number;
  width: number;
}

const SPAWN_INTERVAL_MS = 3200;
const SPAWN_CHANCE = 0.55;
const MAX_TARGETS = 3;
/** Spawned paper width: base range (scaled down with the UI) + hard cap. */
const TARGET_MIN_WIDTH = 170;
const TARGET_WIDTH_JITTER = 80;
const TARGET_MAX_WIDTH = 240;
const RISE_MS = 1350;
const REMOVE_AFTER_SHOT_MS = 1400;

type Phase = "hidden" | "up" | "leaving";

interface HitPoint {
  /** -0.5..0.5 across the paper. */
  x: number;
  /** 0..1 down the paper. */
  y: number;
}

function Target({
  spec,
  retract,
  onGone,
}: {
  spec: TargetSpec;
  /** Range is shutting down (e.g. leaving the title screen) — slide away. */
  retract: boolean;
  onGone: (id: number) => void;
}) {
  const [phase, setPhase] = useState<Phase>("hidden");
  const [hit, setHit] = useState<HitPoint | null>(null);
  const paperRef = useRef<HTMLDivElement>(null);

  // Rise on mount, retreat automatically if never shot.
  useEffect(() => {
    const raf = requestAnimationFrame(() =>
      requestAnimationFrame(() =>
        setPhase((p) => (p === "hidden" ? "up" : p)),
      ),
    );
    const stay = 3600 + Math.random() * 3400;
    const leave = setTimeout(() => setPhase("leaving"), RISE_MS + stay);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(leave);
    };
  }, []);

  // Slide back down (not pop out) when the range deactivates.
  useEffect(() => {
    if (retract) setPhase("leaving");
  }, [retract]);

  useEffect(() => {
    if (phase !== "leaving") return;
    const t = setTimeout(() => onGone(spec.id), REMOVE_AFTER_SHOT_MS);
    return () => clearTimeout(t);
  }, [phase, onGone, spec.id]);

  const shoot = useCallback(
    (e: React.PointerEvent) => {
      if (hit || phase === "leaving") return;
      const r = paperRef.current?.getBoundingClientRect();
      setHit(
        r
          ? {
              x: (e.clientX - r.left) / r.width - 0.5,
              y: (e.clientY - r.top) / r.height,
            }
          : { x: 0, y: 0.5 },
      );
      setPhase("leaving");
    },
    [hit, phase],
  );

  const raised = phase === "up";
  const postTransition = hit
    ? `transform .8s .45s cubic-bezier(.5,0,.7,.4)`
    : `transform ${RISE_MS}ms cubic-bezier(.3,1,.45,1)`;

  return (
    <div
      className="absolute bottom-0"
      data-target
      onPointerDown={shoot}
      style={{
        left: `${spec.leftPct}%`,
        width: spec.width,
        pointerEvents: "auto",
        transformOrigin: "50% 100%",
        transform: raised ? "translateY(0%)" : "translateY(calc(100% + 14vw))",
        transition: postTransition,
        willChange: "transform",
      }}
    >
      <div
        ref={paperRef}
        style={{
          transformOrigin: "50% 100%",
          willChange: "transform",
          transition: hit
            ? "transform .6s cubic-bezier(.35,0,.8,.45), opacity .45s .2s"
            : undefined,
          transform: hit
            ? `rotateX(${Math.round(80 + (1 - hit.y) * 30)}deg) rotateZ(${Math.round(hit.x * -35)}deg)`
            : undefined,
          opacity: hit ? 0 : 1,
        }}
      >
        <AssetImage
          src={ASSETS.target}
          className="pointer-events-none block w-full"
          style={{ imageRendering: "pixelated" }}
          fallback={<TargetArt />}
        />
      </div>
      {/* pole */}
      <div
        className="pointer-events-none absolute left-1/2 top-[99%] -translate-x-1/2"
        style={{
          width: Math.max(8, Math.round(spec.width * 0.05)),
          height: "60vh",
          background: "linear-gradient(#3a3a42, #1c1c22 60%)",
          borderLeft: "2px solid #000",
          borderRight: "2px solid #000",
        }}
      />
      {/* clamp */}
      <div
        className="pointer-events-none absolute left-1/2 top-[98%] -translate-x-1/2 border-2 border-black bg-[#26262e]"
        style={{
          width: Math.round(spec.width * 0.34),
          height: Math.max(8, Math.round(spec.width * 0.06)),
        }}
      />
    </div>
  );
}

interface TargetRangeProps {
  active: boolean;
  /** UI scale — shrinks spawned targets on small viewports. */
  scale?: number;
}

/**
 * Pop-up practice targets behind the bench, active on the title screen.
 * Setting `active` to false retracts everything (targets phase out on
 * their own timers and unmount).
 */
export function TargetRange({ active, scale = 1 }: TargetRangeProps) {
  const [targets, setTargets] = useState<readonly TargetSpec[]>([]);
  const nextId = useRef(0);
  const hostRef = useRef<HTMLDivElement>(null);

  const remove = useCallback((id: number) => {
    setTargets((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    if (!active) return;
    const spawn = () => {
      setTargets((prev) => {
        if (prev.length >= MAX_TARGETS) return prev;
        const hostWidth = hostRef.current?.clientWidth || window.innerWidth;
        const width = Math.min(
          (TARGET_MIN_WIDTH + Math.random() * TARGET_WIDTH_JITTER) * scale,
          TARGET_MAX_WIDTH,
        );
        const lane = pickLane(
          prev.map((t) => t.leftPct),
          (width / hostWidth) * 100,
        );
        if (lane === null) return prev;
        return [...prev, { id: nextId.current++, leftPct: lane, width }];
      });
    };
    const first = setTimeout(spawn, 1500);
    const interval = setInterval(() => {
      if (Math.random() < SPAWN_CHANCE) spawn();
    }, SPAWN_INTERVAL_MS);
    return () => {
      clearTimeout(first);
      clearInterval(interval);
      // Live targets are NOT cleared here — they get `retract` and slide
      // down on their own, removing themselves via onGone.
    };
  }, [active, scale]);

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 bottom-[20vh] overflow-hidden">
      <div
        ref={hostRef}
        className="absolute inset-x-0 h-0"
        style={{ bottom: "calc(3vh + 7vw)", perspective: 900 }}
      >
        {targets.map((t) => (
          <Target key={t.id} spec={t} retract={!active} onGone={remove} />
        ))}
      </div>
    </div>
  );
}
