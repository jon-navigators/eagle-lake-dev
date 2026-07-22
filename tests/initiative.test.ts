import { describe, it, expect } from "vitest";
import { initiativeProgress, rollupProgress } from "@/lib/initiative";

const open = { status: "OPEN" as const };
const done = { status: "DONE" as const };

describe("initiativeProgress", () => {
  it("is 0% with no linked commitments", () => {
    expect(initiativeProgress([])).toEqual({ done: 0, total: 0, pct: 0 });
  });
  it("counts done over total", () => {
    expect(initiativeProgress([done, done, open, open])).toEqual({
      done: 2,
      total: 4,
      pct: 50,
    });
  });
  it("rounds to the nearest percent", () => {
    // 1 of 3 -> 33.33 -> 33
    expect(initiativeProgress([done, open, open]).pct).toBe(33);
    // 2 of 3 -> 66.66 -> 67
    expect(initiativeProgress([done, done, open]).pct).toBe(67);
  });
});

describe("rollupProgress", () => {
  it("flattens groups into one figure", () => {
    expect(rollupProgress([[done, open], [done], []])).toEqual({
      done: 2,
      total: 3,
      pct: 67,
    });
  });
});
