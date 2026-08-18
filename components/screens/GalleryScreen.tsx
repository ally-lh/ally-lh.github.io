"use client";

import { useState } from "react";
import { GALLERY } from "@/lib/content/gallery";
import type { GameApi } from "@/hooks/useGame";
import type { GalleryItem } from "@/lib/types";
import { GameButton } from "@/components/ui/GameButton";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { Lightbox } from "@/components/ui/Lightbox";

/** Evidence locker: scrollable masonry grid of graphic design exhibits. */
export function GalleryScreen({
  game,
  items = GALLERY,
}: {
  game: GameApi;
  /** Exhibits to show; defaults to the static content file. */
  items?: readonly GalleryItem[];
}) {
  const [lightbox, setLightbox] = useState<string | null>(null);
  const count = String(items.length).padStart(2, "0");

  return (
    <div className="absolute inset-0 flex flex-col px-8 pb-6 pt-[22px]">
      <div className="mb-4 flex items-center justify-between gap-5">
        <GameButton onClick={() => game.navigate("menu")}>
          &#9666; ALL CASES
        </GameButton>
        <div className="mono-label text-sm tracking-[5px] text-muted">
          EVIDENCE LOCKER // GRAPHIC DESIGN
        </div>
        <div className="flex items-center gap-2.5 font-mono text-xs tracking-[3px] text-accent">
          <span className="h-2.5 w-2.5 rotate-45 bg-accent" />
          {count} EXHIBITS
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden pr-1">
        <div
          className="grid grid-cols-4 gap-3.5"
          style={{ gridAutoRows: 150, gridAutoFlow: "dense" }}
        >
          {items.map((g) => (
            <div
              key={g.id}
              className="group relative min-h-0 min-w-0 overflow-hidden border border-line bg-panel transition-[transform,border-color] duration-150 hover:-translate-y-1 hover:border-accent"
              style={{
                gridColumn: `span ${g.colSpan}`,
                gridRow: `span ${g.rowSpan}`,
                clipPath:
                  "polygon(0 0, 100% 0, 100% calc(100% - 18px), calc(100% - 18px) 100%, 0 100%)",
              }}
            >
              <div
                className="absolute inset-0"
                onClick={
                  g.image ? () => setLightbox(g.image ?? null) : undefined
                }
                title={g.image ? "View full resolution" : undefined}
              >
                <ImageSlot
                  src={g.image}
                  alt={g.label}
                  placeholder={g.imagePlaceholder}
                />
              </div>
              <div
                className="pointer-events-none absolute bottom-0 left-0 flex items-center gap-2 border-r border-t border-line py-1.5 pl-2.5 pr-3"
                style={{ background: "rgba(11,11,16,0.88)" }}
              >
                <span className="font-[family-name:var(--font-display)] text-[13px] tracking-[1px] text-accent">
                  {g.num}
                </span>
                <span className="font-mono text-[11px] tracking-[2px] text-ink-soft">
                  {g.label}
                </span>
              </div>
              <div
                className="pointer-events-none absolute right-2 top-2 px-2 py-[3px] font-mono text-[10px] tracking-[2px] text-muted"
                style={{ background: "rgba(11,11,16,0.7)" }}
              >
                {g.category}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Lightbox src={lightbox} onClose={() => setLightbox(null)} />
    </div>
  );
}
