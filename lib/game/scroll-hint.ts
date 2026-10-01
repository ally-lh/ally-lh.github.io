/** Overflow below this (px) isn't worth a "scroll for more" nudge. */
const MIN_OVERFLOW_PX = 8;

export interface ScrollMetrics {
  scrollTop: number;
  scrollHeight: number;
  clientHeight: number;
}

/** The nudge is only relevant while parked at the top with more below. */
export function canShowScrollHint(m: ScrollMetrics): boolean {
  return m.scrollTop <= 0 && m.scrollHeight - m.clientHeight > MIN_OVERFLOW_PX;
}
