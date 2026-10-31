import { createRng, shuffle } from './random';
import { scoreSelection, type TaskScore } from './score';

export type Figure =
  | 'circle'
  | 'square'
  | 'triangle'
  | 'star'
  | 'heart'
  | 'diamond'
  | 'hexagon'
  | 'cross'
  | 'moon'
  | 'arrow'
  | 'bolt'
  | 'drop'
  | 'house'
  | 'bell'
  | 'flag'
  | 'leaf';

export const FIGURES: readonly Figure[] = [
  'circle',
  'square',
  'triangle',
  'star',
  'heart',
  'diamond',
  'hexagon',
  'cross',
  'moon',
  'arrow',
  'bolt',
  'drop',
  'house',
  'bell',
  'flag',
  'leaf',
];

export interface MemoryLevel {
  shown: Figure[];
  choices: Figure[];
}

export const LEVEL_SIZES = [4, 6, 8] as const;
export const STUDY_MS_PER_FIGURE = 1500;

export function createLevel(seed: number, shownCount: number): MemoryLevel {
  const rng = createRng(seed);
  const pool = shuffle(FIGURES, rng);
  const shown = pool.slice(0, shownCount);
  const distractors = pool.slice(shownCount, shownCount * 2);
  return { shown, choices: shuffle([...shown, ...distractors], rng) };
}

export function scoreLevel(level: MemoryLevel, picked: readonly Figure[]): TaskScore {
  return scoreSelection(level.shown, picked);
}
