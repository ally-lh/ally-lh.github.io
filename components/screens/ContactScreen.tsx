"use client";

import { SITE } from "@/lib/content/site";
import type { GameApi } from "@/hooks/useGame";
import { GameButton } from "@/components/ui/GameButton";

/** Final judgment: contact call-to-action. */
export function ContactScreen({ game }: { game: GameApi }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 pb-6">
      <div className="absolute left-7 top-[22px]">
        <GameButton onClick={() => game.navigate("menu")}>
          &#9666; ALL CASES
        </GameButton>
      </div>
      <div className="mono-label text-[13px] tracking-[5px] text-muted">
        FINAL JUDGMENT
      </div>
      <h2
        className="display-shadow m-0 font-[family-name:var(--font-display)] tracking-[2px] text-ink"
        style={{ fontSize: "clamp(40px, 5vw, 72px)" }}
      >
        CASE CLOSED?
      </h2>
      <p className="m-0 max-w-[46ch] text-center text-lg leading-[1.6] text-ink-body">
        If the evidence convinced you, let&rsquo;s work together. Fire a message
        any time.
      </p>
      <a
        href={`mailto:${SITE.email}`}
        className="inline-block bg-accent px-8 py-3 font-[family-name:var(--font-display)] text-lg tracking-[3px] text-bg transition-colors hover:bg-ink hover:text-bg"
        style={{ transform: "skew(-8deg)" }}
      >
        {SITE.email.toUpperCase()}
      </a>
      <div className="flex gap-[26px] font-mono text-sm tracking-[3px]">
        {SITE.socials.map((s) => (
          <a key={s.label} href={s.href} target="_blank" rel="noreferrer">
            {s.label}
          </a>
        ))}
      </div>
    </div>
  );
}
