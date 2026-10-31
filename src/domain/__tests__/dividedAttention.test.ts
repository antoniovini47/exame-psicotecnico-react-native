import { describe, expect, it } from '@jest/globals';
import { createTrials, isCircleTarget, isEvenTarget, scoreTrials, TRIALS_PER_SESSION } from '../dividedAttention';

describe('createTrials', () => {
  it('given a seed, when creating trials, then digits are 1-9 and both channels have targets', () => {
    const trials = createTrials(11);
    expect(trials).toHaveLength(TRIALS_PER_SESSION);
    expect(trials.every((t) => t.digit >= 1 && t.digit <= 9)).toBe(true);
    expect(trials.some(isEvenTarget)).toBe(true);
    expect(trials.some(isCircleTarget)).toBe(true);
  });

  it('given the same seed, when creating twice, then trials are identical', () => {
    expect(createTrials(3)).toEqual(createTrials(3));
  });
});

describe('scoreTrials', () => {
  const trials = [
    { digit: 4, shape: 'circle' as const },
    { digit: 3, shape: 'square' as const },
    { digit: 8, shape: 'triangle' as const },
  ];

  it('given every target answered and nothing else, when scoring, then it is perfect', () => {
    const responses = trials.map((t) => ({ even: isEvenTarget(t), circle: isCircleTarget(t) }));
    expect(scoreTrials(trials, responses)).toEqual({ targets: 3, hits: 3, misses: 0, falseAlarms: 0 });
  });

  it('given no answers, when scoring, then every target is a miss', () => {
    expect(scoreTrials(trials, [])).toEqual({ targets: 3, hits: 0, misses: 3, falseAlarms: 0 });
  });

  it('given a press on a non-target, when scoring, then it counts a false alarm', () => {
    const responses = [
      { even: true, circle: true },
      { even: true, circle: true },
      { even: true, circle: false },
    ];
    expect(scoreTrials(trials, responses)).toEqual({ targets: 3, hits: 3, misses: 0, falseAlarms: 2 });
  });
});
