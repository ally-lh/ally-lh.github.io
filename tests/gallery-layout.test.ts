import { describe, expect, it } from "vitest";
import { justifyRows, sortByPriority } from "@/lib/gallery/layout";

const rowSum = (aspects: readonly number[], indices: readonly number[]) =>
  indices.reduce((sum, i) => sum + aspects[i], 0);

describe("sortByPriority", () => {
  it("lists higher priorities first", () => {
    const items = [
      { id: "a" },
      { id: "b", priority: 2 },
      { id: "c", priority: 5 },
    ];
    expect(sortByPriority(items).map((i) => i.id)).toEqual(["c", "b", "a"]);
  });

  it("keeps the original order for ties and unset priorities", () => {
    const items = [
      { id: "a" },
      { id: "b", priority: 1 },
      { id: "c" },
      { id: "d", priority: 1 },
      { id: "e", priority: 0 },
    ];
    expect(sortByPriority(items).map((i) => i.id)).toEqual([
      "b",
      "d",
      "a",
      "c",
      "e",
    ]);
  });

  it("does not mutate its input", () => {
    const items = [{ id: "a" }, { id: "b", priority: 1 }];
    sortByPriority(items);
    expect(items.map((i) => i.id)).toEqual(["a", "b"]);
  });
});

describe("justifyRows", () => {
  it("returns no rows for an empty gallery", () => {
    expect(justifyRows([], 4)).toEqual([]);
  });

  it("places every exhibit exactly once, in order", () => {
    const aspects = [1.4, 0.7, 1, 1, 0.56, 0.8, 0.7, 1, 1, 1, 1.4, 0.33, 1.33];
    const flat = justifyRows(aspects, 4).flatMap((row) => row.indices);
    expect(flat).toEqual(aspects.map((_, i) => i));
  });

  it("splits evenly sized tiles into rows that hit the target", () => {
    const rows = justifyRows(Array.from({ length: 8 }, () => 1), 4);
    expect(rows.map((row) => row.indices)).toEqual([
      [0, 1, 2, 3],
      [4, 5, 6, 7],
    ]);
    expect(rows.every((row) => row.filler === 0)).toBe(true);
  });

  it("balances mixed ratios so no row strays far from the target", () => {
    const aspects = [1.41, 0.71, 1, 1, 0.56, 0.8, 0.71, 1, 1, 1, 1, 1.4, 1.4];
    const target = 4.5;
    for (const row of justifyRows(aspects, target)) {
      const sum = rowSum(aspects, row.indices);
      expect(sum).toBeGreaterThan(target * 0.7);
      expect(sum).toBeLessThan(target * 1.3);
    }
  });

  it("pads a sparse row so a lone tile is not blown up to full width", () => {
    const [row] = justifyRows([1], 4);
    expect(row.indices).toEqual([0]);
    expect(row.filler).toBeGreaterThan(0);
  });

  it("treats missing or invalid ratios as square", () => {
    const rows = justifyRows([Number.NaN, 0, -2, 1], 4);
    expect(rows).toHaveLength(1);
    expect(rows[0].indices).toEqual([0, 1, 2, 3]);
    expect(rows[0].filler).toBe(0);
  });
});
