"use client";

import { useState } from "react";
import { usePipSprite } from "@/hooks/usePipSprite";
import { PIP_FRAMES } from "@/lib/theme";

/** Fallback pixel face used if the sprite frames are missing. */
function PipFace() {
  return (
    <div className="relative mt-[3px] h-12 w-12 shrink-0 border-2 border-accent bg-bg">
      <span className="absolute left-[10px] top-[14px] h-[7px] w-[7px] bg-accent" />
      <span className="absolute right-[10px] top-[14px] h-[7px] w-[7px] bg-accent" />
      <span
        className="absolute bottom-[11px] left-[13px] h-[3px] w-[22px] bg-ink"
        style={{ transform: "skew(-14deg)" }}
      />
    </div>
  );
}

/**
 * Animated PIP sprite: all frames stay mounted (so there's no flicker on
 * frame swaps) and the active one is shown. Talking alternates frames
 * 1–2; idle plays the 2→3→4→3→2 blink via usePipSprite.
 */
function PipSprite({
  talking,
  onMissing,
}: {
  talking: boolean;
  onMissing: () => void;
}) {
  const frame = usePipSprite(talking);
  return (
    <div className="pointer-events-none absolute bottom-3 left-4 h-[123px] w-[108px]">
      {PIP_FRAMES.map((src, i) => (
        // eslint-disable-next-line @next/next/no-img-element -- pixel sprite frames, all pre-mounted
        <img
          key={src}
          src={src}
          alt=""
          draggable={false}
          onError={i === 0 ? onMissing : undefined}
          className="absolute inset-0 h-full w-full object-contain"
          style={{
            imageRendering: "pixelated",
            opacity: frame === i + 1 ? 1 : 0,
          }}
        />
      ))}
    </div>
  );
}

interface DialogueBoxProps {
  text: string;
  /** True while the typewriter is mid-line (drives the talking frames). */
  typing: boolean;
}

/** Bottom-center dialogue bar for PIP, the court-record AI. */
export function DialogueBox({ text, typing }: DialogueBoxProps) {
  const [spriteMissing, setSpriteMissing] = useState(false);
  const useSprite = !spriteMissing;

  return (
    <div
      data-shield
      // z-96 keeps PIP above the gun (z-95) on tablets/phones where they overlap.
      className="pointer-events-none fixed bottom-[26px] left-1/2 z-96 -translate-x-1/2"
      style={{ width: "min(calc(880px * var(--ui-scale, 1)), 92vw)" }}
    >
      <div
        className="relative flex items-start gap-4 border-2 border-line-2 px-[22px] pb-4 pt-3.5"
        style={{
          background: "rgba(17,17,23,0.92)",
          borderLeft: "6px solid var(--accent)",
          // Scale the box contents while the outer keeps viewport geometry.
          width: "calc(100% / var(--ui-scale, 1))",
          transform: "scale(var(--ui-scale, 1))",
          transformOrigin: "0 100%",
        }}
      >
        {useSprite ? (
          <>
            {/* spacer reserving room for the overlapping sprite */}
            <div className="w-[104px] shrink-0" />
            <PipSprite
              talking={typing}
              onMissing={() => setSpriteMissing(true)}
            />
          </>
        ) : (
          <PipFace />
        )}
        <div className="min-w-0 flex-1">
          <div className="mono-label mb-[7px] text-[11px] text-accent">
            &#9670; ALLY001 // RECORD AI
          </div>
          <div className="min-h-6 text-base leading-normal text-ink">
            {text}
            <span
              className="ml-[3px] inline-block h-4 w-[9px] bg-accent align-[-2px]"
              style={{ animation: "blink-caret 1s step-end infinite" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
