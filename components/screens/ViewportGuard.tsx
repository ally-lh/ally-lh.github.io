"use client";

import type { ViewportInfo } from "@/lib/game/viewport";

/** Simple phone outline that tips into landscape on a loop. */
function RotatingPhone() {
  return (
    <div
      className="relative h-[92px] w-[52px] rounded-[8px] border-[3px] border-ink"
      style={{ animation: "rotate-hint 2.6s ease-in-out infinite" }}
    >
      <div className="absolute left-1/2 top-[6px] h-[3px] w-4 -translate-x-1/2 rounded bg-ink" />
      <div className="absolute inset-x-[6px] top-[16px] bottom-[14px] border border-line-2 bg-panel" />
      <div className="absolute bottom-[4px] left-1/2 h-[6px] w-[6px] -translate-x-1/2 rounded-full border border-ink" />
    </div>
  );
}

/**
 * Blocks the stage when the viewport can't host it: portrait devices are
 * asked to rotate; genuinely tiny screens get a friendly refusal.
 */
export function ViewportGuard({ info }: { info: ViewportInfo }) {
  if (info.mode === "play") return null;

  return (
    <div className="fixed inset-0 z-200 flex flex-col items-center justify-center gap-[18px] bg-bg p-8 text-center">
      {info.mode === "rotate" ? (
        <>
          <RotatingPhone />
          <div className="font-[family-name:var(--font-display)] text-[28px] tracking-[2px] text-ink">
            ROTATE YOUR DEVICE
          </div>
          <p className="m-0 max-w-[36ch] font-mono text-[13px] leading-[1.8] tracking-[1px] text-muted">
            THIS PORTFOLIO IS A SHOOTING RANGE &#8212; IT PLAYS IN LANDSCAPE.
            TURN YOUR DEVICE SIDEWAYS TO ENTER.
          </p>
        </>
      ) : (
        <>
          <div className="h-[30px] w-[30px] rotate-45 bg-accent" />
          <div className="font-[family-name:var(--font-display)] text-[30px] tracking-[2px] text-ink">
            SCREEN TOO SMALL
          </div>
          <p className="m-0 max-w-[34ch] font-mono text-[13px] leading-[1.8] tracking-[1px] text-muted">
            THIS PORTFOLIO IS A SHOOTING RANGE. IT NEEDS A BIGGER SCREEN
            &#8212; COME BACK ON A LARGER DEVICE.
          </p>
        </>
      )}
    </div>
  );
}
