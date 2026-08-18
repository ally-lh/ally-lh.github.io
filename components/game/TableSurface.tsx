"use client";

import { ASSETS } from "@/lib/theme";
import { AssetImage } from "@/components/ui/AssetImage";

const GROW_TRANSITION = "transform .9s cubic-bezier(.6,0,.25,1)";

/** Shooting bench under the laptop; zooms in as the laptop boots. */
export function TableSurface({ grown }: { grown: boolean }) {
  return (
    <div
      className="pointer-events-none absolute left-1/2 w-[132vw]"
      style={{
        bottom: "calc(23vh - 39vw)",
        transform: `translateX(-50%) scale(${grown ? 2.1 : 1})`,
        transformOrigin: "50% 57%",
        transition: GROW_TRANSITION,
        filter: "drop-shadow(0 30px 50px rgba(0,0,0,0.55))",
      }}
      aria-hidden
    >
      <AssetImage
        src={ASSETS.table}
        className="block w-full select-none"
        fallback={
          <div
            className="w-full"
            style={{
              height: "34vw",
              background:
                "linear-gradient(#2e2e38 0%, #23232c 12%, #191920 55%, #101016 100%)",
              borderTop: "6px solid #000",
              boxShadow: "inset 0 14px 30px rgba(255,255,255,0.04)",
              clipPath: "polygon(6% 0, 94% 0, 100% 100%, 0 100%)",
            }}
          />
        }
      />
    </div>
  );
}
