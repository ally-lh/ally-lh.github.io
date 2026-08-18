"use client";

import { SITE } from "@/lib/content/site";
import { ScreenWipe } from "./ScreenWipe";

const EASE = "cubic-bezier(.6,0,.25,1)";
const GROW = `.9s ${EASE}`;

interface LaptopProps {
  /** Lid open (any screen except title). */
  open: boolean;
  /** Expanded to full display size (staged during boot). */
  grown: boolean;
  /** Screen-switch wipe overlay. */
  wiping: boolean;
  onShoot: () => void;
  children: React.ReactNode;
}

/** Keyboard + trackpad slab, drawn flat and rotated away from the viewer. */
function LaptopBase({ grown }: { grown: boolean }) {
  return (
    <div
      className="pointer-events-none absolute left-0 right-0 top-full box-border border-[12px] border-panel-2 outline outline-4 outline-black"
      style={{
        height: grown
          ? "min(430px, calc(48.5vh - 38px))"
          : "calc(230px * var(--ui-scale, 1))",
        transition: `height ${GROW}`,
        transform: "rotateX(76deg)",
        transformOrigin: "50% 0",
        transformStyle: "preserve-3d",
        background: "linear-gradient(#26262f, #17171d)",
      }}
    >
      {/* keyboard */}
      <div
        className="absolute left-6 right-6 top-3 border-2 border-black bg-[#23232c]"
        style={{
          bottom: "44%",
          backgroundImage:
            "linear-gradient(90deg, transparent 0 88%, #0f0f14 88% 100%), linear-gradient(0deg, transparent 0 80%, #0f0f14 80% 100%)",
          backgroundSize: "7.69% 100%, 100% 25%",
        }}
      />
      {/* trackpad */}
      <div className="absolute bottom-[8%] left-1/2 h-[26%] w-[26%] -translate-x-1/2 border-2 border-black bg-[#101016]" />
      {/* front edge */}
      <div
        className="absolute -left-4 -right-4 top-full h-4 border-4 border-t-0 border-black"
        style={{
          background: "linear-gradient(#1c1c24, #101016)",
          transform: "rotateX(-76deg)",
          transformOrigin: "50% 0",
        }}
      >
        <div className="absolute left-1/2 top-[3px] h-[7px] w-[130px] -translate-x-1/2 bg-bg" />
      </div>
    </div>
  );
}

/**
 * The CSS-3D laptop. Closed on the title screen (shoot it to boot), then
 * the lid opens and the whole rig grows into a full display surface that
 * hosts the portfolio screens.
 */
export function Laptop({ open, grown, wiping, onShoot, children }: LaptopProps) {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-end justify-center">
      <div
        data-shield
        className={`relative ${open ? "pointer-events-auto" : "pointer-events-none"}`}
        style={{
          // --phone-lift raises the laptop clear of the dialogue box on
          // phone-sized landscape viewports only (lift follows the
          // vw-driven table position). The min() caps the total distance
          // from the bottom on phones so bigger phones (e.g. 932x430)
          // don't push the laptop toward center; the (1 - lift) * 9999px
          // term disables the cap entirely on tablet/desktop.
          // Open on a phone, the laptop pins to a constant 102px from the
          // bottom — just above the dialogue box (~90px) so it never covers
          // the screen content.
          marginBottom: grown
            ? "min(calc(23vh - 55px + var(--phone-lift, 0) * 200px), calc(102px + (1 - var(--phone-lift, 0)) * 9999px))"
            : "min(calc(23vh + 4px + var(--phone-lift, 0) * max(0px, 33.3vw - 60vh + 37.8px)), calc(140px + (1 - var(--phone-lift, 0)) * 9999px))",
          transition: `margin-bottom ${GROW}`,
        }}
      >
        {/*
         * Boot hitbox. The lid's layout box stays 230px tall even though the
         * closed laptop is visually flattened around the hinge, so clicks in
         * the empty air above it would otherwise count — this hugs the
         * visible silhouette instead (slightly above the hinge to the front
         * edge of the base).
         */}
        {!open && (
          <div
            data-shield
            onClick={onShoot}
            aria-label="Boot the laptop"
            className="pointer-events-auto absolute -left-4 -right-4 z-10"
            style={{
              top: "calc(100% - 26px * var(--ui-scale, 1))",
              height: "calc(118px * var(--ui-scale, 1))",
            }}
          />
        )}
        <div className="relative" style={{ perspective: 1600 }}>
          <LaptopBase grown={grown} />
          {/* lid */}
          <div
            className="relative"
            style={{
              // On phones the width is additionally capped to ~2.2x the
              // screen height for a laptop-like ratio (92vw there is far
              // too wide); the 9999px term disables the cap off-phone.
              width: grown
                ? "min(1180px, 92vw, calc((100vh - 130px) * 2.2 + (1 - var(--phone-lift, 0)) * 9999px))"
                : "calc(440px * var(--ui-scale, 1))",
              // Phones get a taller screen (fills the height above the
              // pinned bottom) via the max() term; 0 on tablet/desktop.
              height: grown
                ? "max(min(680px, calc(77vh - 60px)), calc(var(--phone-lift, 0) * (100vh - 130px)))"
                : "calc(230px * var(--ui-scale, 1))",
              transform: `rotateX(${open ? 0 : -104}deg)`,
              transformOrigin: "50% 100%",
              transformStyle: "preserve-3d",
              transition: `width ${GROW}, height ${GROW}, transform ${GROW}`,
            }}
          >
            {/* screen face */}
            <div
              className="absolute inset-0 overflow-hidden border-[12px] border-panel-2 bg-bg outline outline-4 outline-black"
              style={{ backfaceVisibility: "hidden" }}
            >
              {/* Scale the screen UI down on small viewports; the outer
                  laptop geometry stays viewport-driven. */}
              <div
                className="relative"
                style={{
                  width: "calc(100% / var(--ui-scale, 1))",
                  height: "calc(100% / var(--ui-scale, 1))",
                  transform: "scale(var(--ui-scale, 1))",
                  transformOrigin: "0 0",
                }}
              >
                {children}
                <ScreenWipe active={wiping} />
              </div>
            </div>
            {/* cover (back face, visible while closed) */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-center gap-3.5 border-[12px] border-panel-2 bg-panel outline outline-4 outline-black"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateX(180deg)",
              }}
            >
              <div
                className="h-[34px] w-[34px] rotate-45 bg-accent"
                style={{
                  boxShadow:
                    "0 0 0 6px var(--panel), 0 0 0 8px var(--accent)",
                }}
              />
              <div className="mono-label text-xs tracking-[5px] text-muted">
                {SITE.osName}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
