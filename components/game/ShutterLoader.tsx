"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SITE } from "@/lib/content/site";

const SLATS =
  "repeating-linear-gradient(0deg, #17171d 0 30px, #23232c 30px 34px, #101016 34px 36px)";
const HAZARD =
  "repeating-linear-gradient(45deg, var(--accent) 0 14px, #15151c 14px 28px)";

interface ShutterLoaderProps {
  /** 0–100, driven by asset preloading. */
  progress: number;
  /** When true the shutter rolls up and then unmounts. */
  done: boolean;
  /** Fired once the shutter has fully left the screen. */
  onHidden?: () => void;
}

/**
 * Full-screen roller-shutter boot loader. Covers the stage from first
 * paint, shows real image-preload progress, then rolls up like a range
 * shutter once everything (plus a minimum display beat) has settled.
 */
export function ShutterLoader({ progress, done, onHidden }: ShutterLoaderProps) {
  const [hidden, setHidden] = useState(false);
  if (hidden) return null;

  return (
    <motion.div
      className="fixed inset-0 z-300"
      initial={false}
      animate={{ y: done ? "-101%" : "0%" }}
      transition={{ duration: 0.9, ease: [0.7, 0, 0.2, 1], delay: done ? 0.3 : 0 }}
      onAnimationComplete={() => {
        if (done) {
          setHidden(true);
          onHidden?.();
        }
      }}
      aria-hidden={done}
    >
      {/* shutter slats */}
      <div className="absolute inset-0" style={{ background: SLATS }} />
      {/* side rails */}
      <div className="absolute inset-y-0 left-0 w-4 border-r-2 border-black bg-panel-2" />
      <div className="absolute inset-y-0 right-0 w-4 border-l-2 border-black bg-panel-2" />
      {/* readout */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
        <div
          className="h-[26px] w-[26px] rotate-45 bg-accent"
          style={{ boxShadow: "0 0 0 6px #101016, 0 0 0 8px var(--accent)" }}
        />
        <div className="mono-label text-xs tracking-[5px] text-muted">
          {`${SITE.osName} // RANGE ACCESS`}
        </div>
        <div className="font-[family-name:var(--font-display)] text-[28px] tracking-[4px] text-ink">
          BOOTING
          <span
            className="ml-1.5 inline-block h-5 w-2.5 bg-accent"
            style={{ animation: "blink-caret 0.9s step-end infinite" }}
          />
        </div>
        <div className="w-[min(340px,70vw)] border-2 border-line-2 bg-[#0b0b10] p-0.5">
          <div
            className="h-3 bg-accent transition-[width] duration-300 ease-out"
            style={{
              width: `${progress}%`,
              background:
                "linear-gradient(90deg, var(--accent), var(--accent-soft))",
            }}
          />
        </div>
        <div className="font-mono text-xs tracking-[3px] text-muted">
          LOADING ASSETS &#8226; {progress}%
        </div>
      </div>
      {/* bottom edge: handle + hazard stripe */}
      <div className="absolute inset-x-0 bottom-0">
        <div className="mx-auto mb-2 h-2 w-[140px] border-2 border-black bg-panel-2" />
        <div className="h-4" style={{ background: HAZARD }} />
      </div>
    </motion.div>
  );
}
