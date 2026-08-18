"use client";

import { motion } from "framer-motion";
import { SITE } from "@/lib/content/site";

const HAZARD =
  "repeating-linear-gradient(45deg, var(--accent) 0 14px, var(--panel) 14px 28px)";

const rise = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.1 + i * 0.12,
      duration: 0.5,
      ease: "easeOut" as const,
    },
  }),
};

/** Full-stage title art: ambient set dressing plus the big name card. */
export function TitleScreen() {
  return (
    <div
      className="absolute inset-0 flex flex-col items-center gap-3.5"
      style={{
        transformStyle: "preserve-3d",
        paddingTop: "calc(44px * var(--ui-scale, 1))",
      }}
    >
      {/* ambient glow + beams + scanlines */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 44%, color-mix(in oklab, var(--accent) 16%, transparent), transparent 70%)",
          animation: "glow-pulse 6s ease-in-out infinite",
        }}
      />
      <div
        className="pointer-events-none absolute -inset-[20%]"
        style={{
          background:
            "repeating-linear-gradient(115deg, transparent 0 150px, color-mix(in oklab, var(--accent) 7%, transparent) 150px 230px)",
          animation: "beam-slide 18s linear infinite",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          background:
            "repeating-linear-gradient(0deg, rgba(0,0,0,0.22) 0 2px, transparent 2px 6px)",
        }}
      />
      {/* rotating square frames */}
      <div
        className="pointer-events-none absolute left-1/2 top-[44%] border-2"
        style={{
          width: "calc(460px * var(--ui-scale, 1))",
          height: "calc(460px * var(--ui-scale, 1))",
          margin:
            "calc(-230px * var(--ui-scale, 1)) 0 0 calc(-230px * var(--ui-scale, 1))",
          borderColor: "color-mix(in oklab, var(--accent) 40%, transparent)",
          animation: "slow-spin 34s linear infinite",
        }}
      />
      <div
        className="pointer-events-none absolute left-1/2 top-[44%] border"
        style={{
          width: "calc(640px * var(--ui-scale, 1))",
          height: "calc(640px * var(--ui-scale, 1))",
          margin:
            "calc(-320px * var(--ui-scale, 1)) 0 0 calc(-320px * var(--ui-scale, 1))",
          borderColor: "color-mix(in oklab, var(--accent) 22%, transparent)",
          animation: "slow-spin-rev 52s linear infinite",
        }}
      />
      {/* hazard stripes */}
      <div
        className="absolute inset-x-0 top-0 h-4"
        style={{ background: HAZARD }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-4"
        style={{ background: HAZARD }}
      />
      {/* floating squares */}
      <div
        className="absolute left-[8%] top-[22%] h-[26px] w-[26px] bg-accent"
        style={{ animation: "floaty 5s ease-in-out infinite" }}
      />
      <div
        className="absolute right-[10%] top-[30%] h-4 w-4 bg-ink"
        style={{ animation: "floaty 6s ease-in-out infinite" }}
      />
      <div
        className="absolute bottom-[24%] right-[16%] h-[34px] w-[34px] border-[3px] border-accent"
        style={{ animation: "floaty 7s ease-in-out infinite" }}
      />

      <motion.div
        variants={rise}
        initial="hidden"
        animate="show"
        custom={0}
        className="font-mono text-sm tracking-[6px] text-muted"
      >
        CREATIVE PORTFOLIO // v1.0
      </motion.div>
      <motion.h1
        variants={rise}
        initial="hidden"
        animate="show"
        custom={1}
        className="display-shadow m-0 text-center font-[family-name:var(--font-display)] leading-[0.95] tracking-[2px] text-ink"
        style={{ fontSize: "clamp(32px, min(7vw, 13vh), 92px)" }}
      >
        {SITE.playerName}
      </motion.h1>
      {/* <motion.div
        variants={rise}
        initial="hidden"
        animate="show"
        custom={2}
        className="bg-accent px-[34px] py-2.5 font-[family-name:var(--font-display)] tracking-[4px] text-bg"
        style={{ transform: "skew(-8deg)", fontSize: "clamp(20px, 2.6vw, 30px)" }}
      >
        DESIGN ON TRIAL
      </motion.div> */}
      <motion.div
        variants={rise}
        initial="hidden"
        animate="show"
        custom={3}
        className="mt-2.5 text-center font-mono tracking-[4px] text-accent"
        style={{ animation: "blink-caret 1.1s step-end infinite" }}
      >
        &#9660; SHOOT THE LAPTOP TO BOOT
      </motion.div>
    </div>
  );
}
