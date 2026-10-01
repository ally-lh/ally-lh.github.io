/**
 * Layout maths for the graphic-design gallery: exhibits keep their natural
 * aspect ratio and are packed into rows that each span the full width
 * (a "justified" layout). Everything here is width-independent — a row is
 * described only by the ratios in it, so CSS flex can scale it to any frame.
 */

/** Sum of aspect ratios a row aims for (≈ frame width / row height). */
export const TARGET_ROW_ASPECT = 4.6;
/** Rows thinner than this share of the target get padded, not enlarged. */
const MIN_ROW_FILL = 0.7;
const DEFAULT_ASPECT = 1;

export interface GalleryRow {
  /** Indices into the exhibit list, in display order. */
  indices: number[];
  /** Empty space (in aspect units) that keeps a sparse row from ballooning. */
  filler: number;
}

/** Higher `priority` first (default 0); ties keep their original order. */
export function sortByPriority<T extends { priority?: number }>(
  items: readonly T[],
): T[] {
  return items
    .map((item, index) => ({ item, index }))
    .sort(
      (a, b) =>
        (b.item.priority ?? 0) - (a.item.priority ?? 0) || a.index - b.index,
    )
    .map(({ item }) => item);
}

function safeAspect(aspect: number): number {
  return Number.isFinite(aspect) && aspect > 0 ? aspect : DEFAULT_ASPECT;
}

/**
 * Splits exhibits (given as width / height ratios, in display order) into
 * consecutive rows whose ratio sums sit as close to `targetRowAspect` as
 * possible, so every row ends up a similar height once stretched to the
 * frame width. Picks the split with the least total squared deviation.
 */
export function justifyRows(
  aspects: readonly number[],
  targetRowAspect: number = TARGET_ROW_ASPECT,
): GalleryRow[] {
  const ratios = aspects.map(safeAspect);
  const count = ratios.length;
  if (count === 0) return [];

  // prefix[i] = sum of the first i ratios, so any row sum is one subtraction.
  const prefix = ratios.reduce<number[]>(
    (sums, ratio) => [...sums, sums[sums.length - 1] + ratio],
    [0],
  );
  const rowCost = (start: number, end: number) =>
    (prefix[end] - prefix[start] - targetRowAspect) ** 2;

  // best[end] = cheapest way to lay out the first `end` exhibits.
  const best: { cost: number; start: number }[] = [{ cost: 0, start: 0 }];
  for (let end = 1; end <= count; end++) {
    let choice = { cost: Number.POSITIVE_INFINITY, start: 0 };
    for (let start = 0; start < end; start++) {
      const cost = best[start].cost + rowCost(start, end);
      if (cost < choice.cost) choice = { cost, start };
    }
    best.push(choice);
  }

  const rows: GalleryRow[] = [];
  for (let end = count; end > 0; end = best[end].start) {
    const start = best[end].start;
    const sum = prefix[end] - prefix[start];
    const minSum = targetRowAspect * MIN_ROW_FILL;
    rows.unshift({
      indices: Array.from({ length: end - start }, (_, i) => start + i),
      filler: sum < minSum ? minSum - sum : 0,
    });
  }
  return rows;
}
