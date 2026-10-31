import { describe, expect, it } from '@jest/globals';
import { overallShare, parseChain, parseSteps } from '../exam';

describe('parseSteps', () => {
  it('given valid steps, when parsing, then returns them', () => {
    const steps = [{ skill: 'memory', correct: 3, total: 4, detail: 'x' }];
    expect(parseSteps(JSON.stringify(steps))).toEqual(steps);
  });

  it('given malformed input, when parsing, then returns an empty list', () => {
    expect(parseSteps('not json')).toEqual([]);
    expect(parseSteps('{"a":1}')).toEqual([]);
    expect(parseSteps(undefined)).toEqual([]);
  });

  it('given an entry with an unknown skill or negative count, when parsing, then drops it', () => {
    const raw = JSON.stringify([
      { skill: 'hacking', correct: 1, total: 1, detail: '' },
      { skill: 'focused', correct: -1, total: 1, detail: '' },
      { skill: 'focused', correct: 1, total: 2, detail: 'ok' },
    ]);
    expect(parseSteps(raw)).toEqual([{ skill: 'focused', correct: 1, total: 2, detail: 'ok' }]);
  });
});

describe('parseChain', () => {
  it('given a chain with an unknown step, when parsing, then keeps only known skills in order', () => {
    expect(parseChain('divided,nope,reasoning')).toEqual(['divided', 'reasoning']);
    expect(parseChain('')).toEqual([]);
  });
});

describe('overallShare', () => {
  it('given steps of different sizes, when combining, then weights by total', () => {
    expect(
      overallShare([
        { skill: 'focused', correct: 30, total: 40, detail: '' },
        { skill: 'reasoning', correct: 0, total: 10, detail: '' },
      ]),
    ).toBe(0.6);
  });
});
