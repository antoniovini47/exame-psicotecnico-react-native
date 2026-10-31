import { describe, expect, it } from '@jest/globals';
import { accuracy, addScores, scoreSelection } from '../score';

describe('scoreSelection', () => {
  it('given some right and some wrong picks, when scoring, then counts hits, misses and false alarms', () => {
    expect(scoreSelection([1, 2, 3, 4], [2, 4, 9])).toEqual({ targets: 4, hits: 2, misses: 2, falseAlarms: 1 });
  });

  it('given the same pick twice, when scoring, then counts it once', () => {
    expect(scoreSelection([1], [1, 1])).toEqual({ targets: 1, hits: 1, misses: 0, falseAlarms: 0 });
  });
});

describe('accuracy', () => {
  it('given wrong marks, when computing accuracy, then they lower the result', () => {
    expect(accuracy({ targets: 10, hits: 10, misses: 0, falseAlarms: 0 })).toBe(1);
    expect(accuracy({ targets: 10, hits: 10, misses: 0, falseAlarms: 10 })).toBe(0.5);
  });

  it('given nothing to find and nothing marked, when computing accuracy, then it is perfect', () => {
    expect(accuracy({ targets: 0, hits: 0, misses: 0, falseAlarms: 0 })).toBe(1);
  });
});

describe('addScores', () => {
  it('given two scores, when adding, then sums every field', () => {
    const a = { targets: 2, hits: 1, misses: 1, falseAlarms: 0 };
    expect(addScores(a, a)).toEqual({ targets: 4, hits: 2, misses: 2, falseAlarms: 0 });
  });
});
