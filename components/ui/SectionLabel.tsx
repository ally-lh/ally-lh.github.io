interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
}

/** "◆ EVIDENCE"-style monospace section marker in the accent color. */
export function SectionLabel({ children, className = "" }: SectionLabelProps) {
  return (
    <div className={`mono-label text-xs text-accent ${className}`}>
      &#9670; {children}
    </div>
  );
}
