export const INTERSTITIAL_MIN_GAP_MS = 3 * 60 * 1000;
export const AD_FREE_REWARD_MS = 24 * 60 * 60 * 1000;

export function canShowInterstitial(lastShownAt: number | null, adFreeUntil: number | null, now: number): boolean {
  if (adFreeUntil !== null && now < adFreeUntil) return false;
  return lastShownAt === null || now - lastShownAt >= INTERSTITIAL_MIN_GAP_MS;
}

export function adFreeUntilAfterReward(now: number): number {
  return now + AD_FREE_REWARD_MS;
}
