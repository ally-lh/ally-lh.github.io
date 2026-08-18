"use client";

import { ABILITIES, EDUCATION, EXPERIENCE } from "@/lib/content/resume";
import { SITE } from "@/lib/content/site";
import type { GameApi } from "@/hooks/useGame";
import { GameButton } from "@/components/ui/GameButton";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Tag } from "@/components/ui/Tag";

/** The official case file: experience log, education and abilities. */
export function ResumeScreen({ game }: { game: GameApi }) {
  return (
    <div className="absolute inset-0 flex flex-col px-8 pb-6 pt-[22px]">
      <div className="mb-[18px] flex items-center justify-between">
        <GameButton onClick={() => game.navigate("menu")}>
          &#9666; ALL CASES
        </GameButton>
        <div className="mono-label text-sm tracking-[5px] text-muted">
          CASE FILE // RESUME
        </div>
        <GameButton variant="solid" href={SITE.resumePdf} download>
          &#8595; DOWNLOAD PDF
        </GameButton>
      </div>
      <div className="flex min-h-0 flex-1 flex-wrap gap-9 overflow-y-auto overflow-x-hidden">
        <div className="min-w-[340px] flex-[1.2]">
          <SectionLabel className="mb-4">EXPERIENCE LOG</SectionLabel>
          <div className="flex flex-col gap-[22px]">
            {EXPERIENCE.map((xp) => (
              <div
                key={`${xp.role}-${xp.org}`}
                className="border-l-[3px] border-accent pl-[18px]"
              >
                <div className="flex flex-wrap justify-between gap-3">
                  <span className="font-[family-name:var(--font-display)] text-[22px] tracking-[1px]">
                    {xp.role}
                  </span>
                  <span className="font-mono text-xs tracking-[2px] text-muted">
                    {xp.dates}
                  </span>
                </div>
                <div className="my-1 font-mono text-[13px] tracking-[2px] text-accent">
                  {xp.org}
                </div>
                <div className="max-w-[56ch] text-[15px] leading-[1.55] text-ink-body">
                  {xp.blurb}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex min-w-[300px] flex-1 flex-col gap-7">
          <div>
            <SectionLabel className="mb-4">EDUCATION</SectionLabel>
            {EDUCATION.map((ed) => (
              <div
                key={ed.title}
                className="corner-cut-sm mb-3.5 border border-line bg-panel px-5 py-4"
              >
                <div className="font-[family-name:var(--font-display)] text-[19px] tracking-[1px]">
                  {ed.title}
                </div>
                <div className="mt-[5px] font-mono text-xs tracking-[2px] text-muted">
                  {ed.org} &#8226; {ed.dates}
                </div>
              </div>
            ))}
          </div>
          <div>
            <SectionLabel className="mb-3">ABILITIES</SectionLabel>
            <div className="flex flex-wrap gap-2.5">
              {ABILITIES.map((a) => (
                <Tag key={a} tone="bright">
                  {a}
                </Tag>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
