"use client";

import { useState } from "react";
import { BIO, PROFILE_PHOTO, SKILLS, TOOLS } from "@/lib/content/profile";
import { Lightbox } from "@/components/ui/Lightbox";
import { SITE } from "@/lib/content/site";
import type { GameApi } from "@/hooks/useGame";
import { GameButton } from "@/components/ui/GameButton";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { StatBar } from "@/components/ui/StatBar";
import { Tag } from "@/components/ui/Tag";

/** Suspect profile: photo, bio, RPG stat bars and tool inventory. */
export function AboutScreen({ game }: { game: GameApi }) {
  const [lightbox, setLightbox] = useState<string | null>(null);
  return (
    <div className="absolute inset-0 flex flex-col px-8 pb-6 pt-[22px]">
      <div className="mb-[18px] flex items-center justify-between">
        <GameButton onClick={() => game.navigate("menu")}>
          &#9666; ALL CASES
        </GameButton>
        <div className="mono-label text-sm tracking-[5px] text-muted">
          SUSPECT PROFILE
        </div>
        <GameButton variant="accent" onClick={() => game.navigate("contact")}>
          CONTACT &#9656;
        </GameButton>
      </div>
      <div className="flex min-h-0 flex-1 items-stretch gap-9 overflow-auto">
        <div className="flex w-[280px] shrink-0 flex-col gap-4">
          {/* shrink-0 keeps the column's flex layout from squashing the
              frame (which crops the photo into a zoomed strip). */}
          <div
            className={`relative aspect-square w-full shrink-0 border-[3px] border-accent ${PROFILE_PHOTO ? "transition-opacity hover:opacity-85" : ""}`}
            onClick={
              PROFILE_PHOTO
                ? () => setLightbox(PROFILE_PHOTO ?? null)
                : undefined
            }
            title={PROFILE_PHOTO ? "View full resolution" : undefined}
          >
            <ImageSlot
              src={PROFILE_PHOTO}
              alt={SITE.playerName}
              placeholder="Drop your photo / avatar"
            />
          </div>
          <div>
            <h2 className="m-0 font-[family-name:var(--font-display)] text-[44px] leading-none tracking-[1px]">
              {SITE.playerName}
            </h2>
            <div className="mono-label mt-2 text-[13px] text-accent">
              {SITE.role}
            </div>
          </div>
          <p className="m-0 text-[15px] leading-[1.65] text-ink-body">{BIO}</p>
        </div>
        <div className="flex min-w-[280px] flex-1 flex-col gap-[26px]">
          <div>
            <SectionLabel className="mb-3.5">STAT SCREEN</SectionLabel>
            <div className="flex max-w-[560px] flex-col gap-3.5">
              {SKILLS.map((skill, i) => (
                <StatBar key={skill.name} skill={skill} index={i} />
              ))}
            </div>
          </div>
          <div>
            <SectionLabel className="mb-3">INVENTORY</SectionLabel>
            <div className="flex max-w-[560px] flex-wrap gap-2.5">
              {TOOLS.map((tool) => (
                <Tag key={tool} tone="bright">
                  {tool}
                </Tag>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Lightbox
        src={lightbox}
        alt={SITE.playerName}
        onClose={() => setLightbox(null)}
      />
    </div>
  );
}
