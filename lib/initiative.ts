// Initiative progress is never stored — it is computed from the commitments
// linked to the initiative. Pure and unit-testable.

export type ProgressInput = { status: "OPEN" | "DONE" };

export type Progress = { done: number; total: number; pct: number };

export function initiativeProgress(commitments: ProgressInput[]): Progress {
  const total = commitments.length;
  const done = commitments.filter((c) => c.status === "DONE").length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  return { done, total, pct };
}

/** Roll several initiatives' commitments into one org-wide progress figure. */
export function rollupProgress(groups: ProgressInput[][]): Progress {
  return initiativeProgress(groups.flat());
}
