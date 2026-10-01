"use client";

import { useMemo, useState } from "react";
import { GALLERY } from "@/lib/content/gallery";
import { justifyRows, sortByPriority } from "@/lib/gallery/layout";
import type { GameApi } from "@/hooks/useGame";
import type { GalleryItem } from "@/lib/types";
import { GameButton } from "@/components/ui/GameButton";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { Lightbox } from "@/components/ui/Lightbox";

/** Exhibit tag from its position in the locker, e.g. "E-01". */
function exhibitNum(index: number): string {
  return `E-${String(index + 1).padStart(2, "0")}`;
}

/** One exhibit, sized by its row: width follows the artwork's ratio. */
function ExhibitTile({
  item,
  num,
  onOpen,
}: {
  item: GalleryItem;
  num: string;
  onOpen: (src: string) => void;
}) {
  // Videos open in the lightbox too, where they play with controls.
  const media = item.video ?? item.image;
  return (
    <div
      className="group @container relative min-w-0 overflow-hidden border border-line bg-panel transition-[transform,border-color] duration-150 hover:-translate-y-1 hover:border-accent"
      style={{
        flex: `${item.aspect} 1 0%`,
        aspectRatio: item.aspect,
        clipPath:
          "polygon(0 0, 100% 0, 100% calc(100% - 18px), calc(100% - 18px) 100%, 0 100%)",
      }}
    >
      <div
        className="absolute inset-0"
        onClick={media ? () => onOpen(media) : undefined}
        title={media ? "View full resolution" : undefined}
      >
        <ImageSlot
          src={item.image}
          video={item.video}
          alt={item.label}
          placeholder={item.imagePlaceholder}
        />
      </div>
      <div
        className="pointer-events-none absolute bottom-0 left-0 flex items-center gap-2 border-r border-t border-line py-1.5 pl-2.5 pr-3"
        style={{ background: "rgba(11,11,16,0.88)" }}
      >
        <span className="font-[family-name:var(--font-display)] text-[13px] tracking-[1px] text-accent">
          {num}
        </span>
        {/* Narrow tiles (tall strips, reels) only have room for the tag. */}
        <span className="hidden whitespace-nowrap font-mono text-[11px] tracking-[2px] text-ink-soft @[190px]:inline">
          {item.label}
        </span>
      </div>
      <div
        className="pointer-events-none absolute right-2 top-2 hidden px-2 py-[3px] font-mono text-[10px] tracking-[2px] text-muted @[190px]:block"
        style={{ background: "rgba(11,11,16,0.7)" }}
      >
        {item.category}
      </div>
    </div>
  );
}

/**
 * Evidence locker: scrollable wall of graphic design exhibits. Every tile
 * keeps its artwork's real aspect ratio; rows are justified so each one
 * spans the frame edge to edge.
 */
export function GalleryScreen({
  game,
  items = GALLERY,
}: {
  game: GameApi;
  /** Exhibits to show; defaults to the static content file. */
  items?: readonly GalleryItem[];
}) {
  const [lightbox, setLightbox] = useState<string | null>(null);
  const exhibits = useMemo(() => sortByPriority(items), [items]);
  const rows = useMemo(
    () => justifyRows(exhibits.map((g) => g.aspect)),
    [exhibits],
  );
  const count = String(exhibits.length).padStart(2, "0");

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
        {/* pt-1 leaves room for the hover lift on the first row. */}
        <div className="flex flex-col gap-3.5 pt-1">
          {rows.map((row) => (
            <div key={row.indices[0]} className="flex items-start gap-3.5">
              {row.indices.map((index) => (
                <ExhibitTile
                  key={exhibits[index].id}
                  item={exhibits[index]}
                  num={exhibitNum(index)}
                  onOpen={setLightbox}
                />
              ))}
              {row.filler > 0 && (
                <div aria-hidden style={{ flex: `${row.filler} 1 0%` }} />
              )}
            </div>
          ))}
        </div>
      </div>
      <Lightbox src={lightbox} onClose={() => setLightbox(null)} />
    </div>
  );
}
