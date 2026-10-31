import { describe, expect, it } from '@jest/globals';
import { answerCurrent, currentIndex, isFinished, startRound, summarize, type Question } from '../reasoning';

const bank: Question[] = [
  { id: 1, prompt: 'a', options: ['x', 'y'], answer: 0, explanation: 'e' },
  { id: 2, prompt: 'b', options: ['x', 'y'], answer: 1, explanation: 'e' },
  { id: 3, prompt: 'c', options: ['x', 'y'], answer: 0, explanation: 'e' },
];

describe('startRound', () => {
  it('given the same seed, when starting twice, then picks the same questions in the same order', () => {
    expect(startRound(bank, 2, 42, 0).questionIds).toEqual(startRound(bank, 2, 42, 0).questionIds);
  });

  it('given a size larger than the bank, when starting, then uses every question once', () => {
    const round = startRound(bank, 10, 7, 0);
    expect([...round.questionIds].sort()).toEqual([1, 2, 3]);
  });
});

describe('answering', () => {
  it('given a new round, when answering every question, then the round is finished', () => {
    let round = startRound(bank, 3, 1, 0);
    expect(currentIndex(round)).toBe(0);
    round = answerCurrent(answerCurrent(answerCurrent(round, 0), 0), 0);
    expect(isFinished(round)).toBe(true);
  });

  it('given a finished round, when answering again, then nothing changes', () => {
    const round = answerCurrent(startRound(bank, 1, 1, 0), 0);
    expect(answerCurrent(round, 1)).toBe(round);
  });
});

describe('summarize', () => {
  it('given mixed answers, when summarizing, then counts correct ones and lists the wrong ids', () => {
    const round = { seed: 1, questionIds: [1, 2, 3], answers: [0, 0, 0], startedAt: 1000 };
    expect(summarize(round, bank, 61000)).toEqual({ total: 3, correct: 2, wrongIds: [2], durationMs: 60000 });
  });
});
