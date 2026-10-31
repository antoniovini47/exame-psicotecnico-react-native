import { describe, expect, it } from '@jest/globals';
import { createLevel, FIGURES, LEVEL_SIZES, scoreLevel } from '../visualMemory';

describe('createLevel', () => {
  it.each([...LEVEL_SIZES])('given %i figures to memorize, when creating a level, then half the choices were shown', (size) => {
    const level = createLevel(21, size);
    expect(level.shown).toHaveLength(size);
    expect(level.choices).toHaveLength(size * 2);
    expect(new Set(level.choices).size).toBe(size * 2);
    expect(level.choices.filter((f) => level.shown.includes(f))).toHaveLength(size);
  });

  it('given the largest level, when creating it, then the figure set is big enough', () => {
    expect(FIGURES.length).toBeGreaterThanOrEqual(Math.max(...LEVEL_SIZES) * 2);
    expect(new Set(FIGURES).size).toBe(FIGURES.length);
  });

  it('given the same seed, when creating twice, then the level is identical', () => {
    expect(createLevel(9, 6)).toEqual(createLevel(9, 6));
  });
});

describe('scoreLevel', () => {
  it('given exactly the shown figures, when scoring, then it is perfect', () => {
    const level = createLevel(4, 4);
    expect(scoreLevel(level, level.shown)).toEqual({ targets: 4, hits: 4, misses: 0, falseAlarms: 0 });
  });

  it('given a figure that was not shown, when scoring, then it counts a false alarm', () => {
    const level = createLevel(4, 4);
    const unseen = level.choices.find((f) => !level.shown.includes(f));
    expect(scoreLevel(level, unseen ? [unseen] : []).falseAlarms).toBe(1);
  });
});
