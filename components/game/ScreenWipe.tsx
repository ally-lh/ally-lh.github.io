"use client";

/** CRT-style scanline wipe shown while the laptop switches screens. */
export function ScreenWipe({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <div className="pointer-events-none absolute inset-0 z-40 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "repeating-linear-gradient(0deg, #050508 0 6px, #12121a 6px 12px)",
          animation: "wipe-sweep .46s linear",
        }}
      />
    </div>
  );
}
