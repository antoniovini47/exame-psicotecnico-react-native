import { createRng, shuffle } from './random';

export interface Question {
  id: number;
  prompt: string;
  image?: number;
  options: string[];
  answer: number;
  explanation: string;
}

export interface Round {
  seed: number;
  questionIds: number[];
  answers: (number | null)[];
  startedAt: number;
}

export interface RoundSummary {
  total: number;
  correct: number;
  wrongIds: number[];
  durationMs: number;
}

export function startRound(bank: readonly Question[], size: number, seed: number, now: number): Round {
  const picked = shuffle(bank, createRng(seed)).slice(0, Math.min(size, bank.length));
  return {
    seed,
    questionIds: picked.map((q) => q.id),
    answers: picked.map(() => null),
    startedAt: now,
  };
}

export function currentIndex(round: Round): number {
  const index = round.answers.indexOf(null);
  return index === -1 ? round.answers.length : index;
}

export function isFinished(round: Round): boolean {
  return currentIndex(round) === round.answers.length;
}

export function answerCurrent(round: Round, choice: number): Round {
  const index = currentIndex(round);
  if (index >= round.answers.length) return round;
  const answers = [...round.answers];
  answers[index] = choice;
  return { ...round, answers };
}

export function summarize(round: Round, bank: readonly Question[], now: number): RoundSummary {
  const byId = new Map(bank.map((q) => [q.id, q]));
  const wrongIds = round.questionIds.filter((id, i) => byId.get(id)?.answer !== round.answers[i]);
  return {
    total: round.questionIds.length,
    correct: round.questionIds.length - wrongIds.length,
    wrongIds,
    durationMs: now - round.startedAt,
  };
}
