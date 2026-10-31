import { createRng, shuffle } from './random';
import { scoreSelection, type TaskScore } from './score';

export type Glyph = 'up' | 'down' | 'left' | 'right' | 'square';

export const GLYPHS: readonly Glyph[] = ['up', 'down', 'left', 'right', 'square'];

export interface CancellationPage {
  target: Glyph;
  cells: Glyph[];
}

export const PAGE_SIZE = 42;
export const PAGE_TARGETS = 12;
export const PAGE_SECONDS = 25;
export const PAGES_PER_SESSION = 3;

export function createPage(seed: number, size = PAGE_SIZE, targetCount = PAGE_TARGETS): CancellationPage {
  const rng = createRng(seed);
  const target = GLYPHS[Math.floor(rng() * GLYPHS.length)];
  const others = GLYPHS.filter((glyph) => glyph !== target);
  const cells: Glyph[] = Array.from({ length: size }, (_, i) =>
    i < targetCount ? target : others[Math.floor(rng() * others.length)],
  );
  return { target, cells: shuffle(cells, rng) };
}

export function targetIndexes(page: CancellationPage): number[] {
  return page.cells.flatMap((glyph, i) => (glyph === page.target ? [i] : []));
}

export function scorePage(page: CancellationPage, marked: readonly number[]): TaskScore {
  return scoreSelection(targetIndexes(page), marked);
}
