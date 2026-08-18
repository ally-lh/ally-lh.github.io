/**
 * Pick a horizontal lane (in % of range width) for a pop-up target so it
 * doesn't overlap targets already on screen. Targets spawn either on the
 * left (4–28%) or right (64–86%) band, leaving the laptop area clear.
 *
 * @param takenPcts left positions (%) of live targets
 * @param widthPct  the new target's width as % of the range
 * @param rand      injectable random source for testability
 * @returns a left position in %, or null if no clear lane was found
 */
export function pickLane(
  takenPcts: readonly number[],
  widthPct: number,
  rand: () => number = Math.random,
): number | null {
  const MAX_TRIES = 10;
  for (let i = 0; i < MAX_TRIES; i++) {
    const candidate = rand() < 0.5 ? 4 + rand() * 24 : 64 + rand() * 22;
    const clear = takenPcts.every(
      (t) => Math.abs(t - candidate) > widthPct + 2,
    );
    if (clear) return candidate;
  }
  return null;
}
