type TagTone = "dim" | "bright";

interface TagProps {
  children: React.ReactNode;
  tone?: TagTone;
}

const TONES: Record<TagTone, string> = {
  dim: "text-muted px-3 py-[5px] text-xs",
  bright: "text-ink-soft bg-panel px-4 py-2 text-[13px]",
};

/** Bordered monospace chip used for tech tags and inventory items. */
export function Tag({ children, tone = "dim" }: TagProps) {
  return (
    <span
      className={`border border-line-2 font-mono tracking-[2px] ${TONES[tone]}`}
    >
      {children}
    </span>
  );
}
