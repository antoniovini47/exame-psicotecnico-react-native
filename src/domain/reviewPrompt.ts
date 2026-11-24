export const REVIEW_MIN_SHARE = 0.8;
export const REVIEW_MIN_GAP_MS = 90 * 24 * 60 * 60 * 1000;

export function shouldAskReview(share: number, lastAskedAt: number | null, now: number): boolean {
  if (share < REVIEW_MIN_SHARE) return false;
  return lastAskedAt === null || now - lastAskedAt >= REVIEW_MIN_GAP_MS;
}
