import type { useRouter } from 'expo-router';
import { track } from './analytics';
import { overallShare, parseChain, parseSteps, type StepResult } from './domain/exam';
import { dayKey, type Skill } from './domain/progress';
import { EXAM_ROUND_SIZE, loadRound, QUICK_ROUND_SIZE, recordSession } from './session';

type AppRouter = ReturnType<typeof useRouter>;

export type FlowParams = {
  chain?: string;
  steps?: string;
  startedAt?: string;
};

const ROUTES: Record<Skill, '/atencao' | '/dividida' | '/memoria' | '/rodada'> = {
  focused: '/atencao',
  divided: '/dividida',
  memory: '/memoria',
  reasoning: '/rodada',
};

const percent = (correct: number, total: number) => (total ? Math.round((correct / total) * 100) : 0);

export function startFlow(router: AppRouter, skills: readonly Skill[]): void {
  const [first, ...rest] = skills;
  track('flow_start', { skills: skills.join(','), mode: skills.length > 1 ? 'exam' : 'skill' });
  router.push({
    pathname: ROUTES[first],
    params: { chain: rest.join(','), startedAt: String(Date.now()), fresh: '1', size: String(EXAM_ROUND_SIZE) },
  });
}

export function startQuickRound(router: AppRouter): void {
  track('flow_start', { skills: 'reasoning', mode: loadRound() ? 'resume' : 'skill' });
  router.push({ pathname: '/rodada', params: { size: String(QUICK_ROUND_SIZE) } });
}

export function completeStep(router: AppRouter, result: StepResult, params: FlowParams, recorded = false): void {
  if (!recorded) recordSession({ skill: result.skill, correct: result.correct, total: result.total }, dayKey(new Date()));
  const steps = [...parseSteps(params.steps), result];
  const startedAt = Number(params.startedAt) || Date.now();
  const [next, ...rest] = parseChain(params.chain);
  track('step_complete', { skill: result.skill, correct: result.correct, total: result.total, score_pct: percent(result.correct, result.total) });
  if (next) {
    router.replace({
      pathname: ROUTES[next],
      params: { chain: rest.join(','), steps: JSON.stringify(steps), startedAt: String(startedAt), fresh: '1', size: String(EXAM_ROUND_SIZE) },
    });
    return;
  }
  const minutes = Math.max(1, Math.round((Date.now() - startedAt) / 60000));
  track('flow_complete', {
    skills: steps.map((step) => step.skill).join(','),
    mode: steps.length > 1 ? 'exam' : 'skill',
    score_pct: Math.round(overallShare(steps) * 100),
    minutes,
  });
  router.replace({ pathname: '/resultado', params: { steps: JSON.stringify(steps), minutes: String(minutes) } });
}
