export interface TaskScore {
  targets: number;
  hits: number;
  misses: number;
  falseAlarms: number;
}

export const emptyScore: TaskScore = { targets: 0, hits: 0, misses: 0, falseAlarms: 0 };

export function scoreSelection<T>(targets: readonly T[], picked: readonly T[]): TaskScore {
  const wanted = new Set(targets);
  const chosen = new Set(picked);
  const hits = [...chosen].filter((item) => wanted.has(item)).length;
  return { targets: wanted.size, hits, misses: wanted.size - hits, falseAlarms: chosen.size - hits };
}

export function addScores(a: TaskScore, b: TaskScore): TaskScore {
  return {
    targets: a.targets + b.targets,
    hits: a.hits + b.hits,
    misses: a.misses + b.misses,
    falseAlarms: a.falseAlarms + b.falseAlarms,
  };
}

export function accuracy(score: TaskScore): number {
  const attempts = score.targets + score.falseAlarms;
  return attempts === 0 ? 1 : score.hits / attempts;
}
