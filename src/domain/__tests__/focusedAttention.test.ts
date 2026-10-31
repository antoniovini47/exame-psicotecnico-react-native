import { describe, expect, it } from '@jest/globals';
import { createPage, PAGE_SIZE, PAGE_TARGETS, scorePage, targetIndexes } from '../focusedAttention';

describe('createPage', () => {
  it.each([1, 2, 3, 42, 999])('given seed %i, when creating a page, then it has the exact number of targets', (seed) => {
    const page = createPage(seed);
    expect(page.cells).toHaveLength(PAGE_SIZE);
    expect(targetIndexes(page)).toHaveLength(PAGE_TARGETS);
  });

  it('given the same seed, when creating twice, then the page is identical', () => {
    expect(createPage(7)).toEqual(createPage(7));
  });

  it('given many seeds, when creating pages, then the target symbol varies', () => {
    const targets = new Set(Array.from({ length: 30 }, (_, i) => createPage(i).target));
    expect(targets.size).toBeGreaterThan(1);
  });
});

describe('scorePage', () => {
  it('given every target marked and nothing else, when scoring, then it is perfect', () => {
    const page = createPage(5);
    expect(scorePage(page, targetIndexes(page))).toEqual({ targets: PAGE_TARGETS, hits: PAGE_TARGETS, misses: 0, falseAlarms: 0 });
  });

  it('given one non-target marked, when scoring, then it counts a false alarm', () => {
    const page = createPage(5);
    const wrong = page.cells.findIndex((glyph) => glyph !== page.target);
    expect(scorePage(page, [wrong]).falseAlarms).toBe(1);
    expect(scorePage(page, [wrong]).misses).toBe(PAGE_TARGETS);
  });
});
