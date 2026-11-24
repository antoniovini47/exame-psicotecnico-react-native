import * as StoreReview from 'expo-store-review';
import { track } from './analytics';
import { shouldAskReview } from './domain/reviewPrompt';
import { keys, readJson, writeJson } from './storage/store';

export async function maybeAskReview(share: number): Promise<boolean> {
  const now = Date.now();
  if (!shouldAskReview(share, readJson<number | null>(keys.reviewAskedAt, null), now)) return false;
  if (!(await StoreReview.hasAction())) return false;
  writeJson(keys.reviewAskedAt, now);
  track('review_prompt', { score_pct: Math.round(share * 100) });
  await StoreReview.requestReview();
  return true;
}
