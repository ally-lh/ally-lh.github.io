"use client";

import { ASSETS } from "@/lib/theme";
import { AssetImage } from "@/components/ui/AssetImage";

/**
 * Shooting-range backdrop. Uses /assets/range-bg.png when present, with a
 * pure-CSS range scene as fallback. This layer is the swap point for a
 * future react-three-fiber canvas — keep it presentation-only.
 */
export function Backdrop() {
  return (
    <div className="absolute inset-0" aria-hidden>
      {/* CSS fallback scene (always painted; image covers it when present) */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(#101018 0%, #14141d 46%, #1a1a24 60%, #101016 100%)",
        }}
      />
      {/* lane dividers */}
      <div
        className="absolute inset-x-0 top-[18%] bottom-[30%]"
        style={{
          background:
            "repeating-linear-gradient(90deg, transparent 0 24vw, rgba(0,0,0,0.5) 24vw calc(24vw + 6px))",
        }}
      />
      {/* ceiling light strips */}
      <div
        className="absolute inset-x-0 top-0 h-[16%]"
        style={{
          background:
            "repeating-linear-gradient(90deg, transparent 0 18vw, rgba(255,255,255,0.05) 18vw calc(18vw + 8vw))",
        }}
      />
      <AssetImage
        src={ASSETS.rangeBg}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition: "center bottom" }}
      />
      {/* dimming overlay from the original design */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(rgba(11,11,16,0.38), rgba(11,11,16,0.62))",
        }}
      />
    </div>
  );
}
