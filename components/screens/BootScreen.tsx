"use client";

import { motion } from "framer-motion";
import { SITE } from "@/lib/content/site";

const BOOT_LINES = [
  "checking memory ........... 640K OK",
  "loading case files ........ OK",
  "loading suspect profile ... OK",
  "calibrating crosshair ..... OK",
];

const fadeAt = (delay: number) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { delay, duration: 0.1 },
});

/** Retro BIOS boot sequence shown while the laptop powers up. */
export function BootScreen() {
  return (
    <div className="absolute inset-0 bg-[#050508] px-[30px] py-[26px] font-mono text-sm leading-loose text-accent">
      <motion.div {...fadeAt(0.1)} className="mb-2.5 flex items-center gap-3">
        <span className="h-3.5 w-3.5 rotate-45 bg-accent" />
        {SITE.osName} &#8226; PORTFOLIO_OS v1.0
      </motion.div>
      {BOOT_LINES.map((line, i) => (
        <motion.div key={line} {...fadeAt(0.5 + i * 0.5)} className="text-muted">
          {line}
        </motion.div>
      ))}
      <motion.div
        {...fadeAt(0.5)}
        className="my-3.5 h-3.5 w-[min(420px,80%)] border-2 border-line-2 p-0.5"
      >
        <div
          className="h-full bg-accent"
          style={{ animation: "bar-fill 2.2s .6s steps(24) both" }}
        />
      </motion.div>
      <motion.div {...fadeAt(2.8)}>
        &gt; boot complete
        <span
          className="ml-[5px] inline-block h-3.5 w-[9px] bg-accent"
          style={{ animation: "blink-caret 1s step-end infinite" }}
        />
      </motion.div>
    </div>
  );
}
