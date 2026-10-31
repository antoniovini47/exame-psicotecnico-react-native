import { createRng } from './random';
import { addScores, emptyScore, type TaskScore } from './score';

export type Shape = 'circle' | 'square' | 'triangle' | 'diamond';

export const SHAPES: readonly Shape[] = ['circle', 'square', 'triangle', 'diamond'];

export interface Trial {
  digit: number;
  shape: Shape;
}

export interface TrialResponse {
  even: boolean;
  circle: boolean;
}

export const TRIALS_PER_SESSION = 24;
export const TRIAL_MS = 2000;

const TARGET_CHANCE = 0.35;

export const isEvenTarget = (trial: Trial) => trial.digit % 2 === 0;
export const isCircleTarget = (trial: Trial) => trial.shape === 'circle';

function pick<T>(items: readonly T[], rng: () => number): T {
  return items[Math.floor(rng() * items.length)];
}

export function createTrials(seed: number, count = TRIALS_PER_SESSION): Trial[] {
  const rng = createRng(seed);
  const evens = [2, 4, 6, 8];
  const odds = [1, 3, 5, 7, 9];
  const notCircle = SHAPES.filter((shape) => shape !== 'circle');
  return Array.from({ length: count }, () => ({
    digit: pick(rng() < TARGET_CHANCE ? evens : odds, rng),
    shape: rng() < TARGET_CHANCE ? 'circle' : pick(notCircle, rng),
  }));
}

function channel(target: boolean, pressed: boolean): TaskScore {
  return {
    targets: target ? 1 : 0,
    hits: target && pressed ? 1 : 0,
    misses: target && !pressed ? 1 : 0,
    falseAlarms: !target && pressed ? 1 : 0,
  };
}

export function scoreTrials(trials: readonly Trial[], responses: readonly TrialResponse[]): TaskScore {
  return trials.reduce((total, trial, i) => {
    const response = responses[i] ?? { even: false, circle: false };
    const trialScore = addScores(channel(isEvenTarget(trial), response.even), channel(isCircleTarget(trial), response.circle));
    return addScores(total, trialScore);
  }, emptyScore);
}
