"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CASES } from "@/lib/content/cases";
import { Lightbox } from "@/components/ui/Lightbox";
import type { GameApi } from "@/hooks/useGame";
import { GameButton } from "@/components/ui/GameButton";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Tag } from "@/components/ui/Tag";

/** Single case file: evidence image, verdict copy, tags and repo link. */
export function CaseScreen({ game }: { game: GameApi }) {
  const [lightbox, setLightbox] = useState<string | null>(null);
  const c = CASES[game.state.caseIdx];
  if (!c) return null;

  return (
    <div className="absolute inset-0 flex flex-col px-8 pb-6 pt-[22px]">
      <div className="mb-[18px] flex items-center justify-between gap-5">
        <GameButton onClick={() => game.navigate("menu")}>
          &#9666; ALL CASES
        </GameButton>
        <div className="mono-label text-sm tracking-[5px] text-muted">
          CASE {c.num} / {String(CASES.length).padStart(2, "0")}
        </div>
        <GameButton variant="accent" onClick={game.nextCase}>
          NEXT CASE &#9656;
        </GameButton>
      </div>
      <motion.div
        key={c.id}
        className="flex min-h-0 flex-1 gap-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
      >
        <div className="flex min-w-0 flex-[1.15] items-center">
          {/* Bento grids and images use the full-height evidence board;
              single 16:9 videos size the frame to the column width at
              that ratio so nothing gets cropped. */}
          <div
            className="relative w-full border border-line"
            style={{
              ...(c.video && !c.bento
                ? { aspectRatio: "16 / 9" }
                : { height: "100%" }),
              transform: "rotateY(7deg) translateZ(20px)",
              boxShadow: "-18px 24px 40px rgba(0,0,0,0.5)",
            }}
          >
            {c.bento ? (
              /* Masonry board: natural aspect ratios, scrolls vertically. */
              <div className="absolute inset-0 overflow-y-auto overflow-x-hidden bg-bg p-2">
                <div style={{ columns: c.bentoCols ?? 2, columnGap: 8 }}>
                  {c.bento.map((tile, i) => (
                    <div
                      key={i}
                      className="relative mb-2 overflow-hidden border border-line bg-panel-2"
                      style={{ breakInside: "avoid" }}
                    >
                      {tile.video ? (
                        <div className="relative aspect-video">
                          <ImageSlot
                            video={tile.video}
                            alt={c.title}
                            placeholder={tile.placeholder ?? c.imagePlaceholder}
                          />
                        </div>
                      ) : tile.src ? (
                        <button
                          type="button"
                          onClick={() => setLightbox(tile.src ?? null)}
                          className="block w-full transition-opacity hover:opacity-80"
                          title="View full resolution"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element -- natural-height masonry tile */}
                          <img
                            src={tile.src}
                            alt={c.title}
                            draggable={false}
                            className="block w-full"
                          />
                        </button>
                      ) : (
                        <div className="relative aspect-video">
                          <ImageSlot
                            placeholder={tile.placeholder ?? c.imagePlaceholder}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div
                className={`absolute inset-0 ${c.image && !c.video ? "transition-opacity hover:opacity-80" : ""}`}
                onClick={
                  c.image && !c.video
                    ? () => setLightbox(c.image ?? null)
                    : undefined
                }
                title={c.image && !c.video ? "View full resolution" : undefined}
              >
                <ImageSlot
                  src={c.image}
                  video={c.video}
                  alt={c.title}
                  placeholder={c.imagePlaceholder}
                  fit="contain"
                />
              </div>
            )}
          </div>
        </div>
        <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-[18px] overflow-y-auto overflow-x-hidden pr-1.5">
          <div className="flex items-center gap-3.5">
            <span
              className="bg-accent px-3.5 py-[5px] font-[family-name:var(--font-display)] text-[15px] tracking-[2px] text-bg"
              style={{ transform: "skew(-8deg)" }}
            >
              {c.category}
            </span>
            <span className="font-mono text-[13px] tracking-[3px] text-muted">
              LOGGED {c.date} &#8226; {c.time}
            </span>
          </div>
          <h2
            className="m-0 font-[family-name:var(--font-display)] leading-[0.98] tracking-[1px] text-ink"
            style={{
              fontSize: "clamp(30px, 3.4vw, 48px)",
              textShadow: "4px 4px 0 color-mix(in srgb, var(--accent) 35%, transparent)",
            }}
          >
            {c.title}
          </h2>
          <p className="m-0 max-w-[52ch] text-[17px] leading-[1.65] text-ink-body">
            {c.description}
          </p>
          <div>
            <SectionLabel className="mb-2.5">EVIDENCE</SectionLabel>
            <div className="flex flex-col gap-2">
              {c.evidence.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2.5 text-[15px] text-ink-soft"
                >
                  <span className="h-2 w-2 shrink-0 rotate-45 bg-accent" />
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-auto flex flex-wrap items-center gap-2.5 pt-2">
            {c.demoUrl && (
              <GameButton
                variant="accent"
                href={c.demoUrl}
                target="_blank"
                rel="noreferrer"
                className="text-sm"
              >
                &#9656; LIVE DEMO
              </GameButton>
            )}
            {c.repoUrl && (
              <GameButton
                variant={c.demoUrl ? "ghost" : "accent"}
                href={c.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="text-sm"
              >
                &#9656; GITHUB REPO
              </GameButton>
            )}
            {!c.demoUrl && !c.repoUrl && (
              <span className="inline-block border-2 border-line-2 px-4 py-2 font-[family-name:var(--font-display)] text-sm tracking-[3px] text-muted">
                [ PRIVATE ]
              </span>
            )}
            {c.tags.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>
        </div>
      </motion.div>
      <Lightbox
        src={lightbox}
        alt={c.title}
        onClose={() => setLightbox(null)}
      />
    </div>
  );
}
