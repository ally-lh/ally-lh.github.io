"use client";

import { motion } from "framer-motion";
import type { Skill } from "@/lib/types";

interface StatBarProps {
  skill: Skill;
  /** Stagger index for the fill animation. */
  index?: number;
}

/** RPG-style stat row: label, LV badge and an animated fill bar. */
export function StatBar({ skill, index = 0 }: StatBarProps) {
  return (
    <div>
      <div className="mb-[5px] flex justify-between font-mono text-[13px] tracking-[2px] text-ink-soft">
        <span>{skill.name}</span>
        <span className="text-muted">LV.{skill.level}</span>
      </div>
      <div className="h-3 border border-line bg-panel-2">
        <motion.div
          className="h-full"
          style={{
            background:
              "linear-gradient(90deg, var(--accent), var(--accent-soft))",
          }}
          initial={{ width: 0 }}
          animate={{ width: `${skill.pct}%` }}
          transition={{ duration: 0.7, delay: 0.15 + index * 0.08, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
