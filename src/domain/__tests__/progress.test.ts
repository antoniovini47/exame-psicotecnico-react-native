import { describe, expect, it } from '@jest/globals';
import { currentStreak, dayKey, emptyProgress, lastShareBySkill, recordRound } from '../progress';

const summary = { skill: 'reasoning' as const, total: 10, correct: 7 };

describe('recordRound', () => {
  it('given no history, when recording a round, then starts a streak of 1', () => {
    const progress = recordRound(emptyProgress, summary, '2026-10-31');
    expect(progress).toMatchObject({ streak: 1, lastDay: '2026-10-31', questionsSolved: 10 });
  });

  it('given training yesterday, when recording today, then extends the streak across a month boundary', () => {
    const yesterday = recordRound(emptyProgress, summary, '2026-10-31');
    expect(recordRound(yesterday, summary, '2026-11-01').streak).toBe(2);
  });

  it('given training earlier today, when recording again, then keeps the streak', () => {
    const today = recordRound(emptyProgress, summary, '2026-10-31');
    expect(recordRound(today, summary, '2026-10-31').streak).toBe(1);
  });

  it('given a gap of two days, when recording, then restarts the streak', () => {
    const old = recordRound(emptyProgress, summary, '2026-10-28');
    expect(recordRound(old, summary, '2026-10-31').streak).toBe(1);
  });

  it('given more than 20 rounds, when recording, then keeps only the last 20', () => {
    let progress = emptyProgress;
    for (let i = 0; i < 25; i++) progress = recordRound(progress, summary, '2026-10-31');
    expect(progress.history).toHaveLength(20);
  });
});

describe('per skill', () => {
  it('given an attention session, when recording, then it does not count as solved questions', () => {
    const progress = recordRound(emptyProgress, { skill: 'focused', correct: 30, total: 36 }, '2026-10-31');
    expect(progress.questionsSolved).toBe(0);
    expect(progress.streak).toBe(1);
  });

  it('given sessions of different skills, when reading the last share, then each skill keeps its latest result', () => {
    let progress = recordRound(emptyProgress, { skill: 'memory', correct: 2, total: 4 }, '2026-10-31');
    progress = recordRound(progress, { skill: 'memory', correct: 3, total: 4 }, '2026-10-31');
    progress = recordRound(progress, summary, '2026-10-31');
    expect(lastShareBySkill(progress)).toEqual({ memory: 0.75, reasoning: 0.7 });
  });

  it('given history saved before skills existed, when reading, then it counts as reasoning', () => {
    const legacy = { ...emptyProgress, history: [{ day: '2026-10-30', correct: 5, total: 10 }] };
    expect(lastShareBySkill(legacy)).toEqual({ reasoning: 0.5 });
  });
});

describe('currentStreak', () => {
  it('given the last training two days ago, when reading the streak, then it is broken', () => {
    const progress = recordRound(emptyProgress, summary, '2026-10-29');
    expect(currentStreak(progress, '2026-10-31')).toBe(0);
  });
});

describe('dayKey', () => {
  it('given a local date, when formatting, then pads month and day', () => {
    expect(dayKey(new Date(2026, 0, 5))).toBe('2026-01-05');
  });
});
