import { reasoningQuestions } from './content/reasoning';
import { emptyProgress, recordRound, type Progress, type SessionEntry } from './domain/progress';
import { isFinished, startRound, summarize, type Round, type RoundSummary } from './domain/reasoning';
import { keys, readJson, removeKey, writeJson } from './storage/store';

export const QUICK_ROUND_SIZE = 10;
export const EXAM_ROUND_SIZE = 30;

export function loadRound(): Round | null {
  const round = readJson<Round | null>(keys.round, null);
  if (!round || isFinished(round)) return null;
  return round.questionIds.every((id) => questionById(id)) ? round : null;
}

export function newRound(size: number): Round {
  const round = startRound(reasoningQuestions, size, Date.now(), Date.now());
  writeJson(keys.round, round);
  return round;
}

export function saveRound(round: Round): void {
  writeJson(keys.round, round);
}

export function finishRound(round: Round, today: string): RoundSummary {
  const summary = summarize(round, reasoningQuestions, Date.now());
  recordSession({ skill: 'reasoning', correct: summary.correct, total: summary.total }, today);
  removeKey(keys.round);
  return summary;
}

export function recordSession(entry: SessionEntry, today: string): void {
  writeJson(keys.progress, recordRound(loadProgress(), entry, today));
}

export function loadProgress(): Progress {
  return readJson(keys.progress, emptyProgress);
}

export function questionById(id: number) {
  return reasoningQuestions.find((q) => q.id === id);
}
