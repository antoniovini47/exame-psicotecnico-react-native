import { SKILL_LABELS, type Skill } from './progress';

export interface StepResult {
  skill: Skill;
  correct: number;
  total: number;
  detail: string;
  wrongIds?: number[];
}

export const FULL_EXAM: readonly Skill[] = ['focused', 'divided', 'memory', 'reasoning'];

const isSkill = (value: unknown): value is Skill => typeof value === 'string' && value in SKILL_LABELS;
const isCount = (value: unknown): value is number => Number.isInteger(value) && (value as number) >= 0;

function isStepResult(value: unknown): value is StepResult {
  if (typeof value !== 'object' || value === null) return false;
  const step = value as Record<string, unknown>;
  return (
    isSkill(step.skill) &&
    isCount(step.correct) &&
    isCount(step.total) &&
    typeof step.detail === 'string' &&
    (step.wrongIds === undefined || (Array.isArray(step.wrongIds) && step.wrongIds.every(isCount)))
  );
}

export function parseSteps(raw: string | undefined): StepResult[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isStepResult) : [];
  } catch {
    return [];
  }
}

export function parseChain(raw: string | undefined): Skill[] {
  return raw ? raw.split(',').filter(isSkill) : [];
}

export function overallShare(steps: readonly StepResult[]): number {
  const total = steps.reduce((sum, step) => sum + step.total, 0);
  return total ? steps.reduce((sum, step) => sum + step.correct, 0) / total : 0;
}
