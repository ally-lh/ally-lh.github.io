"use client";

/* eslint-disable @next/next/no-img-element -- small fixed-size thumbnails */

import { useState } from "react";
import { motion } from "framer-motion";
import { CASES } from "@/lib/content/cases";
import { OLD_PROJECTS } from "@/lib/content/old-projects";
import { SMALL_PROJECTS } from "@/lib/content/small-projects";
import { caseThumbnail } from "@/lib/media";
import type { SmallProject } from "@/lib/types";
import type { GameApi } from "@/hooks/useGame";
import { GameButton } from "@/components/ui/GameButton";
import { Lightbox } from "@/components/ui/Lightbox";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Tag } from "@/components/ui/Tag";

function SmallProjectRow({
  project,
  onOpen,
}: {
  project: SmallProject;
  /** Opens the project's `image` full-size (rows without a link). */
  onOpen?: (src: string) => void;
}) {
  const { image } = project;
  const opensImage = !project.href && !!image && !!onOpen;
  const heading = (
    <>
      <div className="flex items-baseline justify-between gap-4">
        <div className="min-w-0 font-[family-name:var(--font-display)] text-[18px] tracking-[1px] text-ink">
          {project.title}
          {project.href && <span className="ml-2 text-accent">&#8599;</span>}
          {opensImage && <span className="ml-2 text-accent">&#9656;</span>}
        </div>
        {project.year && (
          <span className="shrink-0 font-mono text-xs tracking-[2px] text-muted">
            {project.year}
          </span>
        )}
      </div>
      <div className="mt-1 text-[13px] leading-normal text-ink-body">
        {project.blurb}
      </div>
    </>
  );
  // Thumbnail sits beside the title + blurb only; the tags get their own
  // full-width row underneath so nothing is left hanging under the image.
  const inner = (
    <>
      {project.thumbnail ? (
        <div className="flex items-start gap-4">
          <img
            src={project.thumbnail}
            alt=""
            draggable={false}
            className="h-[72px] w-24 shrink-0 border border-line-2 object-cover"
          />
          <div className="min-w-0 flex-1">{heading}</div>
        </div>
      ) : (
        heading
      )}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {project.tags.map((t) => (
          <Tag key={t}>{t}</Tag>
        ))}
      </div>
    </>
  );
  const cls =
    "corner-cut-sm block border border-line bg-panel px-5 py-4 transition-colors duration-150 hover:border-accent";

  if (project.href) {
    return (
      <a href={project.href} target="_blank" rel="noreferrer" className={cls}>
        {inner}
      </a>
    );
  }
  if (opensImage) {
    return (
      <button
        type="button"
        onClick={() => onOpen(image)}
        title="View full size"
        className={`${cls} w-full cursor-pointer text-left`}
      >
        {inner}
      </button>
    );
  }
  return <div className={cls}>{inner}</div>;
}

/** Case-select grid + side-quest list — the laptop's home screen. */
export function MenuScreen({ game }: { game: GameApi }) {
  const [lightbox, setLightbox] = useState<string | null>(null);
  return (
    <div className="absolute inset-0 flex flex-col px-8 pb-[26px] pt-6">
      <div className="flex items-end justify-between gap-6 border-b-[3px] border-accent pb-[18px]">
        <button
          type="button"
          onClick={() => game.navigate("title")}
          className="text-left"
          title="Back to title screen"
        >
          <div className="mono-label text-xs tracking-[5px] text-muted">
            &#8962; COURT RECORD &#8226; BACK TO TITLE
          </div>
          <h2 className="m-0 mt-1.5 font-[family-name:var(--font-display)] text-[34px] tracking-[2px] text-ink transition-colors hover:text-accent">
            SELECT A CASE
          </h2>
        </button>
        <div className="flex gap-3.5">
          <GameButton onClick={() => game.navigate("gallery")} className="text-sm">
            GRAPHIC DESIGN
          </GameButton>
          <GameButton onClick={() => game.navigate("resume")} className="text-sm">
            RESUME
          </GameButton>
          <GameButton onClick={() => game.navigate("about")} className="text-sm">
            PROFILE
          </GameButton>
          <GameButton
            variant="accent"
            onClick={() => game.navigate("contact")}
            className="text-sm"
          >
            CONTACT
          </GameButton>
        </div>
      </div>
      {/* Scrolls: the case grid fills the first viewport-worth, with the
          side-quests section peeking below as a scroll hint. */}
      <div className="mt-[26px] min-h-0 flex-1 overflow-y-auto overflow-x-hidden pr-1">
        <div
          className="grid grid-cols-3 grid-rows-2 gap-[26px]"
          style={{
            height: "calc(100% - 44px)",
            minHeight: 380,
            transformStyle: "preserve-3d",
          }}
        >
          {CASES.map((c, i) => {
            const restRotY = (1 - (i % 3)) * 9;
            const restZ = i % 3 === 1 ? 26 : 0;
            if (c.comingSoon) {
              return (
                <motion.div
                  key={c.id}
                  className="corner-cut relative flex flex-col justify-between gap-3 border border-dashed border-line-2 bg-panel/60 p-6 text-left opacity-80"
                  initial={false}
                  animate={{ rotateY: restRotY, z: restZ }}
                >
                  <div className="flex items-baseline gap-3">
                    <span className="font-[family-name:var(--font-display)] text-[44px] leading-none text-line-2">
                      {c.num}
                    </span>
                    <span className="font-mono text-xs tracking-[3px] text-muted">
                      {c.year}
                    </span>
                  </div>
                  <div>
                    <div className="font-[family-name:var(--font-display)] text-[26px] leading-[1.05] tracking-[1px] text-muted">
                      {c.title}
                    </div>
                    <span className="mt-2 inline-block border border-accent px-2.5 py-1 font-mono text-[11px] tracking-[3px] text-accent">
                      COMING SOON
                    </span>
                  </div>
                </motion.div>
              );
            }
            const thumb = caseThumbnail(c);
            return (
              <motion.button
                key={c.id}
                type="button"
                onClick={() => game.openCase(i)}
                className="corner-cut group relative flex flex-col justify-between gap-3 border border-line bg-panel p-6 text-left text-ink hover:border-accent hover:bg-[#1c1620]"
                initial={false}
                animate={{ rotateY: restRotY, z: restZ }}
                whileHover={{ rotateY: 0, z: 46 }}
                transition={{ duration: 0.18 }}
              >
                <div className="flex items-baseline gap-3">
                  <span className="font-[family-name:var(--font-display)] text-[44px] leading-none text-accent">
                    {c.num}
                  </span>
                  <span className="font-mono text-xs tracking-[3px] text-muted">
                    {c.year}
                  </span>
                </div>
                {/* Pinned to the corner so it never pushes the title down
                    on short screens. */}
                {thumb && (
                  <img
                    src={thumb}
                    alt=""
                    draggable={false}
                    className="absolute right-6 top-6 aspect-[16/10] w-[30%] border border-line-2 object-cover object-top opacity-80 transition-opacity duration-150 group-hover:opacity-100"
                  />
                )}
                <div>
                  <div className="font-[family-name:var(--font-display)] text-[26px] leading-[1.05] tracking-[1px]">
                    {c.title}
                  </div>
                  <div className="mt-2 font-mono text-xs tracking-[3px] text-muted">
                    {c.category}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
        <div className="mt-[26px] pb-2">
          <SectionLabel className="mb-3.5">
            SIDE QUESTS // SMALL PROJECTS
          </SectionLabel>
          <div className="grid grid-cols-2 gap-3.5">
            {SMALL_PROJECTS.map((p) => (
              <SmallProjectRow key={p.title} project={p} />
            ))}
          </div>
        </div>
        <div className="mt-[26px] pb-2">
          <SectionLabel className="mb-3.5">
            COLD CASES // OLD PROJECTS
          </SectionLabel>
          <div className="grid grid-cols-2 gap-3.5">
            {OLD_PROJECTS.map((p) => (
              <SmallProjectRow key={p.title} project={p} onOpen={setLightbox} />
            ))}
          </div>
        </div>
      </div>
      <Lightbox src={lightbox} onClose={() => setLightbox(null)} />
    </div>
  );
}
