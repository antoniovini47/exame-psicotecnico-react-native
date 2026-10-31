export type Skill = 'reasoning' | 'focused' | 'divided' | 'memory';

export const SKILL_LABELS: Record<Skill, string> = {
  reasoning: 'Raciocínio lógico',
  focused: 'Atenção concentrada',
  divided: 'Atenção dividida',
  memory: 'Memória visual',
};

export interface SessionEntry {
  skill: Skill;
  correct: number;
  total: number;
}

export interface Progress {
  streak: number;
  lastDay: string | null;
  questionsSolved: number;
  history: { day: string; correct: number; total: number; skill?: Skill }[];
}

export const emptyProgress: Progress = { streak: 0, lastDay: null, questionsSolved: 0, history: [] };

const HISTORY_LIMIT = 20;

export function dayKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

function previousDay(day: string): string {
  const [y, m, d] = day.split('-').map(Number);
  return dayKey(new Date(y, m - 1, d - 1));
}

export function currentStreak(progress: Progress, today: string): number {
  if (progress.lastDay === today || progress.lastDay === previousDay(today)) return progress.streak;
  return 0;
}

export function recordRound(progress: Progress, entry: SessionEntry, today: string): Progress {
  const streak =
    progress.lastDay === today
      ? progress.streak
      : progress.lastDay === previousDay(today)
        ? progress.streak + 1
        : 1;
  return {
    streak,
    lastDay: today,
    questionsSolved: progress.questionsSolved + (entry.skill === 'reasoning' ? entry.total : 0),
    history: [...progress.history, { day: today, ...entry }].slice(-HISTORY_LIMIT),
  };
}

export function lastShareBySkill(progress: Progress): Partial<Record<Skill, number>> {
  const result: Partial<Record<Skill, number>> = {};
  for (const entry of progress.history) {
    result[entry.skill ?? 'reasoning'] = entry.total ? entry.correct / entry.total : 0;
  }
  return result;
}
